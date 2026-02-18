const db = require('../../config/db');

module.exports = {
  getAllClients: async () => {
    const result = await db.query('SELECT * FROM clientes ORDER BY id ASC');
    return result.rows;
  },

  getClientById: async (id) => {
    const result = await db.query('SELECT * FROM clientes WHERE id = $1', [id]);
    return result.rows[0];
  },

  createClient: async ({ nombre, cedula, email, telefono, eps, rh, plan_id, vence, estado }) => {
    const result = await db.query(
      `INSERT INTO clientes (cedula, nombre, email, telefono, eps, rh, plan_id, vence, estado) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [cedula, nombre, email, telefono, eps, rh, plan_id, vence, estado]
    );
    return result.rows[0];
  },

  updateClient: async (id, fields) => {
    // Permitir actualización de campos específicos
    const allowedFields = ['nombre', 'cedula', 'email', 'telefono', 'eps', 'rh', 'plan_id', 'vence', 'inicio', 'estado'];
    const keys = Object.keys(fields).filter(key => allowedFields.includes(key));
    
    if (keys.length === 0) {
      throw new Error('No valid fields to update');
    }

    const values = keys.map(key => fields[key]);
    const setQuery = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

    const result = await db.query(
      `UPDATE clientes SET ${setQuery} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    return result.rows[0];
  },

  deleteClient: async (id) => {
    const result = await db.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};
