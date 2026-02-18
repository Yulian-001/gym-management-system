-- Tabla de Empleados/Vendedores
CREATE TABLE IF NOT EXISTS empleados (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE,
  telefono VARCHAR(15),
  cargo VARCHAR(100) NOT NULL,
  salario DECIMAL(10,2),
  estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
  fecha_contratacion DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_empleados_cedula ON empleados(cedula);
CREATE INDEX IF NOT EXISTS idx_empleados_estado ON empleados(estado);
CREATE INDEX IF NOT EXISTS idx_empleados_cargo ON empleados(cargo);

-- Tabla de Egresos (Gastos)
CREATE TABLE IF NOT EXISTS egresos (
  id SERIAL PRIMARY KEY,
  concepto VARCHAR(200) NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(100),
  fecha_egreso DATE NOT NULL DEFAULT CURRENT_DATE,
  descripcion TEXT,
  metodo_pago VARCHAR(50) CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia', 'cheque')),
  estado VARCHAR(20) DEFAULT 'completado' CHECK (estado IN ('pendiente', 'completado', 'cancelado')),
  autorizado_por INT REFERENCES empleados(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_egresos_fecha ON egresos(fecha_egreso);
CREATE INDEX IF NOT EXISTS idx_egresos_categoria ON egresos(categoria);
CREATE INDEX IF NOT EXISTS idx_egresos_estado ON egresos(estado);

-- Alter tabla de ventas para incluir vendedor (si no existe la columna)
ALTER TABLE ventas 
ADD COLUMN IF NOT EXISTS empleado_id INT REFERENCES empleados(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS hora_venta TIME DEFAULT CURRENT_TIME;

-- Índices adicionales para ventas
CREATE INDEX IF NOT EXISTS idx_ventas_empleado_id ON ventas(empleado_id);
CREATE INDEX IF NOT EXISTS idx_ventas_hora ON ventas(hora_venta);

-- Tabla de Resumen Financiero (para cálculos rápidos)
CREATE TABLE IF NOT EXISTS resumen_caja (
  id SERIAL PRIMARY KEY,
  fecha_resumen DATE NOT NULL UNIQUE,
  total_ventas_efectivo DECIMAL(10,2) DEFAULT 0,
  total_ventas_tarjeta DECIMAL(10,2) DEFAULT 0,
  total_ventas_transferencia DECIMAL(10,2) DEFAULT 0,
  total_egresos_efectivo DECIMAL(10,2) DEFAULT 0,
  total_egresos_tarjeta DECIMAL(10,2) DEFAULT 0,
  total_egresos_transferencia DECIMAL(10,2) DEFAULT 0,
  total_ingresos DECIMAL(10,2) DEFAULT 0,
  total_egresos DECIMAL(10,2) DEFAULT 0,
  saldo_neto DECIMAL(10,2) DEFAULT 0,
  diferencia_caja DECIMAL(10,2) DEFAULT 0,
  abierto_por INT REFERENCES empleados(id),
  cerrado_por INT REFERENCES empleados(id),
  estado VARCHAR(20) DEFAULT 'abierto' CHECK (estado IN ('abierto', 'cerrado')),
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_resumen_caja_fecha ON resumen_caja(fecha_resumen);
CREATE INDEX IF NOT EXISTS idx_resumen_caja_estado ON resumen_caja(estado);
