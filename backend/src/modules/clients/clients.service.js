const db = require('../../config/db');

module.exports = {
  getAllClients: async () => {
    const result = await db.query('SELECT * FROM clients ORDER BY id ASC');
    return result.rows;
  },

  getClientById: async (id) => {
    const result = await db.query('SELECT * FROM clients WHERE id = $1', [id]);
    return result.rows[0];
  },

  createClient: async ({ name, email, phone, plan_id, start_date, end_date }) => {
    const result = await db.query(
      `INSERT INTO clients (name, email, phone, plan_id, start_date, end_date) 
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, email, phone, plan_id, start_date, end_date]
    );
    return result.rows[0];
  },

  updateClient: async (id, fields) => {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setQuery = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

    const result = await db.query(
      `UPDATE clients SET ${setQuery} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    return result.rows[0];
  },

  deleteClient: async (id) => {
    const result = await db.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};
