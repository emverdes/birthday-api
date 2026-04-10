# birthday-api

Aplicación de ejemplo para un laboratorio de **Administración de Sistemas Linux**.

## 1. Propósito del proyecto

`birthday-api` es una aplicación web sencilla desarrollada en Python, cuyo objetivo es servir como base para actividades prácticas de despliegue y operación de servicios en Linux. La aplicación publica una API HTTP, consulta información almacenada en una base de datos MariaDB y está pensada para ser ejecutada como servicio gestionado por `systemd`.

El proyecto fue diseñado con fines **didácticos**. Su valor principal no está en la complejidad del desarrollo de software, sino en el hecho de que permite trabajar sobre tareas propias de un administrador de sistemas, tales como:

- instalación y organización de archivos de una aplicación;
- separación entre código, configuración y datos variables;
- creación y administración de servicios con `systemd`;
- validación funcional mediante herramientas de línea de comandos;
- diagnóstico básico de errores de despliegue y conectividad.

## 2. Objetivos de aprendizaje

Al completar la instalación y validación de esta aplicación, se espera que el estudiante sea capaz de:

1. desplegar una aplicación Python en un servidor Linux;
2. instalar dependencias en un entorno controlado;
3. ubicar correctamente los componentes de una aplicación en el sistema de archivos;
4. crear y operar un servicio administrado por `systemd`;
5. validar el funcionamiento de una API con `curl`;
6. verificar la conectividad con una base de datos MariaDB;
7. identificar y resolver fallas básicas de configuración, permisos o red.

## 3. Descripción funcional

La aplicación expone una API REST simple para consultar datos de personas y sus fechas de nacimiento.

### Endpoints disponibles

- `GET /health`
- `GET /api/people`
- `GET /api/people/<id>`
- `GET /api/birthdays/today`
- `GET /api/birthdays/month/<mes>`

## 4. Arquitectura de referencia

El laboratorio puede desplegarse sobre dos máquinas virtuales.

### Servidor de base de datos

- ejecuta MariaDB;
- almacena la base `birthdays`;
- contiene la tabla `people` con datos de ejemplo.

### Servidor de aplicación

- ejecuta Linux con `systemd`;
- contiene el código de la aplicación Python;
- ejecuta la API como servicio del sistema;
- se conecta por red al servidor MariaDB.

## 5. Estructura del repositorio

```text
birthday-api/
├── app.py
├── config.py
├── db.py
├── requirements.txt
├── birthday-api.conf.example
├── .gitignore
├── systemd/
│   └── birthday-api.service
└── sql/
    └── init.sql
```

## 6. Organización recomendada en el sistema de archivos

Se recomienda desplegar la aplicación con una estructura coherente con prácticas habituales de administración Linux:

- `/opt/birthday-api/`  
  Contiene el código de la aplicación y el entorno virtual de Python.

- `/etc/birthday-api/`  
  Contiene el archivo de configuración editable por el administrador.

- `/var/log/birthday-api/`  
  Puede utilizarse para almacenar logs específicos de la aplicación, si se desea extender el ejercicio.

Esta separación favorece el orden operativo, la mantenibilidad y la claridad administrativa.

## 7. Requisitos previos

### En el servidor de aplicación

- sistema Linux con `systemd`;
- Python 3;
- acceso de red al servidor MariaDB.

### En el servidor de base de datos

- MariaDB Server operativo.

## 8. Preparación de la base de datos

En el servidor MariaDB, ejecutar el script incluido en el repositorio:

```bash
mysql -u root -p < sql/init.sql
```

El script realiza las siguientes tareas:

- crea la base de datos `birthdays`;
- crea el usuario `birthdayapp`;
- crea la tabla `people`;
- inserta datos de ejemplo.

> Nota: el host permitido para el usuario SQL está definido como `10.%`. Debe ajustarse según la red utilizada en el laboratorio.

## 9. Instalación en el servidor de aplicación

### 9.1. Instalar paquetes requeridos

En una distribución tipo RHEL o CentOS Stream:

```bash
sudo dnf install -y python3 python3-pip
```

Opcionalmente, para realizar pruebas manuales de conexión con MariaDB:

```bash
sudo dnf install -y mariadb
```

### 9.2. Crear usuario de servicio

```bash
sudo useradd --system --home /opt/birthday-api --shell /sbin/nologin birthdayapi
```

### 9.3. Crear directorios de despliegue

```bash
sudo mkdir -p /opt/birthday-api
sudo mkdir -p /etc/birthday-api
sudo chown birthdayapi:birthdayapi /opt/birthday-api
sudo chown root:root /etc/birthday-api
sudo chmod 755 /etc/birthday-api
```

### 9.4. Copiar archivos de la aplicación

Copiar `app.py`, `config.py`, `db.py` y `requirements.txt` a `/opt/birthday-api/`.

Ejemplo:

```bash
sudo cp app.py config.py db.py requirements.txt /opt/birthday-api/
sudo chown birthdayapi:birthdayapi /opt/birthday-api/*
```

### 9.5. Crear entorno virtual e instalar dependencias

```bash
sudo -u birthdayapi python3 -m venv /opt/birthday-api/venv
sudo -u birthdayapi /opt/birthday-api/venv/bin/pip install --upgrade pip
sudo -u birthdayapi /opt/birthday-api/venv/bin/pip install -r /opt/birthday-api/requirements.txt
```

## 10. Configuración de la aplicación

Copiar el archivo de ejemplo incluido en el repositorio:

```bash
sudo cp birthday-api.conf.example /etc/birthday-api/birthday-api.conf
sudo chmod 600 /etc/birthday-api/birthday-api.conf
```

Editar el archivo `/etc/birthday-api/birthday-api.conf` con los valores apropiados:

```bash
DB_HOST=192.168.56.20
DB_PORT=3306
DB_NAME=birthdays
DB_USER=birthdayapp
DB_PASSWORD=ChangeThisPassword
APP_HOST=0.0.0.0
APP_PORT=8000
```

Se debe verificar especialmente:

- dirección IP o nombre del servidor MariaDB;
- usuario y contraseña correctos;
- puerto en el que quedará publicada la API.

## 11. Instalación del servicio `systemd`

Copiar el unit file provisto:

```bash
sudo cp systemd/birthday-api.service /etc/systemd/system/birthday-api.service
```

Recargar la configuración de `systemd`, habilitar el servicio e iniciarlo:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now birthday-api.service
```

Verificar el estado:

```bash
sudo systemctl status birthday-api.service
```

Consultar logs del servicio:

```bash
sudo journalctl -u birthday-api.service -f
```

## 12. Validación funcional

### 12.1. Verificación de salud

```bash
curl http://localhost:8000/health
```

Respuesta esperada:

```json
{"status":"ok"}
```

### 12.2. Consulta de todas las personas

```bash
curl http://localhost:8000/api/people
```

### 12.3. Consulta de una persona por identificador

```bash
curl http://localhost:8000/api/people/1
```

### 12.4. Consulta de cumpleaños del día

```bash
curl http://localhost:8000/api/birthdays/today
```

### 12.5. Consulta de cumpleaños por mes

```bash
curl http://localhost:8000/api/birthdays/month/4
```

## 13. Consideraciones de red y firewall

Si se requiere acceso remoto al servicio y el sistema utiliza `firewalld`, abrir el puerto correspondiente:

```bash
sudo firewall-cmd --add-port=8000/tcp --permanent
sudo firewall-cmd --reload
```

## 14. Verificación operativa complementaria

Además de las pruebas con `curl`, conviene validar:

- que el servicio esté activo;
- que el puerto se encuentre en escucha;
- que exista conectividad hacia MariaDB.

Ejemplos:

```bash
sudo systemctl status birthday-api.service
ss -lntp | grep 8000
mysql -h <db_host> -u birthdayapp -p birthdays
```

## 15. Troubleshooting básico

### 15.1. El servicio no inicia

Revisar:

```bash
sudo systemctl status birthday-api.service
sudo journalctl -xeu birthday-api.service
```

Verificar especialmente:

- ruta de `ExecStart`;
- existencia del entorno virtual;
- permisos sobre archivos y directorios;
- sintaxis del archivo de configuración.

### 15.2. La aplicación no conecta a MariaDB

Verificar:

- valor de `DB_HOST`;
- credenciales configuradas;
- permisos del usuario SQL;
- accesibilidad del puerto 3306 por red.

### 15.3. La API responde localmente pero no remotamente

Verificar:

- que `APP_HOST` esté definido como `0.0.0.0`;
- reglas de firewall;
- dirección IP utilizada en la prueba remota;
- estado de escucha del puerto.

## 16. Posibles extensiones académicas

Una vez completado el despliegue básico, el proyecto puede ampliarse con actividades adicionales, por ejemplo:

- agregar nuevos endpoints;
- incorporar logs propios de aplicación;
- ejecutar la API detrás de `nginx`;
- reemplazar el servidor embebido de Flask por `gunicorn`;
- endurecer más el servicio en `systemd`;
- documentar el despliegue como procedimiento operativo.

## 17. Inicialización del repositorio Git

Si se desea publicar este proyecto en un repositorio Git:

```bash
git init
git add .
git commit -m "Initial commit: birthday-api sample app"
```

Para asociarlo a un repositorio remoto:

```bash
git branch -M main
git remote add origin <URL_DEL_REPOSITORIO>
git push -u origin main
```

## 18. Uso previsto

Este proyecto fue concebido para:

- prácticas de laboratorio;
- trabajos prácticos de despliegue;
- actividades de validación de servicios;
- ejercicios de troubleshooting inicial.

No está orientado a ambientes de producción reales sin modificaciones adicionales.

## 19. Licencia

Uso educativo.
Creative Commons Zero v1.0 Universal

