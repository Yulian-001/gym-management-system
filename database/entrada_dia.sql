-- Tabla para entradas diarias (clientes ocasionales)
CREATE TABLE entrada_dia (
  id SERIAL PRIMARY KEY,
  nombre_cliente VARCHAR(100) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia')),
  estado VARCHAR(50) NOT NULL DEFAULT 'activa' CHECK (estado IN ('activa', 'cancelada', 'completada')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsquedas comunes
CREATE INDEX idx_entrada_fecha ON entrada_dia(fecha);
CREATE INDEX idx_entrada_cliente ON entrada_dia(nombre_cliente);

-- Insertar datos de ejemplo
INSERT INTO entrada_dia (nombre_cliente, fecha, hora, metodo_pago, estado) VALUES
('Juan García', '2026-02-16', '08:00:00', 'efectivo', 'activa'),
('María López', '2026-02-16', '09:30:00', 'tarjeta', 'completada'),
('Carlos Rodríguez', '2026-02-16', '10:15:00', 'transferencia', 'activa');
