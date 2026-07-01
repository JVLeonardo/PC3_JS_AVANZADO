# Entorno Local Del Backend

El archivo `local.env` contiene las variables locales para conectar la API a
PostgreSQL. Se ignora en Git porque incluye credenciales.

Con `local.env` presente, puedes ejecutar `BackendApplication` con el boton
Run de IntelliJ aunque el directorio de trabajo sea la raiz del repositorio.
Spring Boot importa automaticamente este archivo solo cuando existe.

Para compilar y comprobar la conexion local desde la carpeta `backend`:

```powershell
.\scripts\mvn-local.cmd test -q
```

Para iniciar la API:

```powershell
.\scripts\mvn-local.cmd spring-boot:run
```

Si necesitas reconstruir tu archivo local, copia los nombres definidos en
`local.env.example` y proporciona tus propios valores.

En Render no se crea este archivo: define `DB_URL`, `DB_USERNAME`,
`DB_PASSWORD`, `DDL_AUTO=validate` y `CORS_ALLOWED_ORIGINS` como variables
del servicio. Ejecuta previamente `database/001_schema_inicial.sql` en la
base de produccion para que la validacion de Hibernate sea exitosa.
