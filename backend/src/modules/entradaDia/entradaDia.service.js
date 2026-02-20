const pool = require('../../config/db');

//? Obtener todas las entradas del día (filtradas por empleado si es recepcionista)
const getAllEntradas = async (empleado_id = null, rol = null) => {
  if (rol === 'recepcionista' && empleado_id) {
    const result = await pool.query(
      "SELECT * FROM entrada_dia WHERE (empleado_id = $1) AND estado != 'archivada' ORDER BY id ASC",
      [empleado_id]
    );
    return result.rows;
  }
  // Admins y gerentes ven todo lo no archivado
  const result = await pool.query("SELECT * FROM entrada_dia WHERE estado != 'archivada' ORDER BY id ASC");
  return result.rows;
};

//? Obtener entrada por ID
const getEntradaById = async (id) => {
  const result = await pool.query('SELECT * FROM entrada_dia WHERE id = $1', [id]);
  return result.rows[0];
};

//? Crear nueva entrada
const createEntrada = async (nombre_cliente, fecha, hora, metodo_pago, estado, evento = null, evento_precio = null, empleado_id = null) => {
  const result = await pool.query(
    'INSERT INTO entrada_dia (nombre_cliente, fecha, hora, metodo_pago, estado, evento, evento_precio, empleado_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [nombre_cliente, fecha, hora, metodo_pago, estado, evento, evento_precio, empleado_id || null]
  );
  return result.rows[0];
};

//? Actualizar entrada
const updateEntrada = async (id, nombre_cliente, fecha, hora, metodo_pago, estado, evento = null, evento_precio = null) => {
  const result = await pool.query(
    'UPDATE entrada_dia SET nombre_cliente = $1, fecha = $2, hora = $3, metodo_pago = $4, estado = $5, evento = $6, evento_precio = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
    [nombre_cliente, fecha, hora, metodo_pago, estado, evento, evento_precio, id]
  );
  return result.rows[0];
};

//? Eliminar entrada
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
