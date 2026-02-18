-- Script completo para reparar la tabla ventas

-- ============================================================
-- PASO 1: Permitir NULL en la columna fecha (antigua)
-- ============================================================
ALTER TABLE ventas
ALTER COLUMN fecha DROP NOT NULL;

-- ============================================================
-- PASO 2: Asegurar que las columnas contabilidad existen
-- ============================================================
ALTER TABLE ventas
ADD COLUMN IF NOT EXISTS fecha_venta DATE;

ALTER TABLE ventas
ADD COLUMN IF NOT EXISTS monto DECIMAL(10,2);

ALTER TABLE ventas
ADD COLUMN IF NOT EXISTS plan_id INT REFERENCES plans(id) ON DELETE SET NULL;

ALTER TABLE ventas
ADD COLUMN IF NOT EXISTS empleado_id INT REFERENCES empleados(id) ON DELETE SET NULL;

ALTER TABLE ventas
ADD COLUMN IF NOT EXISTS hora_venta TIME;

-- ============================================================
-- PASO 3: Copiar datos de columnas antiguas a nuevas
-- ============================================================
UPDATE ventas 
SET 
  fecha_venta = CASE WHEN fecha_venta IS NULL THEN fecha ELSE fecha_venta END,
  monto = CASE WHEN monto IS NULL THEN total ELSE monto END,
  empleado_id = CASE WHEN empleado_id IS NULL THEN 1 ELSE empleado_id END,
  hora_venta = CASE WHEN hora_venta IS NULL THEN CURRENT_TIME ELSE hora_venta END
WHERE fecha_venta IS NULL OR monto IS NULL;

-- ============================================================
-- PASO 4: Hacer fecha_venta obligatoria
-- ============================================================
ALTER TABLE ventas
ALTER COLUMN fecha_venta SET NOT NULL;

-- ============================================================
-- PASO 5: Hacer monto obligatoria
-- ============================================================
ALTER TABLE ventas
ALTER COLUMN monto SET NOT NULL;

-- ============================================================
-- PASO 6: Crear índices para mejor rendimiento
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_ventas_fecha_venta ON ventas(fecha_venta);
CREATE INDEX IF NOT EXISTS idx_ventas_empleado_id ON ventas(empleado_id);
CREATE INDEX IF NOT EXISTS idx_ventas_plan_id ON ventas(plan_id);
CREATE INDEX IF NOT EXISTS idx_ventas_metodo_pago ON ventas(metodo_pago);

-- ============================================================
-- PASO 7: Permitir NULL en fecha (si aún no está vacía)
-- ============================================================
ALTER TABLE ventas
ALTER COLUMN fecha DROP NOT NULL;

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
SELECT 
  column_name, 
  is_nullable, 
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name='ventas' 
  AND column_name IN ('fecha', 'fecha_venta', 'monto', 'total', 'empleado_id', 'plan_id')
ORDER BY ordinal_position;

