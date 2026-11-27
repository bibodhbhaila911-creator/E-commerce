#!/usr/bin/env bash
# Runs ON the EC2 instance (as root, via sudo) during each deployment.
# Idempotent: first run installs everything, later runs only swap in the new release.
#
# Expects (uploaded by the GitHub Actions workflow):
#   /tmp/ecommerce-release.tar.gz  -> backend/ (source + package-lock), frontend/ (built dist)
#   /tmp/ecommerce.env             -> optional MONGO_URL=... line (empty file = use local MongoDB)
set -euo pipefail

RELEASE_TGZ=/tmp/ecommerce-release.tar.gz
ENV_SRC=/tmp/ecommerce.env
ENV_FILE=/etc/ecommerce.env
APP_DIR=/opt/ecommerce
NODE_DIR=/opt/node
NODE_MAJOR=22
APP_USER=ecommerce
BACKEND_PORT=8000

log() { echo "==> $*"; }

# Make sure first-boot setup is finished so dnf isn't locked
cloud-init status --wait >/dev/null 2>&1 || true

# ---------- 1. Swap (t2.micro has only 1 GB RAM; npm + MongoDB need headroom) ----------
if ! swapon --show | grep -q /swapfile; then
  log "Creating 1 GB swap file"
  if [ ! -f /swapfile ]; then
    dd if=/dev/zero of=/swapfile bs=1M count=1024 status=none
    chmod 600 /swapfile
    mkswap /swapfile >/dev/null
  fi
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile swap swap defaults 0 0' >> /etc/fstab
fi

# ---------- 2. Node.js (official binary, pinned to a major version) ----------
if ! "$NODE_DIR/bin/node" -v 2>/dev/null | grep -q "^v${NODE_MAJOR}\."; then
  log "Installing Node.js ${NODE_MAJOR}.x"
  base="https://nodejs.org/dist/latest-v${NODE_MAJOR}.x"
  curl -fsSL "$base/SHASUMS256.txt" -o /tmp/node-shasums.txt
  file=$(awk '/linux-x64\.tar\.gz$/ {print $2}' /tmp/node-shasums.txt)
  curl -fsSL "$base/$file" -o "/tmp/$file"
  (cd /tmp && grep " $file\$" node-shasums.txt | sha256sum -c -)
  rm -rf "$NODE_DIR" && mkdir -p "$NODE_DIR"
  tar -xzf "/tmp/$file" -C "$NODE_DIR" --strip-components=1
  rm -f "/tmp/$file" /tmp/node-shasums.txt
fi
export PATH="$NODE_DIR/bin:$PATH"
log "Node $(node -v), npm $(npm -v)"

# ---------- 3. nginx ----------
if ! rpm -q nginx >/dev/null 2>&1; then
  log "Installing nginx"
  dnf install -y -q nginx
fi

# ---------- 4. Environment file / MongoDB ----------
install -m 600 -o root -g root "$ENV_SRC" "$ENV_FILE"
rm -f "$ENV_SRC"
if grep -q '^MONGO_URL=.\+' "$ENV_FILE"; then
  log "Using external MongoDB from MONGO_URL secret"
else
  log "No MONGO_URL secret set -> using local MongoDB on this instance"
  if ! rpm -q mongodb-org-server >/dev/null 2>&1; then
    log "Installing MongoDB 8.0 server"
    cat > /etc/yum.repos.d/mongodb-org-8.0.repo <<'EOF'
[mongodb-org-8.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2023/mongodb-org/8.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-8.0.asc
EOF
    dnf install -y -q mongodb-org-server
  fi
  systemctl enable --now mongod
fi

# ---------- 5. App user ----------
id "$APP_USER" >/dev/null 2>&1 || useradd --system --no-create-home --shell /sbin/nologin "$APP_USER"

# ---------- 6. Unpack new release next to the current one, install deps ----------
log "Unpacking release"
rm -rf "$APP_DIR.new" && mkdir -p "$APP_DIR.new"
tar -xzf "$RELEASE_TGZ" -C "$APP_DIR.new"
(cd "$APP_DIR.new/backend" && npm ci --omit=dev --no-audit --no-fund --loglevel=error)
chmod -R a+rX "$APP_DIR.new"

# ---------- 7. Swap releases (keep previous one as .old for quick manual rollback) ----------
rm -rf "$APP_DIR.old"
[ -d "$APP_DIR" ] && mv "$APP_DIR" "$APP_DIR.old"
mv "$APP_DIR.new" "$APP_DIR"
rm -f "$RELEASE_TGZ"

# ---------- 8. systemd service for the Express backend ----------
cat > /etc/systemd/system/ecommerce-backend.service <<EOF
[Unit]
Description=Ecommerce backend (Express)
After=network-online.target mongod.service
Wants=network-online.target

[Service]
User=$APP_USER
WorkingDirectory=$APP_DIR/backend
Environment=NODE_ENV=production
Environment=PORT=$BACKEND_PORT
EnvironmentFile=$ENV_FILE
ExecStart=$NODE_DIR/bin/node index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable ecommerce-backend >/dev/null 2>&1
systemctl restart ecommerce-backend

# ---------- 9. nginx: serve frontend, proxy /api -> backend ----------
[ -f /etc/nginx/nginx.conf.orig ] || cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig
cat > /etc/nginx/nginx.conf <<'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /run/nginx.pid;
include /usr/share/nginx/modules/*.conf;

events { worker_connections 1024; }

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    sendfile      on;
    access_log    /var/log/nginx/access.log;
    client_max_body_size 10m;
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;

        root  /opt/ecommerce/frontend;
        index index.html;

        # Backend API: /api/product -> http://127.0.0.1:8000/product
        location /api/ {
            proxy_pass http://127.0.0.1:8000/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Hashed build assets can be cached for a long time
        location /assets/ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }

        # React Router (client-side routes) -> index.html
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
EOF
nginx -t
systemctl enable nginx >/dev/null 2>&1
systemctl reload-or-restart nginx

# ---------- 10. Local health check ----------
log "Waiting for backend on port $BACKEND_PORT"
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$BACKEND_PORT/product"; then
    log "Backend is up"
    exit 0
  fi
  sleep 2
done
echo "Backend did not become healthy. Recent logs:" >&2
journalctl -u ecommerce-backend -n 50 --no-pager >&2 || true
exit 1
