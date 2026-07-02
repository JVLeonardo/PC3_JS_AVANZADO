CREATE TABLE talent_evaluations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    javascript INTEGER NOT NULL CHECK (javascript BETWEEN 0 AND 100),
    react INTEGER NOT NULL CHECK (react BETWEEN 0 AND 100),
    spring_boot INTEGER NOT NULL CHECK (spring_boot BETWEEN 0 AND 100),
    python_datos INTEGER NOT NULL CHECK (python_datos BETWEEN 0 AND 100),
    sql INTEGER NOT NULL CHECK (sql BETWEEN 0 AND 100),
    experiencia_proyectos INTEGER NOT NULL CHECK (experiencia_proyectos BETWEEN 0 AND 10),
    preferencia INTEGER NOT NULL CHECK (preferencia BETWEEN 0 AND 3),
    fecha_evaluacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
