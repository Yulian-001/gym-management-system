/**
 * Script de limpieza: Eliminar todos los registros de eventos de la tabla ventas
 * Uso: node cleanup-eventos.js
 */

const db = require('./src/config/db');

async function limpiarEventos() {
  try {
    console.log('Iniciando limpieza de eventos...');
    
    // Contar registros antes
    const countBefore = await db.query('SELECT COUNT(*) as total FROM ventas');
    console.log(`Registros antes de limpieza: ${countBefore.rows[0].total}`);
    
    // Eliminar eventos
    const deleteResult = await db.query('DELETE FROM ventas WHERE evento IS NOT NULL RETURNING id');
    console.log(`Registros de eventos eliminados: ${deleteResult.rows.length}`);
    
    // Contar registros después
    const countAfter = await db.query('SELECT COUNT(*) as total FROM ventas');
    console.log(`Registros despues de limpieza: ${countAfter.rows[0].total}`);
    
    // Verificar planes restantes
    const planeCount = await db.query('SELECT COUNT(*) as total FROM ventas WHERE plan_id IS NOT NULL');
    console.log(`Registros de planes restantes: ${planeCount.rows[0].total}`);
    
    console.log('\nLimpieza completada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error durante limpieza:', error.message);
    process.exit(1);
  }
}

limpiarEventos();
