# Birthday App - Arquitectura de 3 capas

## 1. Descripción general

`birthday-app` es una aplicación didáctica orientada a estudiantes de Administración de Sistemas. Se presenta como un sistema de **3 capas**, con componentes separados para interfaz web, lógica de negocio y persistencia de datos.

La solución permite trabajar conceptos de despliegue, organización de archivos en Linux, publicación de servicios, integración entre componentes y validación operativa.

## 2. Arquitectura de 3 capas

La aplicación se compone de las siguientes capas:

### 2.1. Capa de presentación

Frontend web estático desplegado en **Apache HTTP Server**.

Responsabilidades:

- presentar una interfaz web al usuario,
- consumir la API mediante solicitudes HTTP,
- mostrar resultados de consultas de personas y cumpleaños.

Ubicación en el repositorio:

- `frontend-apache/`

### 2.2. Capa de lógica de negocio

Backend desarrollado en **Python** con **Flask**.

Responsabilidades:

- exponer endpoints HTTP,
- procesar solicitudes del frontend,
- consultar la base de datos,
- devolver respuestas en formato JSON.

Ubicación en el repositorio:

- `backend-api/`

### 2.3. Capa de persistencia

Base de datos **MariaDB**.

Responsabilidades:

- almacenar los datos de personas y fechas de cumpleaños,
- permitir consultas desde la API,
- separar la persistencia del código de aplicación.

Ubicación en el repositorio:

- `database-mariadb/`

## 3. Topología sugerida

Se recomienda una topología con tres servidores o tres roles claramente diferenciados:

- **Servidor web**: Apache + frontend estático
- **Servidor de aplicación**: Python + API + systemd
- **Servidor de base de datos**: MariaDB

Para laboratorios pequeños, el backend y la base de datos pueden convivir en la misma VM. Sin embargo, desde el punto de vista conceptual, se mantiene la separación en tres capas.

## 4. Objetivos de aprendizaje

Este repositorio permite trabajar los siguientes temas:

- despliegue de una aplicación de 3 capas en Linux,
- uso correcto de directorios como `/opt`, `/etc` y `/var`,
- publicación de un servicio con `systemd`,
- despliegue de contenido estático en Apache,
- validación funcional con `curl` y navegador,
- troubleshooting básico de red, servicios y conectividad,
- comprensión del rol de cada capa dentro de una aplicación.

## 5. Estructura del repositorio

```text
birthday-3capas/
├── README.md
├── docs/
│   └── arquitectura-3capas.md
├── frontend-apache/
│   ├── README.md
│   ├── index.html
│   ├── styles.css
│   ├── config.js
│   ├── app.js
│   └─── apache/
├── backend-api/
│   ├── README.md
│   ├── app/
│   ├── config/
│   ├── requirements.txt
│   ├── scripts/
│   ├── sql/
│   └── systemd/
└── database-mariadb/
    ├── README.md
    └── sql/
```

## 6. Orden recomendado de despliegue

Se recomienda desplegar las capas en este orden:

1. **Base de datos**
   - instalar MariaDB,
   - crear base, usuario y tabla,
   - cargar datos iniciales.

2. **Backend API**
   - instalar Python,
   - desplegar código,
   - crear archivo de configuración,
   - crear unit file,
   - iniciar servicio con `systemd`.

3. **Frontend web**
   - instalar Apache,
   - copiar archivos estáticos,
   - configurar la URL de la API,
   - validar acceso desde navegador.

## 7. Relación entre componentes

Flujo básico de operación:

1. el usuario accede al frontend en Apache,
2. el frontend ejecuta solicitudes HTTP a la API,
3. la API consulta MariaDB,
4. MariaDB devuelve resultados,
5. la API responde en JSON,
6. el frontend presenta la información al usuario.

## 8. Consideraciones importantes

### 8.1. Organización del filesystem

En Linux, se recomienda separar:

- software en `/opt`,
- configuración en `/etc`,
- logs y datos variables en `/var`.

### 8.2. Seguridad básica

- no almacenar contraseñas en el código,
- restringir permisos sobre archivos de configuración,
- usar un usuario de servicio para ejecutar la API,
- limitar acceso de red a la base de datos.

## 9. Documentación por capa

Cada capa tiene su propio `README.md`:

- `frontend-apache/README.md`
- `backend-api/README.md`
- `database-mariadb/README.md`

El objetivo del `README.md` principal es presentar la arquitectura general y el encadenamiento de componentes.

## 10. Uso didáctico sugerido

Este repositorio puede usarse de dos maneras:

### Opción A: laboratorio de despliegue

Los estudiantes reciben el código y deben desplegar correctamente cada capa.

### Opción B: laboratorio con troubleshooting

El docente entrega una de las capas con errores deliberados, por ejemplo:

- URL de API incorrecta en el frontend,
- credenciales erróneas en el backend,
- servicio systemd mal definido,
- firewall bloqueando puertos,
- permisos incorrectos sobre configuración.

## 11. Referencias internas

- `docs/arquitectura-3capas.md`
- `frontend-apache/README.md`
- `backend-api/README.md`
- `database-mariadb/README.md`

## 12. Licencia

Creative Commons Zero v1.0 Universal
Uso educativo.
