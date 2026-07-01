-- Esquema PC3: modulo de cafeteria.
-- Ejecuta este script en PostgreSQL de Render desde pgAdmin antes de usar DDL_AUTO=validate.

DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS productos CASCADE;

CREATE TABLE productos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
    stock INTEGER NOT NULL CHECK (stock >= 0),
    imagen_url VARCHAR(500) NOT NULL
);

CREATE TABLE pedidos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedidos_producto FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE INDEX idx_pedidos_producto_id ON pedidos(producto_id);

INSERT INTO productos (nombre, precio, stock, imagen_url) VALUES
('Cafe americano', 4.50, 20, 'https://res.cloudinary.com/demo/image/upload/w_600,c_fill,q_auto/sample.jpg'),
('Sandwich de pollo', 9.50, 8, 'https://res.cloudinary.com/demo/image/upload/w_600,c_fill,q_auto/samples/food/spices.jpg'),
('Jugo natural', 6.00, 0, 'https://res.cloudinary.com/demo/image/upload/w_600,c_fill,q_auto/samples/food/dessert.jpg');
