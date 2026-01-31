const db = require('../../config/db');

/**
 * Registra un ingreso de un cliente
 */
const registerAttendance = async (client_id) => {
  const { rows } = await db.query(
    `INSERT INTO attendance (client_id)
     VALUES ($1)
     RETURNING *`,
    [client_id]
  );

  return rows[0];
};

/**
 * Obtiene el historial de asistencias con filtros opcionales
 * @param {string} from - fecha inicio (YYYY-MM-DD)
 * @param {string} to - fecha fin (YYYY-MM-DD)
 */
const getAttendance = async (from, to) => {
  let query = `
    SELECT 
      a.id,
      a.client_id,
      c.name,
      a.entry_time
    FROM attendance a
    JOIN clients c ON c.id = a.client_id
    WHERE 1=1
  `;

  const params = [];

  if (from) {
    params.push(from);
    query += ` AND a.entry_time >= $${params.length}`;
  }

  if (to) {
    params.push(to);
    query += ` AND a.entry_time <= $${params.length}`;
  }

  query += ` ORDER BY a.entry_time DESC`;

  const { rows } = await db.query(query, params);
  return rows;
};

module.exports = {
  registerAttendance,
  getAttendance
};
