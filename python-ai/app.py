from contextlib import asynccontextmanager
from typing import Dict, List

import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder


RANDOM_STATE = 42
MODEL_KEY = "talent-match"
MODELS: Dict[str, "ModelPack"] = {}


class ModelPack:
    def __init__(
        self,
        features: List[str],
        labels: List[str],
        model: RandomForestClassifier,
        encoder: LabelEncoder,
    ):
        self.features = features
        self.labels = labels
        self.model = model
        self.encoder = encoder

    def predict(self, values: Dict[str, float]) -> Dict:
        x = np.array([[float(values[feature]) for feature in self.features]])
        prediction = self.model.predict(x)[0]
        probabilities = self.model.predict_proba(x)[0]

        label = str(self.encoder.inverse_transform([prediction])[0])
        confidence = round(float(np.max(probabilities)), 4)
        ranking = sorted(
            [
                {
                    "clase": str(self.encoder.inverse_transform([index])[0]),
                    "probabilidad": round(float(probability), 4),
                }
                for index, probability in enumerate(probabilities)
            ],
            key=lambda item: item["probabilidad"],
            reverse=True,
        )

        return {
            "label": label,
            "confidence": confidence,
            "ranking": ranking,
        }


class TalentRequest(BaseModel):
    javascript: int = Field(..., ge=0, le=100)
    react: int = Field(..., ge=0, le=100)
    spring_boot: int = Field(..., ge=0, le=100)
    python_datos: int = Field(..., ge=0, le=100)
    sql: int = Field(..., ge=0, le=100)
    experiencia_proyectos: int = Field(..., ge=0, le=10)
    preferencia: int = Field(
        ...,
        ge=0,
        le=3,
        description="0=frontend, 1=backend, 2=datos, 3=fullstack",
    )


def label_talent(row: List[float]) -> str:
    javascript, react, spring_boot, python_datos, sql, experiencia, preferencia = row

    frontend_score = (
        javascript * 0.35
        + react * 0.45
        + experiencia * 3
        + (12 if preferencia == 0 else 0)
    )
    backend_score = (
        spring_boot * 0.50
        + sql * 0.25
        + javascript * 0.10
        + experiencia * 3
        + (12 if preferencia == 1 else 0)
    )
    data_score = (
        python_datos * 0.55
        + sql * 0.25
        + experiencia * 2
        + (12 if preferencia == 2 else 0)
    )
    fullstack_score = (
        (javascript + react + spring_boot + sql) * 0.20
        + experiencia * 4
        + (12 if preferencia == 3 else 0)
    )

    scores = {
        "FRONTEND_REACT": frontend_score,
        "BACKEND_SPRING": backend_score,
        "DATA_ANALYST_JUNIOR": data_score,
        "FULLSTACK_JUNIOR": fullstack_score,
    }

    return max(scores, key=scores.get)


def generate_talent_data():
    rng = np.random.default_rng(RANDOM_STATE + 4)
    x = []
    y = []

    for _ in range(320):
        row = [
            rng.integers(10, 101),
            rng.integers(10, 101),
            rng.integers(0, 101),
            rng.integers(0, 101),
            rng.integers(10, 101),
            rng.integers(0, 11),
            rng.integers(0, 4),
        ]

        x.append(row)
        y.append(label_talent(row))

    return np.array(x), np.array(y)


def recommendation_talent(payload: TalentRequest, label: str) -> List[str]:
    tips = {
        "FRONTEND_REACT": [
            "Construir un dashboard React con rutas, hooks y consumo REST.",
            "Reforzar diseno de componentes, manejo de estado y formularios.",
            "Practicar integracion con APIs usando fetch o axios.",
        ],
        "BACKEND_SPRING": [
            "Crear endpoints REST solidos con Spring Boot.",
            "Reforzar validaciones, DTOs, servicios y repositorios.",
            "Practicar integracion con PostgreSQL y servicios externos.",
        ],
        "DATA_ANALYST_JUNIOR": [
            "Reforzar Python aplicado a datos y modelos predictivos.",
            "Practicar limpieza de datos, metricas y visualizacion.",
            "Explicar variables, modelo y resultado de prediccion.",
        ],
        "FULLSTACK_JUNIOR": [
            "Integrar React, Spring Boot, PostgreSQL y Python de extremo a extremo.",
            "Reforzar despliegue, manejo de errores y comunicacion entre capas.",
            "Practicar documentacion tecnica del flujo completo.",
        ],
    }

    extra_tips = []

    if payload.javascript < 60:
        extra_tips.append("Subir base de JavaScript moderno antes de avanzar a proyectos grandes.")
    if payload.react < 60:
        extra_tips.append("Practicar componentes, props, estado, eventos y consumo de APIs en React.")
    if payload.spring_boot < 60:
        extra_tips.append("Reforzar controladores, servicios y DTOs en Spring Boot.")
    if payload.python_datos < 60:
        extra_tips.append("Practicar fundamentos de Python para analisis y prediccion.")
    if payload.sql < 60:
        extra_tips.append("Reforzar consultas SQL, joins, filtros e inserts.")

    return tips[label] + extra_tips


def train_pack(features: List[str], x: np.ndarray, y: np.ndarray) -> ModelPack:
    encoder = LabelEncoder()
    encoded_y = encoder.fit_transform(y)
    model = RandomForestClassifier(
        n_estimators=180,
        max_depth=7,
        random_state=RANDOM_STATE,
        class_weight="balanced_subsample",
    )

    model.fit(x, encoded_y)

    return ModelPack(
        features=features,
        labels=[str(label) for label in encoder.classes_],
        model=model,
        encoder=encoder,
    )


def train_talent_model() -> None:
    x, y = generate_talent_data()
    MODELS[MODEL_KEY] = train_pack(
        [
            "javascript",
            "react",
            "spring_boot",
            "python_datos",
            "sql",
            "experiencia_proyectos",
            "preferencia",
        ],
        x,
        y,
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    train_talent_model()
    yield
    MODELS.clear()


app = FastAPI(
    title="TalentMatch AI API",
    version="1.0.0",
    description="API IA para prediccion de perfil tecnologico Talent Match.",
    lifespan=lifespan,
)


@app.get("/")
def root():
    return {
        "service": "TalentMatch AI API",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "modelos_cargados": list(MODELS.keys()),
    }


@app.get("/metadata")
def metadata():
    return {
        key: {
            "features": pack.features,
            "labels": pack.labels,
        }
        for key, pack in MODELS.items()
    }


@app.post("/predict/talent-match")
def predict_talent(payload: TalentRequest):
    model_pack = MODELS.get(MODEL_KEY)
    if model_pack is None:
        raise HTTPException(status_code=503, detail="Modelo TalentMatch no cargado")

    values = payload.model_dump()
    prediction = model_pack.predict(values)

    return {
        "caso": "TalentMatchAI",
        "prediccion": prediction["label"],
        "confianza": prediction["confidence"],
        "ranking": prediction["ranking"],
        "recomendaciones": recommendation_talent(payload, prediction["label"]),
        "entrada": values,
    }
