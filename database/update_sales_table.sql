-- Script para actualizar la tabla ventas para que sea compatible con Contabilidad

-- PASO 1: Crear tabla de Empleados si no existe
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

-- Insertar empleado por defecto si tabla está vacía
INSERT INTO empleados (nombre, cedula, cargo, estado)
VALUES ('Empleado Predeterminado', '0000000000', 'Vendedor', 'activo')
ON CONFLICT (cedula) DO NOTHING;

-- PASO 2: Agregar las columnas necesarias si no existen
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
  monto = CASE WHEN monto IS NULL THEN total ELSE monto END
WHERE fecha_venta IS NULL OR monto IS NULL;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_ventas_plan_id ON ventas(plan_id);
CREATE INDEX IF NOT EXISTS idx_ventas_empleado_id ON ventas(empleado_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha_venta ON ventas(fecha_venta);
CREATE INDEX IF NOT EXISTS idx_ventas_metodo_pago ON ventas(metodo_pago);

-- Alterar el estado para que acepte 'completa' además de 'completada'
ALTER TABLE ventas 
DROP CONSTRAINT IF EXISTS ventas_estado_check;

ALTER TABLE ventas
ADD CONSTRAINT ventas_estado_check CHECK (estado IN ('completada', 'completa', 'pendiente', 'cancelada'));
