# TalentMatch AI - PC3 JavaScript Avanzado

TalentMatch AI es una aplicacion web desarrollada para la PC3 del curso JavaScript Avanzado. El sistema evalua postulantes junior a partir de sus habilidades tecnicas, preferencias y experiencia en proyectos, luego usa un servicio de IA en FastAPI para recomendar el perfil tecnologico mas adecuado.

## Integrantes

- Julio Rodrigo Minaya Urdanivia
- Leonardo Jesus Gonzales Delgado
- Andy Fabrizio Calagua Medina
- Kevin Briceno Zegarra

## Caso Resuelto

El caso consiste en construir una aplicacion full stack que permita registrar postulantes, cargar su avatar en la nube, evaluar sus habilidades y obtener una prediccion de perfil tecnologico mediante un modelo IA.

La app permite:

- Registrar nombre, email y avatar del postulante.
- Subir imagenes a Cloudinary.
- Evaluar habilidades en JavaScript, React, Spring Boot, Python Datos y SQL.
- Indicar experiencia en proyectos y preferencia laboral.
- Obtener un perfil recomendado por IA.
- Ver confianza, ranking de perfiles y ruta de mejora.
- Consultar el historial de evaluaciones guardadas.
- Ver detalle o eliminar evaluaciones registradas.

## Enlaces Publicos

- Frontend Vercel: https://pc-3-js-avanzado.vercel.app
- Backend Spring Boot Render: https://pc3-backend.onrender.com
- FastAPI Render: https://fastapi-talentmatch.onrender.com
- FastAPI Swagger Docs: https://fastapi-talentmatch.onrender.com/docs

> Nota: Render puede suspender servicios inactivos. Si la app no responde al primer intento, ingresar primero a los enlaces del backend y FastAPI para despertar los servicios y luego volver a probar desde Vercel.

## Arquitectura

```text
Usuario
  |
  v
Frontend React/Vite (Vercel)
  |
  v
Backend Spring Boot (Render)
  |            |
  |            v
  |       PostgreSQL Render
  |
  v
FastAPI IA (Render)

Cloudinary Upload Widget
  ^
  |
Avatar del postulante
```

### Componentes

- `frontend/`: interfaz React con Vite desplegada en Vercel.
- `backend/`: API principal en Spring Boot desplegada en Render.
- `python-ai/`: servicio FastAPI con modelo IA para prediccion de perfiles.
- PostgreSQL Render: base de datos para candidatos, evaluaciones y predicciones.
- Cloudinary: almacenamiento de avatars de postulantes.

## Tecnologias Usadas

- React
- Vite
- CSS
- Java 21
- Spring Boot
- Spring Data JPA
- PostgreSQL
- FastAPI
- Python
- scikit-learn
- Cloudinary Upload Widget
- Vercel
- Render

## Flujo de Uso

1. Ingresar a los servicios de Render si estan dormidos:
   - https://pc3-backend.onrender.com
   - https://fastapi-talentmatch.onrender.com
2. Abrir el frontend:
   - https://pc-3-js-avanzado.vercel.app
3. Registrar los datos del postulante.
4. Subir avatar con Cloudinary si se desea.
5. Arrastrar los sliders para indicar habilidades tecnicas.
6. Elegir preferencia laboral.
7. Presionar `Analizar mi perfil`.
8. Revisar el perfil recomendado, confianza, ranking y ruta de mejora.
9. Consultar el historial de evaluaciones.
10. Ver detalle o eliminar evaluaciones guardadas.

## Endpoints Principales

### Spring Boot

```text
POST /api/talent-match/predict
GET /api/talent-match/history
GET /api/talent-match/history/{id}
DELETE /api/talent-match/history/{id}
POST /api/talent-match/candidates
POST /api/talent-match/evaluations
```

### FastAPI

```text
GET /health
GET /metadata
POST /predict/talent-match
```

## Variables de Entorno

### Frontend

```env
VITE_API_URL=https://pc3-backend.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset
```

### Backend

```env
DB_URL=jdbc:postgresql://<host>:5432/<database>
DB_USERNAME=<usuario>
DB_PASSWORD=<password>
DDL_AUTO=validate
CORS_ALLOWED_ORIGINS=https://pc-3-js-avanzado.vercel.app
PYTHON_AI_URL=https://fastapi-talentmatch.onrender.com
```

### FastAPI

Render asigna automaticamente la variable `PORT`. El comando de inicio debe usar:

```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

## Ejecucion Local

### Backend Spring Boot

```powershell
cd backend
copy env\local.env.example env\local.env
.\mvnw.cmd spring-boot:run
```

### FastAPI

```powershell
cd python-ai
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```

Swagger local:

```text
http://localhost:8001/docs
```

### Frontend React

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend local:

```text
http://localhost:5173
```

## Base de Datos

La base de datos usa PostgreSQL nativo de Render. Las tablas principales son:

- `talent_candidates`
- `talent_evaluations`
- `talent_predictions`

Relaciones:

- Una evaluacion pertenece a un candidato.
- Una prediccion pertenece a una evaluacion.
- Al eliminar una evaluacion, se elimina su prediccion asociada por cascade.

## Pruebas

Backend:

```powershell
cd backend
.\mvnw.cmd test
```

Frontend:

```powershell
cd frontend
npm run build
```

## Notas de Produccion

- React no llama directamente a FastAPI.
- React consume Spring Boot.
- Spring Boot llama a FastAPI mediante `PYTHON_AI_URL`.
- Spring Boot guarda candidatos, evaluaciones y predicciones en PostgreSQL.
- Cloudinary guarda las imagenes y la base de datos solo conserva la URL segura.
- Si Render esta dormido, el primer request puede tardar o fallar; abrir los enlaces publicos de Render ayuda a despertar los servicios.
