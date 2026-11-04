# FileShare — /fileshare

Four fixed folders: `pliki`, `filmy`, `zdjecia`, `muzyka`. Uploads stream directly to disk. No image resizing, audio/video conversion, archive creation or content compression. A completed upload is published by atomically renaming its metadata. Incomplete transfers stay hidden and are cleaned up on restart.

The API requires a password (`FILESHARE_PASSWORD`) and uses an HttpOnly session cookie. Sessions expire after 24 hours and are invalidated by restart. Folder `pliki` always downloads as an attachment; other folders use native browser previews. Unhandled codecs (for example some HEIC/RAW/video formats) show a download fallback. SVG belongs in `pliki`.

## Local

Requires Node 22.16+ and npm. Set `FILESHARE_PASSWORD` in `.env`; use `FILESHARE_STORAGE=./fileshare-data` for local development.

```sh
npm ci
npm run server
# another terminal
npm run dev
```

Alternatively, build and run `npm start` to serve the complete site and API on port 3001. Run `npm run test:fileshare` for upload/download byte equality, byte ranges, authentication, folder restrictions, size limits, CSRF and restart persistence.

## VPS / current shared hosting

The main domain currently uses OVH shared hosting. Keep it there; create DNS `fileshare.mikam.cloud A 51.83.235.161` for the API and standalone library. Build the main site with `VITE_FILESHARE_ORIGIN=https://fileshare.mikam.cloud`; `/fileshare` then talks directly to the VPS using credentialed requests. The backend's `FILESHARE_ORIGIN=https://mikam.cloud` permits that exact frontend origin. Both endpoints must use HTTPS.

For a same-origin deployment, omit both origin variables and reverse proxy `/api/fileshare` to port 3001.

Copy `server/`, `dist/`, `package.json`, and `package-lock.json` to a new VPS release directory and run `sudo bash server/deploy-vps.sh` there. The script installs a separate systemd service, stores originals outside the app at `/var/lib/mikam-fileshare`, and adds a separate Nginx virtual host. Existing site configurations are preserved. Once DNS resolves, issue its TLS certificate with `sudo certbot --nginx -d fileshare.mikam.cloud --redirect`. The password is generated into `/etc/mikam-fileshare.env` with root-only access.

The default per-file limit is 20 GiB, configurable with `FILESHARE_MAX_BYTES` and matching Nginx `client_max_body_size`. Uploads reserve 1 GiB for the system when their declared size is known. Capacity is shared with other services on the VPS; it is not unlimited cloud storage. Back up `/var/lib/mikam-fileshare` separately. Never point FTP deployment cleanup at this storage directory.

Files with duplicate display names receive different UUIDs. No delete action is exposed. Restart with `sudo systemctl restart mikam-fileshare`. Logs: `sudo journalctl -u mikam-fileshare`. Roll back application code independently of the storage directory.
