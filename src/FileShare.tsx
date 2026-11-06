import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './fileshare.css'

const folders = [
  { id: 'pliki', label: 'Pliki', icon: 'file', description: 'Dokumenty i pozostałe pliki', accept: '' },
  { id: 'filmy', label: 'Filmy', icon: 'video', description: 'Duży ekran. Pełna jakość.', accept: 'video/*' },
  { id: 'zdjecia', label: 'Zdjęcia', icon: 'image', description: 'Każdy detal w oryginale.', accept: 'image/*' },
  { id: 'muzyka', label: 'Muzyka', icon: 'music', description: 'Twoje brzmienie, bez strat.', accept: 'audio/*' },
] as const
type Folder = typeof folders[number]['id']
type StoredFile = { id: string; folder: Folder; name: string; type: string; size: number; createdAt: string }
type QueueItem = { name: string; progress: number; status: 'waiting' | 'uploading' | 'done' | 'error'; error?: string }
function Icon({ name }: { name: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === 'trash' ? <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></> : name === 'video' ? <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m10 9 5 3-5 3Z" /></> : name === 'image' ? <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="1.5" /><path d="m4 18 5-5 4 4 3-3 5 5" /></> : name === 'music' ? <><path d="M9 18V5l11-2v13M9 9l11-2" /><ellipse cx="6" cy="18" rx="3" ry="3" /><ellipse cx="17" cy="16" rx="3" ry="3" /></> : name === 'upload' ? <><path d="M12 16V3m-5 5 5-5 5 5M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" /></> : name === 'folder' ? <path d="M3 7V5a2 2 0 0 1 2-2h5l3 4h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /> : <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>}</svg>
}
function bytes(value: number) {
  if (value === 0) return '0 B'
  const unit = Math.min(Math.floor(Math.log(value) / Math.log(1024)), 4)
  return `${new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 1 }).format(value / 1024 ** unit)} ${['B', 'KB', 'MB', 'GB', 'TB'][unit]}`
}
const api = `${(import.meta.env.VITE_FILESHARE_ORIGIN || '').replace(/\/$/, '')}/api/fileshare`
const apiFetch = (url: string, options?: RequestInit) => fetch(url, { ...options, credentials: 'include' })
const fileUrl = (file: StoredFile) => `${api}/${file.folder}/${file.id}`
const isTextFile = (file: StoredFile) => /\.(txt|md)$/i.test(file.name)

function TextPreview({ file }: { file: StoredFile }) {
  const [text, setText] = useState<string | null>(null)
  const [error, setError] = useState('')
  const limit = 1024 * 1024
  useEffect(() => {
    const controller = new AbortController()
    async function read() {
      try {
        const response = await apiFetch(fileUrl(file), { signal: controller.signal, headers: file.size > limit ? { Range: `bytes=0-${limit - 1}` } : undefined })
        if (!response.ok) throw new Error(response.status === 401 ? 'Sesja wygasła. Zaloguj się ponownie.' : 'Nie udało się wczytać tekstu. Spróbuj ponownie lub pobierz plik.')
        const reader = response.body?.getReader()
        if (!reader) throw new Error('Nie udało się wczytać tekstu.')
        const chunks: Uint8Array[] = []
        let size = 0
        try {
          while (size < limit) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = value.subarray(0, limit - size)
            chunks.push(chunk); size += chunk.length
          }
        } finally { await reader.cancel() }
        const buffer = new Uint8Array(size)
        let offset = 0
        for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.length }
        const encoding = buffer[0] === 255 && buffer[1] === 254 ? 'utf-16le' : buffer[0] === 254 && buffer[1] === 255 ? 'utf-16be' : 'utf-8'
        if (!controller.signal.aborted) setText(new TextDecoder(encoding).decode(buffer, { stream: file.size > limit }))
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Nie udało się wczytać tekstu.')
      }
    }
    void read()
    return () => controller.abort()
  }, [file])
  return <div className="fs-text-preview">{error ? <p className="fs-error" role="alert">{error}</p> : text === null ? <p role="status">Wczytywanie tekstu…</p> : text === '' ? <p>Ten plik jest pusty.</p> : <pre tabIndex={0} aria-label={`Treść pliku ${file.name}`}>{text}</pre>}{!error && text !== null && file.size > limit && <p className="fs-text-limit">Pokazano pierwszy 1 MB tekstu. Pobierz oryginał, aby przeczytać cały plik.</p>}</div>
}

function ImageThumbnail({ file }: { file: StoredFile }) {
  const [failed, setFailed] = useState(false)
  return failed ? <><Icon name="image" /><span>Otwórz zdjęcie ↗</span></> : <img src={fileUrl(file)} alt={file.name} loading="lazy" onError={() => setFailed(true)} />
}

function VideoThumbnail({ file }: { file: StoredFile }) {
  const element = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(false)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const video = element.current
    if (!video) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setActive(true); observer.disconnect() }
    }, { rootMargin: '200px' })
    observer.observe(video)
    return () => observer.disconnect()
  }, [])
  return <>
    {!failed && <video ref={element} className={`fs-video-frame ${ready ? 'is-ready' : ''}`} src={active ? fileUrl(file) : undefined} preload="metadata" muted playsInline tabIndex={-1} aria-hidden="true"
      onLoadedMetadata={event => {
        const video = event.currentTarget
        if (Number.isFinite(video.duration) && video.duration > 0) video.currentTime = Math.min(1, video.duration / 2)
      }} onLoadedData={() => setReady(true)} onSeeked={() => setReady(true)} onError={() => setFailed(true)} />}
    {(!ready || failed) && <span className="fs-video-fallback"><Icon name="video" /><span>{failed ? 'Otwórz film ↗' : 'Wczytywanie klatki…'}</span></span>}
    {ready && !failed && <span className="fs-video-play"><Icon name="video" /></span>}
  </>
}

export function FileShare() {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [files, setFiles] = useState<StoredFile[]>([])
  const [folder, setFolder] = useState<Folder>('pliki')
  const [maxBytes, setMaxBytes] = useState(0)
  const [query, setQuery] = useState('')
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState<StoredFile | null>(null)
  const [mediaError, setMediaError] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<StoredFile | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const deleteDialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const activeRequest = useRef<XMLHttpRequest | null>(null)
  const activeFolder = folders.find(item => item.id === folder)!

  async function refresh() {
    const response = await apiFetch(api)
    if (response.status === 401) { setAuthorized(false); return }
    if (!response.ok) throw new Error('Nie udało się wczytać biblioteki. Sprawdź połączenie i spróbuj ponownie.')
    const data = await response.json()
    setFiles(data.files); setMaxBytes(data.maxBytes); setAuthorized(true)
  }
  useEffect(() => {
    document.title = 'FileShare — MIKAM'
    refresh().catch(err => setError(err.message)).finally(() => setLoading(false))
    return () => activeRequest.current?.abort()
  }, [])
  useEffect(() => {
    if (preview) { setMediaError(false); dialog.current?.showModal() }
    else dialog.current?.close()
  }, [preview])
  useEffect(() => {
    if (!uploading) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [uploading])
  async function login(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError('')
    try {
      const response = await apiFetch(`${api}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      if (!response.ok) throw new Error((await response.json()).error)
      setPassword(''); await refresh()
    } catch (err) { setError(err instanceof Error ? err.message : 'Nie udało się zalogować.') }
    finally { setLoading(false) }
  }
  useEffect(() => {
    if (deleteCandidate) deleteDialog.current?.showModal()
    else deleteDialog.current?.close()
  }, [deleteCandidate])
  async function deleteFile(file: StoredFile) {
    if (deleting) return
    setDeleting(file.id); setDeleteError('')
    try {
      const response = await apiFetch(fileUrl(file), { method: 'DELETE' })
      if (response.status === 401) { setAuthorized(false); setDeleteCandidate(null); setError('Sesja wygasła. Zaloguj się ponownie.'); return }
      if (!response.ok && response.status !== 404) throw new Error('Nie udało się usunąć pliku. Spróbuj ponownie.')
      setFiles(previous => previous.filter(item => item.id !== file.id))
      if (preview?.id === file.id) setPreview(null)
      setDeleteCandidate(null)
    } catch (err) { setDeleteError(err instanceof Error ? err.message : 'Nie udało się usunąć pliku.') }
    finally { setDeleting(null) }
  }
  async function upload(selected: FileList | File[]) {
    if (uploading || !selected.length) return
    const batch = Array.from(selected)
    const target = folder
    setUploading(true); setError('')
    setQueue(batch.map(file => ({ name: file.name, progress: 0, status: 'waiting' })))
    const update = (index: number, patch: Partial<QueueItem>) => setQueue(items => items.map((item, i) => i === index ? { ...item, ...patch } : item))
    for (const [index, file] of batch.entries()) {
      try {
        if (file.size > maxBytes) throw new Error(`Limit pliku: ${bytes(maxBytes)}.`)
        update(index, { status: 'uploading' })
        const stored = await new Promise<StoredFile>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          activeRequest.current = xhr
          xhr.open('PUT', `${api}/${target}`)
          xhr.withCredentials = true
          xhr.setRequestHeader('X-File-Name', encodeURIComponent(file.name))
          xhr.setRequestHeader('Content-Type', 'application/octet-stream')
          xhr.upload.onprogress = event => { if (event.lengthComputable) update(index, { progress: Math.round(event.loaded / event.total * 100) }) }
          xhr.onload = () => {
            let data
            try { data = JSON.parse(xhr.responseText) } catch { reject(new Error('Serwer nie przyjął pliku. Spróbuj ponownie.')); return }
            if (xhr.status === 401) setAuthorized(false)
            if (xhr.status >= 200 && xhr.status < 300) resolve(data)
            else reject(new Error(data.error || 'Nie udało się przesłać pliku.'))
          }
          xhr.onerror = () => reject(new Error('Połączenie zostało przerwane. Prześlij plik ponownie.'))
          xhr.onabort = () => reject(new Error('Przesyłanie anulowane.'))
          xhr.send(file)
        })
        setFiles(previous => [stored, ...previous]); update(index, { status: 'done', progress: 100 })
      } catch (err) { update(index, { status: 'error', error: err instanceof Error ? err.message : 'Błąd przesyłania.' }) }
    }
    activeRequest.current = null; setUploading(false)
    if (input.current) input.current.value = ''
  }
  const visible = files.filter(file => file.folder === folder && file.name.toLocaleLowerCase('pl').includes(query.toLocaleLowerCase('pl')))
  return <main className="fs-page">
    <header className="fs-header"><a href="/" className="logo">MIKAM<span>®</span></a><a href="/fileshare" className="fs-wordmark">FILESHARE <span>↗</span></a><div>{authorized ? <button className="fs-text-button" disabled={uploading} onClick={async () => { try { const response = await apiFetch(`${api}/logout`, { method: 'POST' }); if (!response.ok) throw new Error(); setAuthorized(false); setFiles([]); setQueue([]) } catch { setError('Nie udało się wylogować. Spróbuj ponownie.') } }}>Wyloguj się ↗</button> : <a href="/">Wróć na stronę ↗</a>}</div></header>
    {!authorized ? <section className="fs-login"><span className="fs-kicker">TWOJA PRYWATNA PRZESTRZEŃ</span><h1>Wszystko.<br /><em>W oryginale.</em></h1><p>Pliki, filmy, zdjęcia i muzyka.<br />Jedno miejsce. Bez utraty jakości.</p><form onSubmit={login}><label htmlFor="fs-password">Hasło dostępu</label><input id="fs-password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} disabled={loading} /><button className="fs-primary" disabled={loading}>{loading ? 'Łączenie…' : 'Otwórz bibliotekę ↗'}</button></form>{error && <p className="fs-error" role="alert">{error}</p>}</section> : <>
      <section className="fs-intro"><div><span className="fs-kicker">TWOJA BIBLIOTEKA / 01</span><h1>Wszystko.<br /><em>W oryginale.</em></h1></div><div className="fs-intro-side"><p>Przestrzeń na to, co chcesz zachować.<br />Pełna jakość. Zawsze pod ręką.</p><span className="fs-original"><i /> ORYGINAŁY · BEZ KOMPRESJI</span><small>{files.length} plików · {bytes(files.reduce((total, file) => total + file.size, 0))} w bibliotece</small></div></section>
      <nav className="fs-folders" aria-label="Foldery">{folders.map((item, index) => { const group = files.filter(file => file.folder === item.id); return <button key={item.id} className={`fs-folder ${folder === item.id ? 'is-active' : ''}`} aria-pressed={folder === item.id} onClick={() => { setFolder(item.id); setQuery('') }}><span className="fs-folder-top"><Icon name={item.icon} /><small>0{index + 1} /</small></span><strong>{item.label}<span>↗</span></strong><span>{group.length} plików <b>·</b> {bytes(group.reduce((total, file) => total + file.size, 0))}</span></button> })}</nav>
      <section className={`fs-drop ${dragging ? 'is-dragging' : ''}`} onDragOver={event => { event.preventDefault(); if (!uploading) setDragging(true) }} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false) }} onDrop={event => { event.preventDefault(); setDragging(false); void upload(event.dataTransfer.files) }} aria-label={`Przesyłanie do folderu ${activeFolder.label}`}><span className="fs-upload-icon"><Icon name="upload" /></span><div><h2>{uploading ? 'Twoje pliki są w drodze.' : 'Przeciągnij. Upuść. Gotowe.'}</h2><p>Dodajesz do: <strong>{activeFolder.label}</strong> · Oryginalny rozmiar i jakość · Do {bytes(maxBytes)} / plik</p></div><button className="fs-primary" disabled={uploading} onClick={() => input.current?.click()}>{uploading ? 'Przesyłanie…' : 'Wybierz pliki +'}</button><input ref={input} type="file" multiple accept={activeFolder.accept} onChange={event => { if (event.target.files) void upload(event.target.files) }} hidden aria-label="Wybierz pliki do przesłania" /></section>
      {queue.length > 0 && <section className="fs-queue" aria-label="Postęp przesyłania" aria-live="polite">{queue.map((item, index) => <div className="fs-queue-item" key={index}><span>{item.name}</span><small className={item.status === 'error' ? 'fs-error' : ''}>{item.status === 'done' ? 'Zapisano ✓' : item.status === 'error' ? item.error : item.status === 'waiting' ? 'W kolejce' : item.progress === 100 ? 'Zapisywanie…' : `${item.progress}%`}</small>{item.status === 'uploading' && <progress value={item.progress} max={100} aria-label={`Przesyłanie ${item.name}`} />}</div>)}{!uploading && <button className="fs-text-button" onClick={() => setQueue([])}>Ukryj postęp ×</button>}</section>}
      {error && <p className="fs-error" role="alert">{error} <button className="fs-text-button" onClick={() => refresh().then(() => setError('')).catch(err => setError(err.message))}>Spróbuj ponownie</button></p>}
      <section className="fs-library"><div className="fs-library-head"><div><span className="fs-kicker">BIBLIOTEKA / {String(folders.findIndex(item => item.id === folder) + 1).padStart(2, '0')}</span><h2>{activeFolder.label} <small>{visible.length}</small></h2></div><label className="fs-search"><span>Szukaj</span><input type="search" placeholder="Nazwa pliku…" value={query} onChange={event => setQuery(event.target.value)} /></label></div>
      {visible.length === 0 ? <div className="fs-empty"><Icon name="folder" /><h3>{query ? 'Nie znaleziono plików.' : 'Miejsce na coś Twojego.'}</h3><p>{query ? 'Spróbuj wpisać inną nazwę.' : `Dodaj pierwsze pliki do folderu ${activeFolder.label.toLocaleLowerCase('pl')}.`}</p></div> : <div className="fs-grid">{visible.map(file => <article className="fs-file" key={file.id}>{file.folder === 'pliki' ? isTextFile(file) ? <button className="fs-thumbnail" aria-label={`Podgląd: ${file.name}`} onClick={() => setPreview(file)}><Icon name="file" /><span>{file.name.split('.').pop()?.toUpperCase()} · Czytaj ↗</span></button> : <div className="fs-thumbnail"><Icon name="file" /><span>{file.name.split('.').pop()?.toUpperCase()}</span></div> : <button className="fs-thumbnail" aria-label={`Podgląd: ${file.name}`} onClick={() => setPreview(file)}>{file.folder === 'zdjecia' ? <ImageThumbnail file={file} /> : file.folder === 'filmy' ? <VideoThumbnail file={file} /> : <><Icon name="music" /><span>Posłuchaj ↗</span></>}</button>}<div className="fs-file-info"><h3 title={file.name}>{isTextFile(file) ? <button className="fs-filename" onClick={() => setPreview(file)}>{file.name}</button> : file.name}</h3><p>{bytes(file.size)} <span>·</span> {new Date(file.createdAt).toLocaleDateString('pl-PL')}</p><div>{(file.folder !== 'pliki' || isTextFile(file)) && <button className="fs-text-button" onClick={() => setPreview(file)}>Podgląd ↗</button>}<a href={`${fileUrl(file)}?download=1`}>Pobierz ↓</a></div><button className="fs-delete" disabled={deleting !== null} aria-label={`Usuń: ${file.name}`} onClick={() => { setDeleteError(''); setDeleteCandidate(file) }}><Icon name="trash" />{deleting === file.id ? 'Usuwanie…' : 'Usuń'}</button></div></article>)}</div>}
      <p className="fs-format-note">Podgląd zależy od formatów obsługiwanych przez Twoją przeglądarkę. Każdy plik możesz pobrać w oryginale.</p></section>
    </>}
    <footer className="fs-footer"><span>MIKAM / FILESHARE</span><span>Twoje pliki. Pełna jakość.</span></footer>
    <dialog className="fs-delete-dialog" ref={deleteDialog} aria-labelledby="fs-delete-title" aria-describedby="fs-delete-description" onCancel={event => { if (deleting) event.preventDefault(); else setDeleteCandidate(null) }} onClose={() => { if (!deleting) setDeleteCandidate(null) }} onClick={event => { if (event.target === event.currentTarget && !deleting) setDeleteCandidate(null) }}>{deleteCandidate && <>
      <span className="fs-delete-dialog-icon"><Icon name="trash" /></span><p className="fs-kicker">TWOJA BIBLIOTEKA / USUWANIE</p><h2 id="fs-delete-title">Usunąć ten plik?</h2><p className="fs-delete-name">{deleteCandidate.name}</p><p id="fs-delete-description">Plik zostanie trwale usunięty z Twojej biblioteki i serwera. Tej operacji nie można cofnąć.</p>{deleteError && <p className="fs-error" role="alert">{deleteError}</p>}<footer><button autoFocus className="fs-delete-cancel" disabled={deleting !== null} onClick={() => setDeleteCandidate(null)}>Zostaw plik</button><button className="fs-delete-confirm" disabled={deleting !== null} onClick={() => void deleteFile(deleteCandidate)}>{deleting ? 'Usuwanie…' : 'Usuń plik'}</button></footer>
    </>}</dialog>
    <dialog className="fs-preview" ref={dialog} aria-labelledby="fs-preview-title" onClose={() => setPreview(null)} onClick={event => { if (event.target === event.currentTarget) setPreview(null) }}>{preview && <><header><h2 id="fs-preview-title">{preview.name}</h2><button className="fs-text-button" onClick={() => setPreview(null)} aria-label="Zamknij podgląd">Zamknij ×</button></header><div className="fs-media" key={preview.id}>{isTextFile(preview) ? <TextPreview file={preview} /> : mediaError ? <p>Przeglądarka nie obsługuje tego formatu. Pobierz oryginał, aby go otworzyć.</p> : preview.folder === 'zdjecia' ? <img src={fileUrl(preview)} alt={preview.name} onError={() => setMediaError(true)} /> : preview.folder === 'filmy' ? <video controls autoPlay playsInline preload="metadata" src={fileUrl(preview)} onError={() => setMediaError(true)} /> : <div className="fs-audio"><Icon name="music" /><audio controls autoPlay preload="metadata" src={fileUrl(preview)} onError={() => setMediaError(true)} /></div>}</div><footer><span>{bytes(preview.size)} · Oryginalna jakość</span><a className="fs-primary" href={`${fileUrl(preview)}?download=1`}>Pobierz oryginał ↓</a></footer></>}</dialog>
  </main>
}
