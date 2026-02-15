const db = require('../../config/db');

const getSummary = async () => {
  const totalClients = await db.query(
    'SELECT COUNT(*) FROM clients'
  );

  const activeMemberships = await db.query(
    `SELECT COUNT(*) FROM clients
     WHERE plan_id IS NOT NULL
     AND end_date >= CURRENT_DATE`
  );

  const expiredMemberships = await db.query(
    `SELECT COUNT(*) FROM clients
     WHERE plan_id IS NOT NULL
     AND end_date < CURRENT_DATE`
  );

  const todayEntries = await db.query(
    `SELECT COUNT(*) FROM attendance
     WHERE DATE(entry_time) = CURRENT_DATE`
  );

  return {
    total_clients: Number(totalClients.rows[0].count),
    active_memberships: Number(activeMemberships.rows[0].count),
    expired_memberships: Number(expiredMemberships.rows[0].count),
    today_entries: Number(todayEntries.rows[0].count)
  };
};

module.exports = { getSummary };
