-- ============================================
-- BASE DE DATOS SISTEMA DE GYM
-- Creada: 14/02/2026
-- Versión: 1.0 (PROVISIONAL)
-- ============================================

-- ============================================
-- 1. MÓDULO ADMINISTRATIVO
-- ============================================

-- Tabla de Planes
CREATE TABLE plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  duration_days INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Clientes
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(15),
  eps VARCHAR(100),
  rh VARCHAR(5),
  plan_id INTEGER REFERENCES plans(id),
  start_date DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Entradas/Salidas (Administrativo)
CREATE TABLE entrances (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  entry_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  exit_time TIMESTAMP,
  entry_type VARCHAR(20) DEFAULT 'entrada',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. MÓDULO CONTABILIDAD
-- ============================================

-- Tabla de Ventas
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES plans(id),
  amount DECIMAL(10,2) NOT NULL,
  sale_date DATE DEFAULT CURRENT_DATE,
  payment_method VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pagado',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pagos
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  sale_id INTEGER REFERENCES sales(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  payment_method VARCHAR(50),
  reference_number VARCHAR(100),
  status VARCHAR(20) DEFAULT 'completado',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Transacciones (Ingresos/Egresos)
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  concept VARCHAR(200) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_date DATE DEFAULT CURRENT_DATE,
  category VARCHAR(50),
  reference_id INTEGER,
  notes TEXT,
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. MÓDULO REPORTES
-- ============================================

-- Tabla de Asistencia (para reportes)
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  in_time TIME,
  out_time TIME,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Ingresos (resumen para reportes)
CREATE TABLE revenue_summary (
  id SERIAL PRIMARY KEY,
  summary_date DATE NOT NULL UNIQUE,
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_payments DECIMAL(10,2) DEFAULT 0,
  total_expenses DECIMAL(10,2) DEFAULT 0,
  net_income DECIMAL(10,2) DEFAULT 0,
  active_clients INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

CREATE INDEX idx_clients_cedula ON clients(cedula);
CREATE INDEX idx_clients_plan_id ON clients(plan_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_entrances_client_id ON entrances(client_id);
CREATE INDEX idx_entrances_entry_time ON entrances(entry_time);
CREATE INDEX idx_sales_client_id ON sales(client_id);
CREATE INDEX idx_sales_sale_date ON sales(sale_date);
CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_transactions_transaction_date ON transactions(transaction_date);
CREATE INDEX idx_attendance_client_id ON attendance(client_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);

-- ============================================
-- DATOS DE EJEMPLO (PROVISIONAL)
-- ============================================

-- Insertar planes de ejemplo
INSERT INTO plans (name, duration_days, price, description, status) VALUES
('Mensualidad', 30, 50000.00, 'Plan mensual de acceso ilimitado', 'activo'),
('Trimestral', 90, 130000.00, 'Plan trimestral con descuento', 'activo'),
('Semestral', 180, 240000.00, 'Plan semestral con mejor precio', 'activo'),
('Anual', 365, 450000.00, 'Plan anual completo', 'activo'),
('Ticketera', 10, 15000.00, 'Acceso por entrada individual', 'activo'),
('Día', 1, 5000.00, 'Acceso por un día', 'activo');

-- Insertar clientes de ejemplo
INSERT INTO clients (cedula, name, email, phone, eps, rh, plan_id, start_date, end_date, status) VALUES
('112212132', 'Agustín Rojas', 'agustin@email.com', '3202552456', 'Capital Salud', 'O-', 1, '2026-01-01', '2026-02-01', 'activo'),
('112212133', 'María González', 'maria@email.com', '3202552457', 'Sura', 'A+', 2, '2026-01-15', '2026-04-15', 'activo'),
('125405588', 'Jorge González', 'jorge@email.com', '3502458586', 'Sanitas', 'A+', 5, '2026-02-01', '2026-02-11', 'vencido'),
('1122121261', 'Yulian Soracá', 'yulian@email.com', '3144533850', 'Capital Salud', 'O+', 1, '2026-02-01', '2026-03-01', 'activo'),
('987654321', 'Carlos Martínez', 'carlos@email.com', '3001234567', 'Axa', 'B+', 3, '2025-12-01', '2026-06-01', 'activo'),
('1098765432', 'Laura Pérez', 'laura@email.com', '3109876543', 'Coomeva', 'AB-', 4, '2025-11-01', '2026-11-01', 'activo');

-- Insertar entradas de ejemplo
INSERT INTO entrances (client_id, entry_time, exit_time, entry_type) VALUES
(1, '2026-02-14 06:30:00', '2026-02-14 08:30:00', 'entrada'),
(2, '2026-02-14 07:00:00', '2026-02-14 09:00:00', 'entrada'),
(3, '2026-02-14 05:45:00', '2026-02-14 07:45:00', 'entrada'),
(4, '2026-02-14 18:00:00', '2026-02-14 20:00:00', 'entrada'),
(5, '2026-02-13 07:15:00', '2026-02-13 09:15:00', 'entrada'),
(6, '2026-02-13 06:00:00', '2026-02-13 08:00:00', 'entrada');

-- Insertar ventas de ejemplo
INSERT INTO sales (client_id, plan_id, amount, sale_date, payment_method, status) VALUES
(1, 1, 50000.00, '2026-02-01', 'efectivo', 'pagado'),
(2, 2, 130000.00, '2026-01-15', 'transferencia', 'pagado'),
(3, 5, 15000.00, '2026-02-01', 'efectivo', 'pagado'),
(4, 1, 50000.00, '2026-02-01', 'tarjeta', 'pagado'),
(5, 3, 240000.00, '2025-12-01', 'transferencia', 'pagado'),
(6, 4, 450000.00, '2025-11-01', 'transferencia', 'pagado');

-- Insertar pagos de ejemplo
INSERT INTO payments (client_id, sale_id, amount, payment_date, payment_method, status) VALUES
(1, 1, 50000.00, '2026-02-01', 'efectivo', 'completado'),
(2, 2, 130000.00, '2026-01-15', 'transferencia', 'completado'),
(3, 3, 15000.00, '2026-02-01', 'efectivo', 'completado'),
(4, 4, 50000.00, '2026-02-01', 'tarjeta', 'completado'),
(5, 5, 240000.00, '2025-12-01', 'transferencia', 'completado'),
(6, 6, 450000.00, '2025-11-01', 'transferencia', 'completado');

-- Insertar transacciones de ejemplo
INSERT INTO transactions (type, concept, amount, transaction_date, category, reference_id) VALUES
('ingreso', 'Venta Plan Mensual - Agustín Rojas', 50000.00, '2026-02-01', 'ventas', 1),
('ingreso', 'Venta Plan Trimestral - María González', 130000.00, '2026-01-15', 'ventas', 2),
('ingreso', 'Venta Ticketera - Jorge González', 15000.00, '2026-02-01', 'ventas', 3),
('ingreso', 'Venta Plan Mensual - Yulian Soracá', 50000.00, '2026-02-01', 'ventas', 4),
('ingreso', 'Venta Plan Semestral - Carlos Martínez', 240000.00, '2025-12-01', 'ventas', 5),
('ingreso', 'Venta Plan Anual - Laura Pérez', 450000.00, '2025-11-01', 'ventas', 6),
('egreso', 'Pago Renta Gimnasio', 2000000.00, '2026-02-01', 'gastos-operacionales', NULL),
('egreso', 'Pago Servicios Públicos', 150000.00, '2026-02-05', 'gastos-operacionales', NULL),
('egreso', 'Mantenimiento Equipos', 300000.00, '2026-02-10', 'mantenimiento', NULL);

-- Insertar asistencia de ejemplo
INSERT INTO attendance (client_id, attendance_date, in_time, out_time, status) VALUES
(1, '2026-02-14', '06:30', '08:30', 'presente'),
(2, '2026-02-14', '07:00', '09:00', 'presente'),
(3, '2026-02-14', '05:45', '07:45', 'presente'),
(4, '2026-02-14', '18:00', '20:00', 'presente'),
(5, '2026-02-13', '07:15', '09:15', 'presente'),
(6, '2026-02-13', '06:00', '08:00', 'presente'),
(1, '2026-02-13', '06:45', '08:45', 'presente'),
(2, '2026-02-13', '07:30', '09:30', 'presente');

-- Insertar resumen de ingresos de ejemplo
INSERT INTO revenue_summary (summary_date, total_sales, total_payments, total_expenses, net_income, active_clients) VALUES
('2026-02-14', 595000.00, 595000.00, 2450000.00, -1855000.00, 5),
('2026-02-13', 0.00, 0.00, 0.00, 0.00, 6),
('2026-02-01', 340000.00, 340000.00, 2000000.00, -1660000.00, 5);

-- ============================================
-- VISTA PARA REPORTES RÁPIDOS
-- ============================================

CREATE VIEW vw_active_clients AS
SELECT 
  c.id,
  c.cedula,
  c.name,
  c.email,
  c.phone,
  p.name as plan,
  p.duration_days,
  p.price,
  c.start_date,
  c.end_date,
  CASE 
    WHEN c.end_date < CURRENT_DATE THEN 'Vencido'
    WHEN c.end_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'Por Vencer'
    ELSE 'Vigente'
  END as plan_status
FROM clients c
LEFT JOIN plans p ON c.plan_id = p.id
WHERE c.status = 'activo';

CREATE VIEW vw_daily_income AS
SELECT 
  t.transaction_date,
  t.category,
  SUM(CASE WHEN t.type = 'ingreso' THEN t.amount ELSE 0 END) as ingresos,
  SUM(CASE WHEN t.type = 'egreso' THEN t.amount ELSE 0 END) as egresos,
  SUM(CASE WHEN t.type = 'ingreso' THEN t.amount ELSE -t.amount END) as balance
FROM transactions t
GROUP BY t.transaction_date, t.category
ORDER BY t.transaction_date DESC;

CREATE VIEW vw_client_attendance AS
SELECT 
  c.id,
  c.cedula,
  c.name,
  a.attendance_date,
  a.in_time,
  a.out_time,
  CASE 
    WHEN a.out_time IS NOT NULL THEN 
      EXTRACT(EPOCH FROM (a.out_time::time - a.in_time::time))/3600
    ELSE NULL
  END as hours_in_gym
FROM clients c
LEFT JOIN attendance a ON c.id = a.client_id
ORDER BY c.id, a.attendance_date DESC;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
