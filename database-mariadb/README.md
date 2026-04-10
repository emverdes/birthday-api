# MariaDB - Capa de persistencia

## 1. Propósito

Este componente representa la **capa de persistencia** de la aplicación de 3 capas. Utiliza MariaDB para almacenar los datos consultados por la API.

## 2. Responsabilidades de esta capa

- almacenar información persistente,
- responder consultas SQL realizadas por el backend,
- mantener los datos separados del código de aplicación y de la interfaz web.

## 3. Contenido del directorio

```text
database-mariadb/
├── README.md
└── sql/
    └── init.sql
```

## 4. Requisitos previos

- Linux con MariaDB instalado
- servicio MariaDB operativo
- conectividad desde el backend hacia el puerto `3306/tcp`

En RHEL / CentOS Stream:

```bash
sudo dnf install -y mariadb-server
sudo systemctl enable --now mariadb
```

## 5. Inicialización

El archivo `sql/init.sql` crea:

- base de datos `birthdays`,
- usuario `birthdayapp`,
- tabla `people`,
- registros de ejemplo.

Ejecutar:

```bash
mysql -u root -p < sql/init.sql
```

## 6. Validación

Ingresar a MariaDB:

```bash
mysql -u root -p
```

Luego verificar:

```sql
SHOW DATABASES;
USE birthdays;
SHOW TABLES;
SELECT * FROM people;
```

## 7. Consideraciones de seguridad

- restringir el host permitido del usuario de aplicación,
- usar contraseña adecuada,
- no exponer MariaDB innecesariamente,
- limitar acceso por firewall.

## 8. Rol dentro de la arquitectura

Esta capa **no debería ser accedida directamente por el frontend**. El acceso a los datos debe realizarse a través del backend API.
