CREATE TABLE talent_predictions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    evaluation_id BIGINT NOT NULL,
    perfil_recomendado VARCHAR(60) NOT NULL,
    confianza NUMERIC(5, 4) NOT NULL,
    ranking_json TEXT NOT NULL,
    recomendaciones TEXT NOT NULL,
    fecha_prediccion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
