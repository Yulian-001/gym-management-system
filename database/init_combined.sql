
-- Tabla de Planes 
CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  duration_days INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Clientes 
CREATE TABLE IF NOT EXISTS clientes (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  
  -- Datos personales
  nombre VARCHAR(150) NOT NULL,
  cedula VARCHAR(20) NOT NULL UNIQUE,
  sexo CHAR(1) CHECK (sexo IN ('M', 'F', 'O')),
  fecha_nacimiento DATE,
  
  -- Contacto
  telefono VARCHAR(15),
  email VARCHAR(100) UNIQUE,
  
  -- Salud
  eps VARCHAR(100),
  rh VARCHAR(5),
  
  -- Membresía
  plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE SET NULL,
  inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  vence DATE NOT NULL,
  estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'cancelado', 'vencido', 'suspendido')),
  
  -- Control
  registro_empleados VARCHAR(100),
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Entradas/Salidas (Administrativo)
CREATE TABLE IF NOT EXISTS entradas (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  hora_salida TIMESTAMP,
  tipo_entrada VARCHAR(20) DEFAULT 'entrada' CHECK (tipo_entrada IN ('entrada', 'salida')),
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Ventas
CREATE TABLE IF NOT EXISTS ventas (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES plans(id),
  monto DECIMAL(10,2) NOT NULL,
  fecha_venta DATE NOT NULL DEFAULT CURRENT_DATE,
  metodo_pago VARCHAR(50),
  estado VARCHAR(20) DEFAULT 'pagado' CHECK (estado IN ('pendiente', 'pagado', 'cancelado')),
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pagos
CREATE TABLE IF NOT EXISTS pagos (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  venta_id INTEGER REFERENCES ventas(id),
  monto DECIMAL(10,2) NOT NULL,
  fecha_pago DATE NOT NULL DEFAULT CURRENT_DATE,
  metodo_pago VARCHAR(50),
  numero_referencia VARCHAR(100),
  estado VARCHAR(20) DEFAULT 'completado' CHECK (estado IN ('pendiente', 'completado', 'rechazado')),
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Transacciones (Ingresos/Egresos Generales)
CREATE TABLE IF NOT EXISTS transacciones (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ingreso', 'egreso')),
  concepto VARCHAR(200) NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  fecha_transaccion DATE NOT NULL DEFAULT CURRENT_DATE,
  categoria VARCHAR(50),
  id_referencia INTEGER,
  notas TEXT,
  creado_por VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Asistencia (para reportes de frecuencia)
CREATE TABLE IF NOT EXISTS asistencia (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  fecha_asistencia DATE NOT NULL,
  hora_entrada TIME,
  hora_salida TIME,
  estado VARCHAR(20),
  duracion_horas DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Resumen de Ingresos (resumen diario para reportes)
CREATE TABLE IF NOT EXISTS resumen_ingresos (
  id SERIAL PRIMARY KEY,
  fecha_resumen DATE NOT NULL UNIQUE,
  total_ventas DECIMAL(10,2) DEFAULT 0,
  total_pagos DECIMAL(10,2) DEFAULT 0,
  total_egresos DECIMAL(10,2) DEFAULT 0,
  ingreso_neto DECIMAL(10,2) DEFAULT 0,
  clientes_activos INTEGER DEFAULT 0,
  clientes_nuevos INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Índices en clientes
CREATE INDEX IF NOT EXISTS idx_clientes_cedula ON clientes(cedula);
CREATE INDEX IF NOT EXISTS idx_clientes_plan_id ON clientes(plan_id);
CREATE INDEX IF NOT EXISTS idx_clientes_estado ON clientes(estado);
CREATE INDEX IF NOT EXISTS idx_clientes_vence ON clientes(vence);

-- Índices en entradas
CREATE INDEX IF NOT EXISTS idx_entradas_cliente_id ON entradas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_entradas_hora ON entradas(hora_entrada);

-- Índices en ventas
CREATE INDEX IF NOT EXISTS idx_ventas_cliente_id ON ventas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX IF NOT EXISTS idx_ventas_estado ON ventas(estado);

-- Índices en pagos
CREATE INDEX IF NOT EXISTS idx_pagos_cliente_id ON pagos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha ON pagos(fecha_pago);

-- Índices en transacciones
CREATE INDEX IF NOT EXISTS idx_transacciones_fecha ON transacciones(fecha_transaccion);
CREATE INDEX IF NOT EXISTS idx_transacciones_tipo ON transacciones(tipo);

-- Índices en asistencia
CREATE INDEX IF NOT EXISTS idx_asistencia_cliente_id ON asistencia(cliente_id);
CREATE INDEX IF NOT EXISTS idx_asistencia_fecha ON asistencia(fecha_asistencia);


-- Insertar planes de ejemplo
INSERT INTO plans (name, duration_days, price, description, status) VALUES
('Mensualidad', 30, 50000.00, 'Acceso ilimitado por 30 días', 'activo'),
('Trimestral', 90, 130000.00, 'Plan trimestral con descuento', 'activo'),
('Semestral', 180, 240000.00, 'Plan semestral con mejor precio', 'activo'),
('Anual', 365, 450000.00, 'Plan completo por 12 meses', 'activo'),
('Ticketera', 10, 15000.00, 'Acceso por 10 visitas', 'activo'),
('Día', 1, 5000.00, 'Acceso de un día', 'activo')
ON CONFLICT DO NOTHING;

-- Insertar clientes de ejemplo
INSERT INTO clientes (nombre, cedula, sexo, fecha_nacimiento, telefono, email, eps, rh, plan_id, inicio, vence, estado, registro_empleados) VALUES
('Agustín Rojas', '112212132', 'M', '1990-05-15', '3202552456', 'agustin@email.com', 'Capital Salud', 'O-', 1, '2026-01-01', '2026-02-01', 'activo', 'ADM001'),
('María González', '112212133', 'F', '1995-08-20', '3202552457', 'maria@email.com', 'Sura', 'A+', 2, '2026-01-15', '2026-04-15', 'activo', 'ADM001'),
('Jorge González', '125405588', 'M', '1988-03-10', '3502458586', 'jorge@email.com', 'Sanitas', 'A+', 5, '2026-02-01', '2026-02-11', 'vencido', 'ADM002'),
('Yulian Soracá', '1122121261', 'F', '2000-12-25', '3144533850', 'yulian@email.com', 'Capital Salud', 'O+', 1, '2026-02-01', '2026-03-01', 'activo', 'ADM001'),
('Carlos Martínez', '987654321', 'M', '1992-07-08', '3001234567', 'carlos@email.com', 'Axa', 'B+', 3, '2025-12-01', '2026-06-01', 'activo', 'ADM003'),
('Laura Pérez', '1098765432', 'F', '1998-11-14', '3109876543', 'laura@email.com', 'Coomeva', 'AB-', 4, '2025-11-01', '2026-11-01', 'activo', 'ADM002')
ON CONFLICT DO NOTHING;

-- Insertar entradas de ejemplo
INSERT INTO entradas (cliente_id, hora_entrada, hora_salida, tipo_entrada) VALUES
(1, '2026-02-14 06:30:00', '2026-02-14 08:30:00', 'entrada'),
(2, '2026-02-14 07:00:00', '2026-02-14 09:00:00', 'entrada'),
(3, '2026-02-14 05:45:00', '2026-02-14 07:45:00', 'entrada'),
(4, '2026-02-14 18:00:00', '2026-02-14 20:00:00', 'entrada'),
(5, '2026-02-13 07:15:00', '2026-02-13 09:15:00', 'entrada'),
(6, '2026-02-13 06:00:00', '2026-02-13 08:00:00', 'entrada');

-- Insertar ventas de ejemplo
INSERT INTO ventas (cliente_id, plan_id, monto, fecha_venta, metodo_pago, estado) VALUES
(1, 1, 50000.00, '2026-02-01', 'efectivo', 'pagado'),
(2, 2, 130000.00, '2026-01-15', 'transferencia', 'pagado'),
(3, 5, 15000.00, '2026-02-01', 'efectivo', 'pagado'),
(4, 1, 50000.00, '2026-02-01', 'tarjeta', 'pagado'),
(5, 3, 240000.00, '2025-12-01', 'transferencia', 'pagado'),
(6, 4, 450000.00, '2025-11-01', 'transferencia', 'pagado')
ON CONFLICT DO NOTHING;

-- Insertar pagos de ejemplo
INSERT INTO pagos (cliente_id, venta_id, monto, fecha_pago, metodo_pago, estado) VALUES
(1, 1, 50000.00, '2026-02-01', 'efectivo', 'completado'),
(2, 2, 130000.00, '2026-01-15', 'transferencia', 'completado'),
(3, 3, 15000.00, '2026-02-01', 'efectivo', 'completado'),
(4, 4, 50000.00, '2026-02-01', 'tarjeta', 'completado'),
(5, 5, 240000.00, '2025-12-01', 'transferencia', 'completado'),
(6, 6, 450000.00, '2025-11-01', 'transferencia', 'completado')
ON CONFLICT DO NOTHING;

-- Insertar transacciones de ejemplo
INSERT INTO transacciones (tipo, concepto, monto, fecha_transaccion, categoria) VALUES
('ingreso', 'Venta Plan Mensual - Agustín Rojas', 50000.00, '2026-02-01', 'ventas'),
('ingreso', 'Venta Plan Trimestral - María González', 130000.00, '2026-01-15', 'ventas'),
('ingreso', 'Venta Ticketera - Jorge González', 15000.00, '2026-02-01', 'ventas'),
('ingreso', 'Venta Plan Mensual - Yulian Soracá', 50000.00, '2026-02-01', 'ventas'),
('ingreso', 'Venta Plan Semestral - Carlos Martínez', 240000.00, '2025-12-01', 'ventas'),
('ingreso', 'Venta Plan Anual - Laura Pérez', 450000.00, '2025-11-01', 'ventas'),
('egreso', 'Pago Renta Gimnasio', 2000000.00, '2026-02-01', 'gastos-operacionales'),
('egreso', 'Pago Servicios Públicos', 150000.00, '2026-02-05', 'gastos-operacionales'),
('egreso', 'Mantenimiento de Equipos', 300000.00, '2026-02-10', 'mantenimiento')
ON CONFLICT DO NOTHING;

-- Insertar asistencia de ejemplo
INSERT INTO asistencia (cliente_id, fecha_asistencia, hora_entrada, hora_salida, estado, duracion_horas) VALUES
(1, '2026-02-14', '06:30', '08:30', 'presente', 2.0),
(2, '2026-02-14', '07:00', '09:00', 'presente', 2.0),
(3, '2026-02-14', '05:45', '07:45', 'presente', 2.0),
(4, '2026-02-14', '18:00', '20:00', 'presente', 2.0),
(5, '2026-02-13', '07:15', '09:15', 'presente', 2.0),
(6, '2026-02-13', '06:00', '08:00', 'presente', 2.0),
(1, '2026-02-13', '06:45', '08:45', 'presente', 2.0),
(2, '2026-02-13', '07:30', '09:30', 'presente', 2.0)
ON CONFLICT DO NOTHING;

-- Insertar resumen de ingresos
INSERT INTO resumen_ingresos (fecha_resumen, total_ventas, total_pagos, total_egresos, ingreso_neto, clientes_activos, clientes_nuevos) VALUES
('2026-02-14', 595000.00, 595000.00, 2450000.00, -1855000.00, 5, 0),
('2026-02-13', 0.00, 0.00, 0.00, 0.00, 6, 0),
('2026-02-01', 340000.00, 340000.00, 2000000.00, -1660000.00, 5, 2)
ON CONFLICT DO NOTHING;


-- Vista: Clientes Activos (para reportes)
CREATE OR REPLACE VIEW vw_clientes_activos AS
SELECT 
  c.id,
  c.cedula,
  c.nombre,
  c.email,
  c.telefono,
  p.name as plan,
  p.duration_days,
  p.price,
  c.inicio,
  c.vence,
  CASE 
    WHEN c.vence < CURRENT_DATE THEN 'Vencido'
    WHEN c.vence <= CURRENT_DATE + INTERVAL '7 days' THEN 'Por Vencer'
    ELSE 'Vigente'
  END as estado_plan,
  c.estado
FROM clientes c
LEFT JOIN plans p ON c.plan_id = p.id
WHERE c.estado = 'activo';

-- Vista: Resumen de Ingresos Diarios
CREATE OR REPLACE VIEW vw_ingresos_diarios AS
SELECT 
  t.fecha_transaccion as fecha,
  t.categoria,
  SUM(CASE WHEN t.tipo = 'ingreso' THEN t.monto ELSE 0 END) as ingresos,
  SUM(CASE WHEN t.tipo = 'egreso' THEN t.monto ELSE 0 END) as egresos,
  SUM(CASE WHEN t.tipo = 'ingreso' THEN t.monto ELSE -t.monto END) as balance
FROM transacciones t
GROUP BY t.fecha_transaccion, t.categoria
ORDER BY t.fecha_transaccion DESC;

-- Vista: Asistencia de Clientes
CREATE OR REPLACE VIEW vw_asistencia_clientes AS
SELECT 
  c.id,
  c.cedula,
  c.nombre,
  a.fecha_asistencia,
  a.hora_entrada,
  a.hora_salida,
  a.duracion_horas,
  COUNT(*) OVER (PARTITION BY c.id ORDER BY a.fecha_asistencia) as total_visitas
FROM clientes c
LEFT JOIN asistencia a ON c.id = a.cliente_id
ORDER BY c.id, a.fecha_asistencia DESC;

-- Vista: Pagos Pendientes
CREATE OR REPLACE VIEW vw_pagos_pendientes AS
SELECT 
  c.id,
  c.cedula,
  c.nombre,
  c.email,
  v.id as venta_id,
  v.monto,
  v.fecha_venta,
  (CURRENT_DATE - v.fecha_venta) as dias_vencido
FROM clientes c
INNER JOIN ventas v ON c.id = v.cliente_id
WHERE v.estado = 'pendiente'
ORDER BY v.fecha_venta ASC;

