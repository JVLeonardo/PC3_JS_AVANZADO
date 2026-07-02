# TalentMatch AI - FastAPI

Servicio Python para el caso TalentMatch AI de la PC3. Este servicio entrena en memoria un modelo `RandomForestClassifier` con datos sinteticos y expone un endpoint de prediccion para que Spring Boot lo consuma.

## Endpoints

- `GET /`: informacion basica del servicio.
- `GET /health`: confirma que el servicio esta activo y que el modelo fue cargado.
- `GET /metadata`: muestra las variables usadas por el modelo y sus clases.
- `POST /predict/talent-match`: predice el perfil tecnologico.

## Ejecutar Localmente

```powershell
cd python-ai
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```

Swagger:

```text
http://localhost:8001/docs
```

Health check:

```text
http://localhost:8001/health
```

## Request de Prueba

```json
{
  "javascript": 85,
  "react": 80,
  "spring_boot": 60,
  "python_datos": 40,
  "sql": 70,
  "experiencia_proyectos": 3,
  "preferencia": 0
}
```

## Response Esperado

```json
{
  "caso": "TalentMatchAI",
  "prediccion": "FRONTEND_REACT",
  "confianza": 0.91,
  "ranking": [
    {
      "clase": "FRONTEND_REACT",
      "probabilidad": 0.91
    }
  ],
  "recomendaciones": [
    "Construir un dashboard React con rutas, hooks y consumo REST."
  ],
  "entrada": {
    "javascript": 85,
    "react": 80,
    "spring_boot": 60,
    "python_datos": 40,
    "sql": 70,
    "experiencia_proyectos": 3,
    "preferencia": 0
  }
}
```

## Integracion con Spring Boot

Spring Boot debe llamar a:

```text
POST ${PYTHON_AI_URL}/predict/talent-match
```

Local:

```env
PYTHON_AI_URL=http://localhost:8001
```

Render:

```env
PYTHON_AI_URL=https://tu-python-ai.onrender.com
```

## Deploy en Render

Crear un nuevo Web Service para Python:

- Root Directory: `python-ai`
- Runtime: `Python`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`

Luego copiar la URL publica del servicio Python y configurarla en el backend Spring Boot como `PYTHON_AI_URL`.

## Deploy Alternativo con Docker

Tambien puedes crear el Web Service con runtime `Docker`:

- Root Directory: `python-ai`
- Dockerfile Path: `Dockerfile`

El `Dockerfile` ya usa el puerto dinamico de Render mediante `$PORT`.
