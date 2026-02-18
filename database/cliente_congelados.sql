-- Tabla para registrar congelaciones de planes
CREATE TABLE IF NOT EXISTS cliente_congelados (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  fecha_congelacion DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_descongelacion DATE,
  estado VARCHAR(50) NOT NULL DEFAULT 'congelado' CHECK (estado IN ('congelado', 'descongelado')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_cliente_congelados_cliente_id ON cliente_congelados(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cliente_congelados_estado ON cliente_congelados(estado);
CREATE INDEX IF NOT EXISTS idx_cliente_congelados_fecha ON cliente_congelados(fecha_congelacion);
