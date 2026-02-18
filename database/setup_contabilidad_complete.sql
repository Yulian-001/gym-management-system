-- Script completo para preparar la BD para el módulo de Contabilidad
-- Este script crea todas las tablas necesarias y actualiza la tabla ventas

-- ============================================================
-- PASO 1: Crear tabla de Empleados
-- ============================================================
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

-- Crear índices para empleados
CREATE INDEX IF NOT EXISTS idx_empleados_cedula ON empleados(cedula);
CREATE INDEX IF NOT EXISTS idx_empleados_estado ON empleados(estado);
CREATE INDEX IF NOT EXISTS idx_empleados_cargo ON empleados(cargo);

-- Insertar empleado por defecto
INSERT INTO empleados (nombre, cedula, cargo, estado)
VALUES ('Empleado Predeterminado', '0000000000', 'Vendedor', 'activo')
ON CONFLICT (cedula) DO NOTHING;

-- ============================================================
-- PASO 2: Crear tabla de Egresos (Gastos)
-- ============================================================
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

-- Crear índices para egresos
CREATE INDEX IF NOT EXISTS idx_egresos_fecha ON egresos(fecha_egreso);
CREATE INDEX IF NOT EXISTS idx_egresos_categoria ON egresos(categoria);
CREATE INDEX IF NOT EXISTS idx_egresos_estado ON egresos(estado);

-- ============================================================
-- PASO 3: Actualizar tabla VENTAS con columnas para contabilidad
-- ============================================================
ALTER TABLE ventas
ADD COLUMN IF NOT EXISTS plan_id INT REFERENCES plans(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS empleado_id INT REFERENCES empleados(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS fecha_venta DATE,
ADD COLUMN IF NOT EXISTS monto DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS hora_venta TIME DEFAULT CURRENT_TIME;

-- Actualizar datos existentes: copiar 'fecha' a 'fecha_venta' y 'total' a 'monto' si está vacío
UPDATE ventas 
SET 
  fecha_venta = CASE WHEN fecha_venta IS NULL THEN fecha ELSE fecha_venta END,
  monto = CASE WHEN monto IS NULL THEN total ELSE monto END,
  empleado_id = CASE WHEN empleado_id IS NULL THEN 1 ELSE empleado_id END
WHERE fecha_venta IS NULL OR monto IS NULL;

-- Crear índices para ventas
CREATE INDEX IF NOT EXISTS idx_ventas_plan_id ON ventas(plan_id);
CREATE INDEX IF NOT EXISTS idx_ventas_empleado_id ON ventas(empleado_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha_venta ON ventas(fecha_venta);
CREATE INDEX IF NOT EXISTS idx_ventas_metodo_pago ON ventas(metodo_pago);

-- ============================================================
-- PASO 4: Crear tabla de Resumen Financiero
-- ============================================================
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

-- Crear índices para resumen_caja
CREATE INDEX IF NOT EXISTS idx_resumen_caja_fecha ON resumen_caja(fecha_resumen);
CREATE INDEX IF NOT EXISTS idx_resumen_caja_estado ON resumen_caja(estado);

-- ============================================================
-- Fin del script - Todas las tablas están creadas
-- ============================================================
