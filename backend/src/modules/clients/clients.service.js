const db = require('../../config/db');

const getAllClients = async () => {
  const result = await db.query('SELECT * FROM clients ORDER BY id');
  return result.rows;
};

const getClientById = async (id) => {
  const result = await db.query(
    'SELECT * FROM clients WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const createClient = async (client) => {
  const { name, email, phone, plan_id, start_date, end_date } = client;

  const result = await db.query(
    `INSERT INTO clients 
     (name, email, phone, plan_id, start_date, end_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, email, phone, plan_id, start_date, end_date]
  );

  return result.rows[0];
};

const updateClient = async (id, data) => {
  const { name, email, phone, plan_id, start_date, end_date } = data;

  const result = await db.query(
    `UPDATE clients
     SET name=$1, email=$2, phone=$3, plan_id=$4, start_date=$5, end_date=$6
     WHERE id=$7
     RETURNING *`,
    [name, email, phone, plan_id, start_date, end_date, id]
  );

  return result.rows[0];
};

const deleteClient = async (id) => {
  const result = await db.query(
    'DELETE FROM clients WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
};

const checkMembershipStatus = async (id) => {
  const result = await db.query(
    'SELECT id, plan_id, end_date FROM clients WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

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
    const allowedFields = ['nombre', 'cedula', 'email', 'telefono', 'eps', 'rh', 'plan_id', 'vence', 'estado'];
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
