const db = require('../../config/db');

const getClients = async () => {
  const { rows } = await db.query(
    `SELECT id, name, email, phone, plan_id, start_date, end_date, created_at
     FROM clients
     ORDER BY id`
  );
  return rows;
};

const getActiveMemberships = async () => {
  const { rows } = await db.query(
    `SELECT id, name, email, phone, plan_id, start_date, end_date
     FROM clients
     WHERE plan_id IS NOT NULL AND end_date >= CURRENT_DATE
     ORDER BY end_date`
  );
  return rows;
};

const getExpiredMemberships = async () => {
  const { rows } = await db.query(
    `SELECT id, name, email, phone, plan_id, start_date, end_date
     FROM clients
     WHERE plan_id IS NOT NULL AND end_date < CURRENT_DATE
     ORDER BY end_date`
  );
  return rows;
};

const getAttendance = async () => {
  const { rows } = await db.query(
    `SELECT a.id, a.client_id, c.name, a.entry_time
     FROM attendance a
     JOIN clients c ON c.id = a.client_id
     ORDER BY a.entry_time DESC`
  );
  return rows;
};

module.exports = {
  getClients,
  getActiveMemberships,
  getExpiredMemberships,
  getAttendance
};
