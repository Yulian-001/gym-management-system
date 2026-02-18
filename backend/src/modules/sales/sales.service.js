const db = require('../../config/db');

module.exports = {
  getAllSales: async () => {
    const result = await db.query('SELECT * FROM ventas ORDER BY id ASC');
    return result.rows;
  },

  getSaleById: async (id) => {
    const result = await db.query('SELECT * FROM ventas WHERE id = $1', [id]);
    return result.rows[0];
  },

  createSale: async ({ cliente_id, plan_id, empleado_id, fecha_venta, descripcion, cantidad, precio_unitario, monto, metodo_pago, estado }) => {
    const result = await db.query(
      `INSERT INTO ventas (cliente_id, plan_id, empleado_id, fecha_venta, descripcion, cantidad, precio_unitario, monto, total, metodo_pago, estado, hora_venta) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9, $10, CURRENT_TIME)
       RETURNING *`,
      [cliente_id, plan_id, empleado_id, fecha_venta, descripcion, cantidad, precio_unitario, monto, metodo_pago, estado]
    );
    return result.rows[0];
  },

  updateSale: async (id, fields) => {
    const allowedFields = ['cliente_id', 'plan_id', 'empleado_id', 'fecha_venta', 'descripcion', 'cantidad', 'precio_unitario', 'monto', 'metodo_pago', 'estado', 'hora_venta'];
    const keys = Object.keys(fields).filter(key => allowedFields.includes(key));
    
    if (keys.length === 0) {
      throw new Error('No valid fields to update');
    }

    const values = keys.map(key => fields[key]);
    const setQuery = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

    const result = await db.query(
      `UPDATE ventas SET ${setQuery} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    return result.rows[0];
  },

  deleteSale: async (id) => {
    const result = await db.query('DELETE FROM ventas WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};
