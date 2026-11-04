import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { createServer } from 'node:net'

test('private storage preserves originals, ranges, names and files after restart', async () => {
  const storage = await mkdtemp(path.join(tmpdir(), 'mikam-fileshare-test-'))
  const socket = createServer()
  await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve))
  const port = socket.address().port
  await new Promise(resolve => socket.close(resolve))
  const base = `http://127.0.0.1:${port}/api/fileshare`
  let child
  async function start() {
    child = spawn(process.execPath, ['server/index.mjs'], { env: { ...process.env, NODE_ENV: 'test', FILESHARE_STORAGE: storage, FILESHARE_PASSWORD: 'test-password', FILESHARE_MAX_BYTES: '2048', FILESHARE_ORIGIN: 'https://mikam.cloud', PORT: String(port) }, stdio: 'pipe' })
    let output = ''
    child.stderr.on('data', chunk => { output += chunk })
    for (let i = 0; i < 100; i++) {
      if (child.exitCode !== null) throw new Error(output)
      try { if ((await fetch(base)).status === 401) return } catch {}
      await setTimeout(50)
    }
    throw new Error('Server did not start')
  }
  async function stop() {
    const done = new Promise(resolve => child.once('exit', resolve))
    child.kill(); await done
  }
  try {
    await start()
    assert.equal((await fetch(base)).status, 401)
    assert.equal((await fetch(`${base}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'wrong' }) })).status, 401)
    async function login(value = 'test-password') {
      const response = await fetch(`${base}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: value }) })
      assert.equal(response.status, 200)
      return response.headers.get('set-cookie').split(';')[0]
    }
    let cookie = await login()
    const original = Buffer.from([0, 1, 2, 255, 128, 13, 10, 0, 50, 60])
    const entries = []
    for (const [folder, name] of [['pliki', 'zażółć.bin'], ['zdjecia', 'foto.png'], ['filmy', 'film.mp4'], ['muzyka', 'utwór.mp3']]) {
      const response = await fetch(`${base}/${folder}`, { method: 'PUT', headers: { Cookie: cookie, 'X-File-Name': encodeURIComponent(name) }, body: original })
      assert.equal(response.status, 201)
      const meta = await response.json(); entries.push(meta)
      assert.equal(meta.name, name); assert.equal(meta.size, original.length)
      const download = await fetch(`${base}/${folder}/${meta.id}?download=1`, { headers: { Cookie: cookie } })
      assert.equal(download.headers.get('content-encoding'), null)
      assert.deepEqual(Buffer.from(await download.arrayBuffer()), original)
      const range = await fetch(`${base}/${folder}/${meta.id}`, { headers: { Cookie: cookie, Range: 'bytes=2-5' } })
      assert.equal(range.status, 206)
      assert.deepEqual(Buffer.from(await range.arrayBuffer()), original.subarray(2, 6))
    }
    const list = await (await fetch(base, { headers: { Cookie: cookie } })).json()
    assert.equal(list.files.length, 4)
    for (const [folder, name, status] of [['zdjecia', 'bad.svg', 415], ['filmy', 'bad.html', 415], ['pliki', '../oops', 400], ['unknown', 'bad.bin', 404]]) {
      assert.equal((await fetch(`${base}/${folder}`, { method: 'PUT', headers: { Cookie: cookie, 'X-File-Name': encodeURIComponent(name) }, body: original })).status, status)
    }
    assert.equal((await fetch(`${base}/pliki`, { method: 'PUT', headers: { Cookie: cookie, 'X-File-Name': 'large.bin' }, body: Buffer.alloc(2049) })).status, 413)
    assert.equal((await fetch(`${base}/pliki`, { method: 'PUT', headers: { Cookie: cookie, Origin: 'https://attacker.invalid', 'X-File-Name': 'bad.bin' }, body: original })).status, 403)
    const upload = await fetch(`${base}/pliki`, { method: 'PUT', headers: { Cookie: cookie, 'X-File-Name': 'website.html' }, body: '<script>alert(1)</script>' })
    const html = await upload.json()
    const unsafe = await fetch(`${base}/pliki/${html.id}`, { headers: { Cookie: cookie } })
    assert.match(unsafe.headers.get('content-disposition'), /^attachment/)
    assert.match(unsafe.headers.get('content-type'), /application\/octet-stream/)
    await stop(); await start(); cookie = await login()
    const persistent = await (await fetch(base, { headers: { Cookie: cookie } })).json()
    assert.equal(persistent.files.length, 5)
    assert.deepEqual(Buffer.from(await (await fetch(`${base}/pliki/${entries[0].id}`, { headers: { Cookie: cookie } })).arrayBuffer()), original)
    const deletedUrl = `${base}/filmy/${entries[2].id}`
    assert.equal((await fetch(deletedUrl, { method: 'DELETE' })).status, 401)
    assert.equal((await fetch(deletedUrl, { method: 'DELETE', headers: { Cookie: cookie, Origin: 'https://attacker.invalid' } })).status, 403)
    const preflight = await fetch(deletedUrl, { method: 'OPTIONS', headers: { Origin: 'https://mikam.cloud', 'Access-Control-Request-Method': 'DELETE' } })
    assert.match(preflight.headers.get('access-control-allow-methods'), /DELETE/)
    assert.equal((await fetch(deletedUrl, { method: 'DELETE', headers: { Cookie: cookie, Origin: 'https://mikam.cloud' } })).status, 204)
    await assert.rejects(stat(path.join(storage, 'filmy', `${entries[2].id}.bin`)), { code: 'ENOENT' })
    await assert.rejects(stat(path.join(storage, 'filmy', `${entries[2].id}.json`)), { code: 'ENOENT' })
    assert.equal((await fetch(deletedUrl, { headers: { Cookie: cookie } })).status, 404)
    assert.equal((await fetch(deletedUrl, { method: 'DELETE', headers: { Cookie: cookie } })).status, 404)
    assert.equal((await (await fetch(base, { headers: { Cookie: cookie } })).json()).files.length, 4)
    assert.deepEqual(Buffer.from(await (await fetch(`${base}/pliki/${entries[0].id}`, { headers: { Cookie: cookie } })).arrayBuffer()), original)
    await stop(); await start(); cookie = await login()
    assert.equal((await fetch(deletedUrl, { headers: { Cookie: cookie } })).status, 404)
    const passwordUrl = `${base}/password`
    const change = body => fetch(passwordUrl, { method: 'POST', headers: { Cookie: cookie, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    assert.equal((await change({ currentPassword: 'wrong', newPassword: 'new-password' })).status, 403)
    assert.equal((await change({ currentPassword: 'test-password', newPassword: 'short' })).status, 400)
    assert.equal((await change({ currentPassword: 'test-password', newPassword: 'new-password' })).status, 200)
    assert.equal((await fetch(base, { headers: { Cookie: cookie } })).status, 401)
    assert.equal((await fetch(`${base}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'test-password' }) })).status, 401)
    cookie = await login('new-password')
    await stop(); await start(); cookie = await login('new-password')
    assert.equal((await fetch(`${base}/logout`, { method: 'POST', headers: { Cookie: cookie } })).status, 200)
    assert.equal((await fetch(base, { headers: { Cookie: cookie } })).status, 401)
  } finally {
    if (child?.exitCode === null) await stop()
    await rm(storage, { recursive: true, force: true })
  }
})
