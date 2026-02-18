-- Script para agregar columnas faltantes a la tabla plans
-- En caso de que no existan

ALTER TABLE plans
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE plans
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'activo';

-- Verificación final
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name='plans'
ORDER BY ordinal_position;
