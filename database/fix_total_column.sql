-- Script para permitir NULL en la columna total
-- Esto es necesario porque el backend ahora usa 'monto' en lugar de 'total'

ALTER TABLE ventas
ALTER COLUMN total DROP NOT NULL;

-- Verificación
SELECT 
  column_name, 
  is_nullable, 
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name='ventas' 
  AND column_name IN ('fecha', 'total', 'monto', 'fecha_venta', 'empleado_id', 'plan_id')
ORDER BY ordinal_position;
