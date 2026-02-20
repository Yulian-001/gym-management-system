/**
 * Script de migración: Agregar columnas faltantes a tabla ventas
 * Uso: node migrate-ventas-structure.js
 */

const pool = require('./src/config/db');
const fs = require('fs');
const path = require('path');

async function executeMigration() {
  try {
    console.log('Iniciando migracion de la tabla ventas...\n');

    // Script SQL de migración
    const migrationSQL = `
      -- Agregar columnas faltantes a ventas
      ALTER TABLE ventas
      ADD COLUMN IF NOT EXISTS evento VARCHAR(50),
      ADD COLUMN IF NOT EXISTS evento_precio DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS empleado_id INT REFERENCES empleados(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS hora_venta TIME,
      ADD COLUMN IF NOT EXISTS descripcion VARCHAR(255),
      ADD COLUMN IF NOT EXISTS cantidad INT DEFAULT 1,
      ADD COLUMN IF NOT EXISTS precio_unitario DECIMAL(10, 2);

      -- Verificar estructura actual
      SELECT column_name, data_type FROM information_schema.columns 
      WHERE table_name = 'ventas' ORDER BY ordinal_position;
    `;

    // Ejecutar migración
    console.log('Ejecutando migracion...');
    const result = await pool.query(migrationSQL);
    
    console.log('Migracion completada correctamente\n');
    console.log('Estructura de tabla ventas:');
    
    // Mostrar columnas
    if (result[1] && result[1].rows) {
      result[1].rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type}`);
      });
    }

    console.log('\nLa tabla ventas esta lista para recibir eventos');
    pool.end();
    process.exit(0);

  } catch (error) {
    console.error('Error durante la migracion:', error.message);
    console.error(error);
    pool.end();
    process.exit(1);
  }
}

executeMigration();
