-- ========== DATOS DE PRUEBA PARA CONTABILIDAD ==========

-- Insertar empleados de prueba
INSERT INTO empleados (nombre, cedula, email, telefono, cargo, salario, estado)
VALUES 
  ('Juan Pérez', '12345678', 'juan@gym.com', '3001234567', 'Vendedor', 1500000, 'activo'),
  ('María García', '87654321', 'maria@gym.com', '3009876543', 'Vendedor', 1500000, 'activo'),
  ('Carlos López', '11111111', 'carlos@gym.com', '3005555555', 'Gerente', 2500000, 'activo'),
  ('Ana Martínez', '22222222', 'ana@gym.com', '3006666666', 'Recepcionista', 1000000, 'activo')
ON CONFLICT (cedula) DO NOTHING;

-- Insertar egresos de prueba (Del día de hoy)
INSERT INTO egresos (concepto, monto, categoria, descripcion, metodo_pago, estado, autorizado_por)
VALUES
  ('Pago de alquiler', 2000000, 'Alquiler', 'Alquiler del mes de febrero 2026', 'transferencia', 'completado', 3),
  ('Pago de servicios públicos', 500000, 'Servicios (Agua, Luz, Internet)', 'Agua, luz e internet del mes', 'transferencia', 'completado', 3),
  ('Mantenimiento de equipos', 300000, 'Mantenimiento', 'Reparación de máquinas', 'efectivo', 'completado', 3),
  ('Marketing digital', 150000, 'Marketing', 'Publicidad en redes sociales', 'tarjeta', 'completado', 3)
ON CONFLICT DO NOTHING;

-- Actualizar ventas existentes con empleado_id (si no está asignado)
-- Esto asigna vendedores aleatorios a las ventas existentes
UPDATE ventas 
SET empleado_id = CASE 
  WHEN id % 4 = 1 THEN 1
  WHEN id % 4 = 2 THEN 2
  WHEN id % 4 = 3 THEN 3
  ELSE 4
END,
hora_venta = COALESCE(hora_venta, '10:30:00')
WHERE empleado_id IS NULL;

-- Verificar datos insertados
SELECT 'Empleados actuales:' as info;
SELECT * FROM empleados ORDER BY id;

SELECT 'Egresos de hoy:' as info;
SELECT * FROM egresos WHERE DATE(fecha_egreso) = CURRENT_DATE;

SELECT 'Ventas con vendedor asignado:' as info;
SELECT v.id, v.monto, v.metodo_pago, e.nombre as vendedor FROM ventas v 
LEFT JOIN empleados e ON v.empleado_id = e.id 
ORDER BY v.id DESC LIMIT 5;
