CREATE TABLE talent_candidates (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_postulante VARCHAR(120) NOT NULL,
    email_postulante VARCHAR(160),
    avatar_url VARCHAR(500),
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
