
-- Primero, eliminar duplicados si existen
DELETE FROM clientes WHERE cedula IN (
  SELECT cedula FROM clientes GROUP BY cedula HAVING COUNT(*) > 1
) AND id NOT IN (
  SELECT MIN(id) FROM clientes GROUP BY cedula HAVING COUNT(*) > 1
);

-- Insertar 10 clientes nuevos (evitando las cédulas existentes)
INSERT INTO clientes (nombre, cedula, sexo, fecha_nacimiento, telefono, email, eps, rh, plan_id, inicio, vence, estado, registro_empleados, observaciones) 
VALUES 
-- 10 clientes nuevos realistas
('Andrés Pérez López', '1098765431', 'M', '1995-03-22', '3145678901', 'andres.perez@email.com', 'Sura', 'B+', 1, '2026-02-14', '2026-03-14', 'activo', 'ADM001', 'Cliente frecuente'),
('Daniela García Ruiz', '1076543210', 'F', '2000-07-18', '3167890123', 'daniela.garcia@email.com', 'EPS-S', 'O+', 2, '2026-01-20', '2026-04-20', 'activo', 'ADM002', 'Pago mensual'),
('Felipe Rodríguez Gómez', '1065432109', 'M', '1988-11-05', '3128765432', 'felipe.rodriguez@email.com', 'Coomeva', 'A+', 3, '2025-12-10', '2026-06-10', 'activo', 'ADM001', 'Plan semestral'),
('Isabela Martínez Silva', '1054321098', 'F', '1993-06-30', '3189012345', 'isabela.martinez@email.com', 'Compensar', 'AB+', 1, '2026-02-14', '2026-03-14', 'activo', 'ADM003', 'Nueva miembro'),
('Jhon Edison Sánchez', '1043210987', 'M', '1994-09-14', '3201234567', 'jhon.sanchez@email.com', 'Famisanar', 'O-', 2, '2026-02-01', '2026-05-01', 'activo', 'ADM001', 'Plan trimestral'),
('Karol Mendoza Fuentes', '1032109876', 'F', '1999-01-25', '3212345678', 'karol.mendoza@email.com', 'Unipersonal', 'B-', 5, '2026-02-14', '2026-02-24', 'activo', 'ADM002', 'Acceso tipo ticketera'),
('Luis Fernando García', '1021098765', 'M', '1991-04-08', '3223456789', 'luis.garcia@email.com', 'Emssanar', 'A-', 4, '2025-10-14', '2026-10-14', 'activo', 'ADM003', 'Plan anual vigente'),
('Mónica Sepúlveda Torres', '1010987654', 'F', '1996-08-12', '3234567890', 'monica.sepulveda@email.com', 'Salud Total', 'O+', 1, '2026-02-08', '2026-03-08', 'activo', 'ADM001', 'Reciente registro'),
('Nicolás Vargas Herrera', '1009876543', 'M', '1997-12-03', '3245678901', 'nicolas.vargas@email.com', 'Nueva EPS', 'B+', 2, '2026-01-25', '2026-04-25', 'pendiente', 'ADM002', 'Pendiente confirmación'),
('Paola Valencia Reyes', '1008765432', 'F', '1992-10-20', '3256789012', 'paola.valencia@email.com', 'Medimás', 'AB-', 1, '2026-02-10', '2026-03-10', 'activo', 'ADM001', 'Cliente vip')
ON CONFLICT (cedula) DO NOTHING;

SELECT 
  id,
  cedula,
  nombre,
  email,
  telefono,
  plan_id,
  vence,
  estado,
  created_at
FROM clientes
ORDER BY id ASC;
