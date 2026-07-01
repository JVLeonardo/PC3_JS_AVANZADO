-- Esquema academico PC2: cafeteria, laboratorio, matricula y tareas.
-- El script recrea las tablas y carga datos iniciales para demostracion.

DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS matriculas CASCADE;
DROP TABLE IF EXISTS incidencias CASCADE;
DROP TABLE IF EXISTS tareas CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS cursos CASCADE;

CREATE TABLE productos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    categoria VARCHAR(80) NOT NULL,
    precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
    stock INTEGER NOT NULL CHECK (stock >= 0)
);

CREATE TABLE pedidos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_estudiante VARCHAR(120) NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    observacion VARCHAR(300),
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedidos_producto FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE incidencias (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_reportante VARCHAR(120) NOT NULL,
    rol_reportante VARCHAR(20) NOT NULL,
    aula VARCHAR(40) NOT NULL,
    equipo VARCHAR(60) NOT NULL,
    tipo VARCHAR(80) NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_incidencias_rol CHECK (rol_reportante IN ('ESTUDIANTE', 'DOCENTE')),
    CONSTRAINT chk_incidencias_estado CHECK (estado IN ('PENDIENTE', 'EN_PROCESO', 'ATENDIDA'))
);

CREATE TABLE cursos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(120) NOT NULL,
    creditos INTEGER NOT NULL CHECK (creditos > 0),
    modalidad VARCHAR(20) NOT NULL,
    vacantes INTEGER NOT NULL CHECK (vacantes >= 0),
    CONSTRAINT chk_cursos_modalidad CHECK (modalidad IN ('PRESENCIAL', 'VIRTUAL', 'HIBRIDA'))
);

CREATE TABLE matriculas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_estudiante VARCHAR(120) NOT NULL,
    codigo_estudiante VARCHAR(30) NOT NULL,
    curso_id BIGINT NOT NULL,
    turno VARCHAR(20) NOT NULL,
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_matriculas_curso FOREIGN KEY (curso_id) REFERENCES cursos(id),
    CONSTRAINT uk_matriculas_estudiante_curso UNIQUE (codigo_estudiante, curso_id),
    CONSTRAINT chk_matriculas_turno CHECK (turno IN ('MANANA', 'TARDE', 'NOCHE'))
);

CREATE TABLE tareas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    curso VARCHAR(120) NOT NULL,
    descripcion VARCHAR(500),
    fecha_entrega DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    prioridad VARCHAR(20) NOT NULL,
    CONSTRAINT chk_tareas_estado CHECK (estado IN ('PENDIENTE', 'EN_PROCESO', 'COMPLETADA')),
    CONSTRAINT chk_tareas_prioridad CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA'))
);

CREATE INDEX idx_pedidos_producto_id ON pedidos(producto_id);
CREATE INDEX idx_incidencias_estado ON incidencias(estado);
CREATE INDEX idx_matriculas_curso_id ON matriculas(curso_id);
CREATE INDEX idx_tareas_fecha_entrega ON tareas(fecha_entrega);
CREATE INDEX idx_tareas_estado ON tareas(estado);

INSERT INTO productos (nombre, categoria, precio, stock) VALUES
('Cafe americano', 'Bebidas', 4.50, 20),
('Sandwich de pollo', 'Comidas', 9.50, 8),
('Jugo natural', 'Bebidas', 6.00, 0),
('Galleta integral', 'Snacks', 3.00, 15);

INSERT INTO incidencias
(nombre_reportante, rol_reportante, aula, equipo, tipo, descripcion, estado) VALUES
('Ana Torres', 'ESTUDIANTE', 'LAB-01', 'PC-05', 'Hardware', 'El teclado no responde.', 'PENDIENTE'),
('Carlos Vega', 'DOCENTE', 'LAB-02', 'PC-12', 'Software', 'No inicia el programa de diseno.', 'EN_PROCESO'),
('Lucia Ramos', 'ESTUDIANTE', 'LAB-01', 'PC-02', 'Red', 'No tiene conexion a internet.', 'ATENDIDA');

INSERT INTO cursos (codigo, nombre, creditos, modalidad, vacantes) VALUES
('JS301', 'JavaScript Avanzado', 4, 'PRESENCIAL', 12),
('ANG201', 'Desarrollo con Angular', 4, 'HIBRIDA', 8),
('BD101', 'Base de Datos', 3, 'VIRTUAL', 0);

INSERT INTO tareas
(titulo, curso, descripcion, fecha_entrega, estado, prioridad) VALUES
('Entrega de componentes', 'Desarrollo con Angular', 'Construir las vistas del modulo.', CURRENT_DATE + 5, 'PENDIENTE', 'ALTA'),
('Consulta SQL', 'Base de Datos', 'Preparar consultas principales.', CURRENT_DATE - 1, 'PENDIENTE', 'MEDIA'),
('Exposicion final', 'JavaScript Avanzado', 'Presentar el proyecto.', CURRENT_DATE + 10, 'EN_PROCESO', 'ALTA');
