# Arquitectura de referencia

- **Servidor de base de datos**: MariaDB
- **Servidor de aplicación**: Python + Flask ejecutado como servicio systemd
- **Validación funcional**: curl contra endpoints HTTP

## Distribución recomendada en el filesystem

- `/opt/birthday-api/`: código de la aplicación y entorno virtual
- `/etc/birthday-api/`: configuración editable
- `/var/log/birthday-api/`: logs de aplicación si se implementan a archivo
- `MariaDB`: persistencia de datos
