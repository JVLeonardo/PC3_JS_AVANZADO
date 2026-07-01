# PC3 JavaScript Avanzado - Cafeteria

Proyecto monorepo para una prueba de React + Spring Boot. El `frontend/` se
despliega en Vercel, el `backend/` en Render y la base de datos usa PostgreSQL
nativo de Render. Las imagenes de productos se suben a Cloudinary.

## Requisitos Locales

- Java 21
- Node.js y npm
- PostgreSQL local opcional
- pgAdmin opcional para administrar la base de Render
- Cuenta en GitHub, Render, Vercel y Cloudinary

## Ejecutar Localmente

Backend:

```powershell
cd backend
copy env\local.env.example env\local.env
.\mvnw.cmd spring-boot:run
```

Edita `backend/env/local.env` con tus credenciales locales de PostgreSQL si
quieres probar contra una base local.

Frontend:

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

Variables del frontend:

```env
VITE_API_URL=http://localhost:8080
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_unsigned_preset
```

## Script de Base de Datos

El script esta en:

```text
backend/database/001_schema_inicial.sql
```

Crea las tablas `productos` y `pedidos`, e inserta 3 productos iniciales. En
Render ejecútalo desde pgAdmin antes de configurar `DDL_AUTO=validate`.

## Cloudinary

1. Crea una cuenta en Cloudinary.
2. Entra al Dashboard y copia tu `cloud_name`.
3. Ve a `Settings > Upload`.
4. En `Upload presets`, crea un preset unsigned.
5. Limita el preset a imagenes si la pantalla te muestra esa opcion.
6. Copia el nombre del preset.
7. En Vercel configura:
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`

Referencia: [Cloudinary Upload Widget](https://cloudinary.com/documentation/upload_widget).

## Render: PostgreSQL y Backend

1. Sube el repositorio a GitHub.
2. En Render, crea la base desde `New > Postgres`.
3. Guarda estos datos de la base:
   - Internal Database URL
   - External Database URL
   - Database
   - User
   - Password
4. Crea un Web Service desde GitHub.
5. Configura:
   - Root Directory: `backend`
   - Runtime: Docker
   - Dockerfile Path: `Dockerfile`
6. Variables del servicio backend:

```env
DB_URL=jdbc:postgresql://<internal-host>:5432/<database>
DB_USERNAME=<render-user>
DB_PASSWORD=<render-password>
DDL_AUTO=validate
CORS_ALLOWED_ORIGINS=https://<frontend>.vercel.app
```

Usa el host interno para el backend de Render. El formato de `DB_URL` debe ser
JDBC, no pegues la URL `postgres://` directamente.

Cuando el backend este desplegado, prueba:

```text
https://<backend>.onrender.com/api/productos
```

Referencias:

- [Render Web Services](https://render.com/docs/web-services)
- [Render Postgres](https://render.com/docs/postgresql-creating-connecting)

## Conectar PostgreSQL de Render desde pgAdmin Local

Usa los datos externos de Render, no los internos.

1. En Render, abre tu PostgreSQL.
2. Ve a la seccion `Info` o `Connect`.
3. Copia los datos del `External Database URL`.
4. En pgAdmin, click derecho en `Servers`.
5. Selecciona `Register > Server`.
6. Tab `General`:
   - Name: `PC3 Render DB`
7. Tab `Connection`:
   - Host name/address: host externo de Render
   - Port: `5432`
   - Maintenance database: nombre de la base
   - Username: usuario de Render
   - Password: password de Render
8. Tab `SSL`:
   - SSL mode: `Require`
9. Guarda la conexion.
10. Abre `Query Tool`.
11. Copia y ejecuta `backend/database/001_schema_inicial.sql`.

Nota: pgAdmin corre fuera de Render, por eso usa la URL externa. El backend
desplegado en Render debe usar la URL interna.

## Vercel: Frontend

1. En Vercel, importa el repositorio desde GitHub.
2. Configura:
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Variables:

```env
VITE_API_URL=https://<backend>.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=<cloud-name>
VITE_CLOUDINARY_UPLOAD_PRESET=<unsigned-preset>
```

4. Despliega.
5. Copia la URL final de Vercel.
6. En Render, actualiza `CORS_ALLOWED_ORIGINS` con esa URL.
7. Redeploy del backend si Render no lo reinicia automaticamente.

Referencias:

- [Vercel Vite](https://vercel.com/docs/frameworks/frontend/vite)
- [Vercel Monorepos](https://vercel.com/docs/monorepos)

## Flujo de Prueba

1. Abrir la URL de Vercel.
2. Ver los 3 productos iniciales.
3. Pedir un producto y comprobar que baja el stock.
4. Verificar que un producto con stock `0` queda bloqueado.
5. Crear un producto nuevo.
6. Subir su imagen a Cloudinary.
7. Confirmar que aparece en el catalogo y se guarda en PostgreSQL.
