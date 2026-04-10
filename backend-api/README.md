# Backend API - Capa de lógica de negocio

## 1. Propósito

Este componente representa la **capa de lógica de negocio** de la aplicación de 3 capas. Está desarrollado en Python y expone una API HTTP que actúa como intermediaria entre el frontend y la base de datos.

## 2. Responsabilidades de esta capa

- exponer endpoints HTTP,
- validar solicitudes básicas,
- consultar datos en MariaDB,
- devolver respuestas JSON al frontend,
- ejecutarse como servicio administrado por `systemd`.

## 3. Endpoints disponibles

- `GET /health`
- `GET /api/people`
- `GET /api/people/<id>`
- `GET /api/birthdays/today`
- `GET /api/birthdays/month/<mes>`

## 4. Estructura del componente

```text
backend-api/
├── README.md
├── app/
│   ├── app.py
│   ├── config.py
│   └── db.py
├── config/
│   └── birthday-api.conf.example
├── docs/
│   └── arquitectura.md
├── requirements.txt
├── scripts/
│   └── install_local.sh
├── sql/
│   └── init.sql
└── systemd/
    └── birthday-api.service
```

## 5. Requisitos previos

- Linux con `systemd`
- Python 3 y `pip`
- acceso de red a MariaDB

En RHEL / CentOS Stream:

```bash
sudo dnf install -y python3 python3-pip
```

## 6. Instalación resumida

### Crear usuario de servicio

```bash
sudo useradd --system --home /opt/birthday-api --shell /sbin/nologin birthdayapi
```

### Crear estructura de directorios

```bash
sudo mkdir -p /opt/birthday-api
sudo mkdir -p /etc/birthday-api
sudo mkdir -p /var/log/birthday-api
```

### Copiar archivos

```bash
sudo cp -r app /opt/birthday-api/
sudo cp requirements.txt /opt/birthday-api/
sudo cp config/birthday-api.conf.example /etc/birthday-api/birthday-api.conf
sudo cp systemd/birthday-api.service /etc/systemd/system/
```

### Permisos

```bash
sudo chown -R birthdayapi:birthdayapi /opt/birthday-api
sudo chown root:root /etc/birthday-api/birthday-api.conf
sudo chmod 600 /etc/birthday-api/birthday-api.conf
```

### Entorno virtual

```bash
sudo -u birthdayapi python3 -m venv /opt/birthday-api/venv
sudo -u birthdayapi /opt/birthday-api/venv/bin/pip install --upgrade pip
sudo -u birthdayapi /opt/birthday-api/venv/bin/pip install -r /opt/birthday-api/requirements.txt
```

### Configuración

Editar `/etc/birthday-api/birthday-api.conf`:

```bash
DB_HOST=192.168.56.20
DB_PORT=3306
DB_NAME=birthdays
DB_USER=birthdayapp
DB_PASSWORD=Cumples2026!
APP_HOST=0.0.0.0
APP_PORT=8000
```

### Activación del servicio

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now birthday-api.service
sudo systemctl status birthday-api.service
```

## 7. Validación

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/people
curl http://localhost:8000/api/people/1
curl http://localhost:8000/api/birthdays/today
curl http://localhost:8000/api/birthdays/month/4
```

## 8. Troubleshooting básico

### El servicio no arranca

- revisar `systemctl status birthday-api`
- revisar `journalctl -u birthday-api -xe`
- validar rutas de `ExecStart` y `WorkingDirectory`

### La API no accede a la base

- revisar credenciales
- revisar conectividad a MariaDB
- revisar permisos del usuario SQL

### El puerto no responde

- revisar `ss -lntp | grep 8000`
- revisar firewall

## 9. Ubicación sugerida en el filesystem

- código y venv: `/opt/birthday-api/`
- configuración: `/etc/birthday-api/`
- servicio: `/etc/systemd/system/birthday-api.service`
- logs propios, si se usan: `/var/log/birthday-api/`

## 10. Rol dentro de la arquitectura

Esta capa **no presenta interfaz gráfica al usuario** y **no debería contener persistencia embebida**. Su función es intermediar entre el frontend y la base de datos.
