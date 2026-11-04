import express from 'express'
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import { mkdir, readdir, readFile, writeFile, rename, rm, stat, statfs } from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { Transform } from 'node:stream'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mime from 'mime-types'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const storage = path.resolve(process.env.FILESHARE_STORAGE || path.join(root, 'fileshare-data'))
const password = process.env.FILESHARE_PASSWORD
if (!password) throw new Error('Ustaw FILESHARE_PASSWORD przed uruchomieniem serwera.')
const maxBytes = Number(process.env.FILESHARE_MAX_BYTES || 21474836480)
if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) throw new Error('Niepoprawny FILESHARE_MAX_BYTES')
const folders = ['pliki', 'filmy', 'zdjecia', 'muzyka']
const allowedOrigin = process.env.FILESHARE_ORIGIN
for (const folder of folders) {
  await mkdir(path.join(storage, folder), { recursive: true })
  // Interrupted uploads are never published in the library.
  for (const name of await readdir(path.join(storage, folder))) {
    if (name.endsWith('.part')) await rm(path.join(storage, folder, name), { force: true })
  }
}
const app = express()
app.disable('x-powered-by')
const sessions = new Map()
const attempts = new Map()
const cookieName = 'mikam_fileshare'
const cookieOptions = { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/api/fileshare', maxAge: 86400000 }
const credentialPath = path.join(storage, '.password.json')
const makeCredential = value => {
  const salt = randomBytes(16).toString('hex')
  return { salt, hash: scryptSync(value, salt, 32).toString('hex') }
}
let credential
try { credential = JSON.parse(await readFile(credentialPath, 'utf8')) }
catch (error) { if (error.code !== 'ENOENT') throw error; credential = makeCredential(password) }
if (!/^[a-f0-9]{32}$/.test(credential.salt) || !/^[a-f0-9]{64}$/.test(credential.hash)) throw new Error('Niepoprawny plik hasła')
const matchesPassword = value => typeof value === 'string' && value.length <= 256 && timingSafeEqual(scryptSync(value, credential.salt, 32), Buffer.from(credential.hash, 'hex'))
setInterval(() => {
  for (const [key, expiry] of sessions) if (expiry < Date.now()) sessions.delete(key)
  for (const [key, attempt] of attempts) if (attempt.until < Date.now()) attempts.delete(key)
}, 60000).unref()

app.use('/api/fileshare', (req, res, next) => {
  res.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
  const origin = req.get('origin')
  if (origin && origin === allowedOrigin) {
    res.set({ 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Credentials': 'true', 'Access-Control-Allow-Headers': 'Content-Type, X-File-Name', 'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS', Vary: 'Origin' })
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    if (req.get('sec-fetch-site') === 'cross-site' || (origin && origin !== allowedOrigin && new URL(origin).host !== req.get('host'))) {
      return res.status(403).json({ error: 'Niedozwolone źródło żądania.' })
    }
  }
  next()
})
app.post('/api/fileshare/login', express.json({ limit: '2kb' }), (req, res) => {
  const key = req.socket.remoteAddress
  const attempt = attempts.get(key) || { count: 0, until: Date.now() + 900000 }
  if (attempt.count >= 10) return res.status(429).json({ error: 'Zbyt wiele prób. Spróbuj za 15 minut.' })
  if (!matchesPassword(req.body?.password)) {
    attempt.count++; attempts.set(key, attempt)
    return res.status(401).json({ error: 'Nieprawidłowe hasło.' })
  }
  attempts.delete(key)
  const token = randomBytes(32).toString('hex')
  sessions.set(token, Date.now() + 86400000)
  res.cookie(cookieName, token, cookieOptions).json({ ok: true })
})
app.use('/api/fileshare', (req, res, next) => {
  const token = (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1)
  if (!token || (sessions.get(token) || 0) < Date.now()) return res.status(401).json({ error: 'Zaloguj się, aby otworzyć bibliotekę.' })
  req.sessionToken = token
  next()
})
app.post('/api/fileshare/logout', (req, res) => {
  sessions.delete(req.sessionToken)
  res.clearCookie(cookieName, cookieOptions).json({ ok: true })
})
app.post('/api/fileshare/password', express.json({ limit: '2kb' }), async (req, res) => {
  if (!matchesPassword(req.body?.currentPassword)) return res.status(403).json({ error: 'Nieprawidłowe aktualne hasło.' })
  const nextPassword = req.body?.newPassword
  if (typeof nextPassword !== 'string' || nextPassword.length < 8 || nextPassword.length > 256) return res.status(400).json({ error: 'Hasło musi mieć od 8 do 256 znaków.' })
  const nextCredential = makeCredential(nextPassword)
  const temporary = `${credentialPath}.${randomUUID()}.part`
  await writeFile(temporary, JSON.stringify(nextCredential), { mode: 0o600, flag: 'wx' })
  await rename(temporary, credentialPath)
  credential = nextCredential
  sessions.clear()
  res.clearCookie(cookieName, cookieOptions).json({ ok: true })
})
async function listFiles(folder) {
  const names = await readdir(path.join(storage, folder))
  const files = await Promise.all(names.filter(name => name.endsWith('.json')).map(async name => {
    try {
      const meta = JSON.parse(await readFile(path.join(storage, folder, name), 'utf8'))
      await stat(path.join(storage, folder, `${meta.id}.bin`))
      return meta
    } catch (error) {
      if (error.code === 'ENOENT') return null // A file can be deleted while listing.
      throw error
    }
  }))
  return files.filter(Boolean)
}
app.get('/api/fileshare', async (_req, res) => {
  const groups = await Promise.all(folders.map(listFiles))
  res.json({ files: groups.flat().sort((a, b) => b.createdAt.localeCompare(a.createdAt)), maxBytes })
})
app.param('folder', (req, res, next, folder) => folders.includes(folder) ? next() : res.status(404).json({ error: 'Nie ma takiego folderu.' }))
app.param('id', (req, res, next, id) => /^[0-9a-f-]{36}$/.test(id) ? next() : res.status(404).json({ error: 'Nie ma takiego pliku.' }))
app.put('/api/fileshare/:folder', async (req, res, next) => {
  const folder = req.params.folder
  let name
  try { name = decodeURIComponent(req.get('x-file-name') || '') } catch { return res.status(400).json({ error: 'Nieprawidłowa nazwa pliku.' }) }
  if (!name || name.length > 240 || /[\x00-\x1f/\\]/.test(name)) return res.status(400).json({ error: 'Nieprawidłowa nazwa pliku.' })
  const type = mime.lookup(name) || 'application/octet-stream'
  const allowed = { filmy: /^video\//, zdjecia: /^image\/(?!svg)/, muzyka: /^audio\// }
  if (folder !== 'pliki' && !allowed[folder].test(type)) return res.status(415).json({ error: 'Ten format nie pasuje do wybranego folderu. Użyj folderu Pliki.' })
  if (Number(req.get('content-length')) > maxBytes) return res.status(413).json({ error: 'Plik przekracza limit rozmiaru.' })
  const disk = await statfs(storage)
  if (Number(req.get('content-length') || 0) + 1073741824 > disk.bavail * disk.bsize) return res.status(507).json({ error: 'Za mało miejsca na serwerze. Pozostawiamy 1 GB dla systemu.' })
  const id = randomUUID()
  const base = path.join(storage, folder, id)
  let size = 0
  const limiter = new Transform({ transform(chunk, _encoding, callback) {
    size += chunk.length
    callback(size > maxBytes ? Object.assign(new Error('Plik przekracza limit rozmiaru.'), { status: 413 }) : null, chunk)
  } })
  try {
    await pipeline(req, limiter, createWriteStream(`${base}.part`, { flags: 'wx' }))
    const meta = { id, folder, name, type, size, createdAt: new Date().toISOString() }
    await rename(`${base}.part`, `${base}.bin`)
    await writeFile(`${base}.json.part`, JSON.stringify(meta), { flag: 'wx' })
    await rename(`${base}.json.part`, `${base}.json`)
    res.status(201).json(meta)
  } catch (error) {
    await Promise.all(['.part', '.bin', '.json.part'].map(ext => rm(`${base}${ext}`, { force: true })))
    next(error)
  }
})
app.delete('/api/fileshare/:folder/:id', async (req, res) => {
  const base = path.join(storage, req.params.folder, req.params.id)
  await rename(`${base}.json`, `${base}.json.deleting`)
  try {
    await rm(`${base}.bin`, { force: true })
  } catch (error) {
    await rename(`${base}.json.deleting`, `${base}.json`)
    throw error
  }
  await rm(`${base}.json.deleting`, { force: true })
  res.sendStatus(204)
})
app.get('/api/fileshare/:folder/:id', async (req, res, next) => {
  const base = path.join(storage, req.params.folder, req.params.id)
  try {
    const meta = JSON.parse(await readFile(`${base}.json`, 'utf8'))
    const download = req.query.download === '1' || meta.folder === 'pliki'
    res.set('Content-Type', download ? 'application/octet-stream' : meta.type)
    res.set('Content-Disposition', `${download ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(meta.name).replace(/'/g, '%27')}`)
    res.set('Content-Security-Policy', "default-src 'none'; sandbox")
    res.sendFile(`${base}.bin`, { acceptRanges: true, cacheControl: false }, error => { if (error) next(error) })
  } catch (error) { next(error) }
})
app.use('/api', (_req, res) => res.status(404).json({ error: 'Nie znaleziono.' }))
app.use(express.static(path.join(root, 'dist')))
app.get('/{*path}', (_req, res) => res.sendFile(path.join(root, 'dist/index.html')))
app.use((error, _req, res, _next) => {
  if (res.headersSent) return res.end()
  const status = error.code === 'ENOENT' ? 404 : error.status || 500
  if (status >= 500) console.error(error)
  res.status(status).json({ error: status === 404 ? 'Nie znaleziono pliku.' : status === 413 ? 'Plik przekracza limit rozmiaru.' : 'Nie udało się wykonać operacji. Spróbuj ponownie.' })
})
const server = app.listen(Number(process.env.PORT || 3001), process.env.HOST || '127.0.0.1', () => console.log('FileShare: serwer gotowy'))
server.requestTimeout = 0
