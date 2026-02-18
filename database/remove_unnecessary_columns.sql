-- Script para eliminar columnas innecesarias de la tabla clientes
-- Ejecutar en pgAdmin

-- Eliminar columnas sexo y fecha_nacimiento
ALTER TABLE clientes DROP COLUMN IF EXISTS sexo;
ALTER TABLE clientes DROP COLUMN IF EXISTS fecha_nacimiento;

-- Verificar estructura resultante
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'clientes';
