const pool = require('../../config/db');

// Obtener todas las entradas del día
const getAllEntradas = async () => {
  const result = await pool.query('SELECT * FROM entrada_dia ORDER BY id ASC');
  return result.rows;
};

// Obtener entrada por ID
const getEntradaById = async (id) => {
  const result = await pool.query('SELECT * FROM entrada_dia WHERE id = $1', [id]);
  return result.rows[0];
};

// Crear nueva entrada
const createEntrada = async (nombre_cliente, fecha, hora, metodo_pago, estado) => {
  const result = await pool.query(
    'INSERT INTO entrada_dia (nombre_cliente, fecha, hora, metodo_pago, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [nombre_cliente, fecha, hora, metodo_pago, estado]
  );
  return result.rows[0];
};

// Actualizar entrada
const updateEntrada = async (id, nombre_cliente, fecha, hora, metodo_pago, estado) => {
  const result = await pool.query(
    'UPDATE entrada_dia SET nombre_cliente = $1, fecha = $2, hora = $3, metodo_pago = $4, estado = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
    [nombre_cliente, fecha, hora, metodo_pago, estado, id]
  );
  return result.rows[0];
};

// Eliminar entrada
const deleteEntrada = async (id) => {
  const result = await pool.query('DELETE FROM entrada_dia WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  getAllEntradas,
  getEntradaById,
  createEntrada,
  updateEntrada,
  deleteEntrada
};
