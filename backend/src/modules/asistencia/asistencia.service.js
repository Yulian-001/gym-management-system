const pool = require('../../config/db');

const createAsistencia = async (cliente_id, fecha_asistencia, hora_entrada, hora_salida = null, estado = 'presente') => {
  const result = await pool.query(
    `INSERT INTO asistencia (cliente_id, fecha_asistencia, hora_entrada, hora_salida, estado)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [cliente_id, fecha_asistencia, hora_entrada, hora_salida, estado]
  );
  return result.rows[0];
};

const getCountsByClient = async () => {
  const result = await pool.query(`
    SELECT cliente_id, COUNT(*)::integer as total_visitas
    FROM asistencia
    GROUP BY cliente_id
  `);
  return result.rows;
};

module.exports = {
  createAsistencia,
  getCountsByClient
};
