# Arquitectura de 3 capas - Birthday App

## Componentes

### 1. Frontend
- servidor: Apache HTTP Server
- tipo: contenido estático
- tecnologías: HTML, CSS, JavaScript
- función: interfaz de usuario y consumo de API

### 2. Backend
- servidor: Linux con Python 3
- tipo: servicio de aplicación
- tecnologías: Flask, PyMySQL, systemd
- función: lógica de negocio y acceso a datos

### 3. Persistencia
- servidor: MariaDB
- tipo: base de datos relacional
- función: almacenamiento persistente

## Puertos típicos

- Apache: `80/tcp`
- API Python: `8000/tcp`
- MariaDB: `3306/tcp`

## Flujo

```text
Navegador -> Apache -> JavaScript (fetch) -> API Python -> MariaDB
```

## Mapeo recomendado en Linux

### Frontend
- `/var/www/birthday-web/`
- `/etc/httpd/conf.d/birthday-web.conf`

### Backend
- `/opt/birthday-api/`
- `/etc/birthday-api/birthday-api.conf`
- `/etc/systemd/system/birthday-api.service`
- `/var/log/birthday-api/`

### Base de datos
- directorios propios de MariaDB según distribución
- script inicial: `database-mariadb/sql/init.sql`
