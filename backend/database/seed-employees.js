// Script para insertar empleados de prueba ejecutable desde Node.js
// Ejecutar: node database/seed-employees.js

const db = require('../src/config/db');

async function seedEmployees() {
  try {
    console.log('🔧 Iniciando inserción de datos de prueba...\n');

    // Primero, verificar si existen las columnas necesarias
    console.log('✓ Verificando estructura de tabla empleados...');
    
    try {
      await db.query(`
        ALTER TABLE empleados 
        ADD COLUMN IF NOT EXISTS password VARCHAR(255)
      `);
      console.log('  ✓ Columna password verificada');
    } catch (e) {
      console.log('  ⚠️ Columna password ya existe');
    }

    try {
      await db.query(`
        ALTER TABLE empleados 
        ADD COLUMN IF NOT EXISTS rol VARCHAR(50) 
        DEFAULT 'recepcionista' 
        CHECK (rol IN ('administrador', 'gerente', 'recepcionista', 'vendedor'))
      `);
      console.log('  ✓ Columna rol verificada');
    } catch (e) {
      console.log('  ⚠️ Columna rol ya existe');
    }

    // Eliminar empleados de prueba existentes
    console.log('\n🗑️  Eliminando empleados de prueba existentes...');
    await db.query(
      `DELETE FROM empleados WHERE cedula IN ($1, $2, $3)`,
      ['1000000001', '1000000002', '1000000003']
    );
    console.log('✓ Limpieza completada');

    // Insertar empleados de prueba
    console.log('\n📝 Insertando empleados de prueba...\n');

    const empleados = [
      {
        nombre: 'Juan Administrador',
        cedula: '1000000001',
        email: 'admin@gym.com',
        telefono: '3001234567',
        cargo: 'Administrador',
        salario: 5000000,
        password: '1000000001',  // Contraseña = cédula
        rol: 'administrador'
      },
      {
        nombre: 'María Gerente',
        cedula: '1000000002',
        email: 'gerente@gym.com',
        telefono: '3002345678',
        cargo: 'Gerente',
        salario: 3500000,
        password: '1000000002',  // Contraseña = cédula
        rol: 'gerente'
      },
      {
        nombre: 'Carlos Recepcionista',
        cedula: '1000000003',
        email: 'recepcionista@gym.com',
        telefono: '3003456789',
        cargo: 'Recepcionista',
        salario: 1500000,
        password: '1000000003',  // Contraseña = cédula
        rol: 'recepcionista'
      }
    ];

    for (const emp of empleados) {
      const result = await db.query(
        `INSERT INTO empleados (nombre, cedula, email, telefono, cargo, salario, password, rol, estado, fecha_contratacion)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE)
         RETURNING id, nombre, cedula, rol`,
        [emp.nombre, emp.cedula, emp.email, emp.telefono, emp.cargo, emp.salario, emp.password, emp.rol, 'activo']
      );
      
      if (result.rows[0]) {
        console.log(`✓ ${emp.rol.toUpperCase()}: ${emp.nombre} (${emp.cedula})`);
      }
    }

    // Verificar inserción
    console.log('\n✅ Verificando datos insertados...\n');
    const verification = await db.query(
      `SELECT id, nombre, cedula, cargo, rol, estado 
       FROM empleados 
       WHERE cedula IN ($1, $2, $3) 
       ORDER BY rol`,
      ['1000000001', '1000000002', '1000000003']
    );

    console.table(verification.rows);
    console.log('\n✅ ¡Datos de prueba insertados exitosamente!\n');
    console.log('📌 Puedes usar estas credenciales para iniciar sesión:\n');
    console.log('   Admin:        1000000001 / admin123');
    console.log('   Gerente:      1000000002 / gerente123');
    console.log('   Recepcionista: 1000000003 / recepcionista123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar datos:', error.message);
    console.error('\nDetalles:', error);
    process.exit(1);
  }
}

seedEmployees();
