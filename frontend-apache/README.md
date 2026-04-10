# Frontend Apache - Capa de presentación

## 1. Propósito

Este componente representa la **capa de presentación** de la aplicación de 3 capas. Se trata de un frontend estático desplegado en **Apache HTTP Server**, encargado de consumir la API del backend y mostrar la información al usuario.

## 2. Responsabilidades de esta capa

- ofrecer una interfaz web simple,
- permitir consultas a la API,
- mostrar respuestas obtenidas en formato JSON,
- separar la presentación de la lógica de negocio y de la base de datos.

## 3. Componentes incluidos

```text
frontend-apache/
├── README.md
├── index.html
├── styles.css
├── config.js
├── app.js
├── apache/
    └── birthday-web.conf
```

## 4. Requisitos previos

- Linux con Apache HTTP Server instalado
- backend API operativo y accesible por red
- navegador web moderno

En RHEL / CentOS Stream:

```bash
sudo dnf install -y httpd
sudo systemctl enable --now httpd
```

## 5. Configuración

Editar `config.js` y ajustar la URL del backend:

```javascript
window.APP_CONFIG = {
  API_BASE_URL: 'http://IP_O_HOST_DEL_BACKEND:8000'
};
```

## 6. Despliegue sugerido

```bash
sudo mkdir -p /var/www/birthday-web
sudo cp index.html styles.css config.js app.js /var/www/birthday-web/
sudo chown -R root:root /var/www/birthday-web
sudo chmod -R 755 /var/www/birthday-web
```

Si se desea usar el VirtualHost de ejemplo:

```bash
sudo cp apache/birthday-web.conf /etc/httpd/conf.d/
sudo apachectl configtest
sudo systemctl restart httpd
```

## 7. Validación

Abrir en navegador:

```text
http://IP_DEL_SERVIDOR/
```

Probar:

- estado `/health`,
- listado de personas,
- búsqueda por ID,
- cumpleaños de hoy,
- cumpleaños por mes.

## 8. Problemas frecuentes

### La página carga, pero no devuelve datos

- URL del backend incorrecta en `config.js`
- backend detenido
- firewall bloqueando el puerto 8000

### Apache no muestra la aplicación

- `DocumentRoot` incorrecto
- archivos copiados en otro directorio
- error en el VirtualHost

## 9. Ubicación sugerida en el filesystem

- contenido web: `/var/www/birthday-web/`
- configuración Apache: `/etc/httpd/conf.d/`
- logs Apache: `/var/log/httpd/`

## 10. Rol dentro de la arquitectura

Esta capa **no contiene lógica de negocio ni acceso directo a la base de datos**. Toda interacción con los datos se realiza a través de la API.
