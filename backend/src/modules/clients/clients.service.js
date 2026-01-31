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
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  checkMembershipStatus
};
