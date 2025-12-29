# Docker Deployment Guide for Plesk

## Prerequisites
- Docker installed on CentOS 7
- Docker Compose installed
- Git repository set up

## Deployment Steps

### 1. Clone your repository on the Plesk server
```bash
cd /home/yourusername
git clone <your-repo-url> nightinplaermo
cd nightinplaermo
```

### 2. Build the Docker image
```bash
docker-compose build
```

### 3. Run the container
```bash
docker-compose up -d
```

The app will be available on `http://localhost:3000`

### 4. Set up a reverse proxy in Plesk (for domain access)

In Plesk, configure an Apache/Nginx reverse proxy:

**For Nginx:**
Create a custom config in Plesk pointing to your domain:
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

**For Apache:**
Enable mod_proxy and add to .htaccess or vhost:
```apache
ProxyPreserveHost On
ProxyPass / http://127.0.0.1:3000/
ProxyPassReverse / http://127.0.0.1:3000/
```

### 5. Useful Docker commands

View logs:
```bash
docker-compose logs -f
```

Stop the container:
```bash
docker-compose down
```

Restart:
```bash
docker-compose restart
```

### 6. Auto-restart on server reboot

Add to crontab:
```bash
@reboot cd /home/yourusername/nightinplaermo && docker-compose up -d
```

Or use systemd service (recommended for CentOS 7):

Create `/etc/systemd/system/nightinplaermo.service`:
```ini
[Unit]
Description=Night in Palermo Web App
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
WorkingDirectory=/home/yourusername/nightinplaermo
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

Then run:
```bash
sudo systemctl daemon-reload
sudo systemctl enable nightinplaermo.service
sudo systemctl start nightinplaermo.service
```

## Troubleshooting

**Port already in use:**
Change port mapping in docker-compose.yml:
```yaml
ports:
  - "3001:3000"  # Change first number to available port
```

**Container won't start:**
Check logs: `docker-compose logs`

**Out of memory:**
Adjust memory limit in docker-compose.yml

## Notes
- The app runs on Node.js 18 Alpine (lightweight image)
- Port 3000 is used internally; map to any port you need via Plesk
- Static files are served via `serve` package for optimal performance
