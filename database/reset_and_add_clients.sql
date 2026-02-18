
-- PASO 1: Eliminar todas las referencias (CASCADE eliminará automáticamente)
DELETE FROM clientes;

-- PASO 2: Reset de la secuencia de IDs
ALTER SEQUENCE clientes_id_seq RESTART WITH 1;

-- PASO 3: Insertar 16 clientes nuevos (6 originales + 10 nuevos)
INSERT INTO clientes (nombre, cedula, telefono, email, eps, rh, plan_id, inicio, vence, estado, registro_empleados, observaciones) 
VALUES 
-- 6 Clientes originales
('Agustín Rojas', '112212132', '3202552456', 'agustin@email.com', 'Capital Salud', 'O-', 1, '2026-01-01', '2026-02-01', 'activo', 'ADM001', 'Cliente original'),
('María González', '112212133', '3202552457', 'maria@email.com', 'Sura', 'A+', 2, '2026-01-15', '2026-04-15', 'activo', 'ADM001', 'Cliente original'),
('Jorge González', '125405588', '3502458586', 'jorge@email.com', 'Sanitas', 'A+', 5, '2026-02-01', '2026-02-11', 'vencido', 'ADM002', 'Cliente original vencido'),
('Yulian Soracá', '1122121261', '3144533850', 'yulian@email.com', 'Capital Salud', 'O+', 1, '2026-02-01', '2026-03-01', 'activo', 'ADM001', 'Cliente original'),
('Carlos Martínez', '987654321', '3001234567', 'carlos@email.com', 'Axa', 'B+', 3, '2025-12-01', '2026-06-01', 'activo', 'ADM003', 'Cliente original'),
('Laura Pérez', '1098765432', '3109876543', 'laura@email.com', 'Coomeva', 'AB-', 4, '2025-11-01', '2026-11-01', 'activo', 'ADM002', 'Cliente original'),

-- 10 Clientes nuevos
('Andrés Pérez López', '1098765431', '3145678901', 'andres.perez@email.com', 'Sura', 'B+', 1, '2026-02-14', '2026-03-14', 'activo', 'ADM001', 'Cliente frecuente'),
('Daniela García Ruiz', '1076543210', '3167890123', 'daniela.garcia@email.com', 'EPS-S', 'O+', 2, '2026-01-20', '2026-04-20', 'activo', 'ADM002', 'Pago mensual'),
('Felipe Rodríguez Gómez', '1065432109', '3128765432', 'felipe.rodriguez@email.com', 'Coomeva', 'A+', 3, '2025-12-10', '2026-06-10', 'activo', 'ADM001', 'Plan semestral'),
('Isabela Martínez Silva', '1054321098', '3189012345', 'isabela.martinez@email.com', 'Compensar', 'AB+', 1, '2026-02-14', '2026-03-14', 'activo', 'ADM003', 'Nueva miembro'),
('Jhon Edison Sánchez', '1043210987', '3201234567', 'jhon.sanchez@email.com', 'Famisanar', 'O-', 2, '2026-02-01', '2026-05-01', 'activo', 'ADM001', 'Plan trimestral'),
('Karol Mendoza Fuentes', '1032109876', '3212345678', 'karol.mendoza@email.com', 'Unipersonal', 'B-', 5, '2026-02-14', '2026-02-24', 'activo', 'ADM002', 'Acceso tipo ticketera'),
('Luis Fernando García', '1021098765', '3223456789', 'luis.garcia@email.com', 'Emssanar', 'A-', 4, '2025-10-14', '2026-10-14', 'activo', 'ADM003', 'Plan anual vigente'),
('Mónica Sepúlveda Torres', '1010987654', '3234567890', 'monica.sepulveda@email.com', 'Salud Total', 'O+', 1, '2026-02-08', '2026-03-08', 'activo', 'ADM001', 'Reciente registro'),
('Nicolás Vargas Herrera', '1009876543', '3245678901', 'nicolas.vargas@email.com', 'Compensar', 'B+', 2, '2026-01-25', '2026-04-25', 'pendiente', 'ADM002', 'Pendiente confirmación'),
('Paola Valencia Reyes', '1008765432', '3256789012', 'paola.valencia@email.com', 'Medimás', 'AB-', 1, '2026-02-10', '2026-03-10', 'activo', 'ADM001', 'Cliente vip');


SELECT 
  COUNT(*) as total_clientes,
  SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as activos,
  SUM(CASE WHEN estado = 'vencido' THEN 1 ELSE 0 END) as vencidos,
  SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes
FROM clientes;

-- Mostrar todos los clientes
SELECT id, cedula, nombre, email, telefono, estado FROM clientes ORDER BY id;
