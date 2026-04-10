#!/bin/bash
set -euo pipefail

APP_USER="birthdayapi"
APP_DIR="/opt/birthday-api"
CONF_DIR="/etc/birthday-api"
SERVICE_FILE="/etc/systemd/system/birthday-api.service"

sudo useradd --system --home "$APP_DIR" --shell /sbin/nologin "$APP_USER" 2>/dev/null || true
sudo mkdir -p "$APP_DIR" "$CONF_DIR"
sudo cp -r app requirements.txt "$APP_DIR"/
sudo cp config/birthday-api.conf.example "$CONF_DIR/birthday-api.conf"
sudo cp systemd/birthday-api.service "$SERVICE_FILE"
sudo chown -R "$APP_USER":"$APP_USER" "$APP_DIR"
sudo chmod 600 "$CONF_DIR/birthday-api.conf"
sudo -u "$APP_USER" python3 -m venv "$APP_DIR/venv"
sudo -u "$APP_USER" "$APP_DIR/venv/bin/pip" install --upgrade pip
sudo -u "$APP_USER" "$APP_DIR/venv/bin/pip" install -r "$APP_DIR/requirements.txt"
sudo systemctl daemon-reload

echo "Instalación base completada. Revise $CONF_DIR/birthday-api.conf antes de iniciar el servicio."
