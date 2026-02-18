-- Crear tabla de Empleados/Vendedores
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

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_empleados_cedula ON empleados(cedula);
CREATE INDEX IF NOT EXISTS idx_empleados_estado ON empleados(estado);
CREATE INDEX IF NOT EXISTS idx_empleados_cargo ON empleados(cargo);

-- Insertar empleado por defecto si tabla está vacía
INSERT INTO empleados (nombre, cedula, cargo, estado)
VALUES ('Empleado Predeterminado', '0000000000', 'Vendedor', 'activo')
ON CONFLICT (cedula) DO NOTHING;
