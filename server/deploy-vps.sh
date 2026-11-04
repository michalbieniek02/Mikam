#!/usr/bin/env bash
# Run from the extracted release directory with sudo bash server/deploy-vps.sh.
set -euo pipefail
release="$(pwd)"
app=/opt/mikam-fileshare
domain=fileshare.mikam.cloud
command -v node >/dev/null
command -v nginx >/dev/null
command -v certbot >/dev/null
if [ ! -f "$release/server/index.mjs" ] || [ ! -f "$release/dist/index.html" ]; then
  echo 'Run this script from the extracted release directory.' >&2; exit 1
fi
id mikam-fileshare >/dev/null 2>&1 || useradd --system --home-dir /var/lib/mikam-fileshare --shell /usr/sbin/nologin mikam-fileshare
install -d -m 750 -o mikam-fileshare -g mikam-fileshare /var/lib/mikam-fileshare
install -d -m 755 "$app"
cp -a "$release/server" "$release/dist" "$release/package.json" "$release/package-lock.json" "$app/"
cd "$app"
npm ci --omit=dev --ignore-scripts
if [ ! -f /etc/mikam-fileshare.env ]; then
  umask 077
  printf 'NODE_ENV=production\nHOST=127.0.0.1\nPORT=3001\nFILESHARE_STORAGE=/var/lib/mikam-fileshare\nFILESHARE_MAX_BYTES=21474836480\nFILESHARE_ORIGIN=https://mikam.cloud\nFILESHARE_PASSWORD=%s\n' "$(openssl rand -hex 20)" > /etc/mikam-fileshare.env
fi
cat > /etc/systemd/system/mikam-fileshare.service <<'SERVICE'
[Unit]
Description=MIKAM FileShare
After=network.target
[Service]
Type=simple
User=mikam-fileshare
Group=mikam-fileshare
WorkingDirectory=/opt/mikam-fileshare
EnvironmentFile=/etc/mikam-fileshare.env
ExecStart=/usr/bin/node /opt/mikam-fileshare/server/index.mjs
Restart=on-failure
RestartSec=3
UMask=0077
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/lib/mikam-fileshare
[Install]
WantedBy=multi-user.target
SERVICE
# This vhost is separate from existing websites on this VPS.
cat > /etc/nginx/sites-available/mikam-fileshare <<'NGINX'
server {
    listen 80;
    server_name fileshare.mikam.cloud;
    client_max_body_size 20g;
    client_body_timeout 3600s;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_request_buffering off;
        proxy_buffering off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        gzip off;
    }
}
NGINX
ln -sfn /etc/nginx/sites-available/mikam-fileshare /etc/nginx/sites-enabled/mikam-fileshare
nginx -t
systemctl daemon-reload
systemctl enable --now mikam-fileshare
systemctl restart mikam-fileshare
systemctl reload nginx
echo 'Backend installed. After the DNS A record points to this VPS, run:'
echo "sudo certbot --nginx -d $domain --redirect"
echo 'Password: sudo sed -n s/^FILESHARE_PASSWORD=//p /etc/mikam-fileshare.env'
