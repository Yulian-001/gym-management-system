const db = require('../../config/db');

module.exports = {
  getAllPlans: async () => {
    const result = await db.query('SELECT * FROM plans ORDER BY id ASC');
    return result.rows;
  },

  createPlan: async (name, duration_days, price) => {
    const result = await db.query(
      'INSERT INTO plans (name, duration_days, price) VALUES ($1, $2, $3) RETURNING *',
      [name, duration_days, price]
    );
    return result.rows[0];
  }
};
