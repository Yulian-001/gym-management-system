const db = require('../../config/db');

module.exports = {
  getAllSales: async (empleado_id = null, rol = null) => {
    if (rol === 'recepcionista' && empleado_id) {
      const result = await db.query(`
        SELECT * FROM ventas 
        WHERE empleado_id = $1 AND estado NOT IN ('archivada')
        ORDER BY id ASC
      `, [empleado_id]);
      return result.rows;
    }
      //? Admins y gerentes ven todas las no archivadas
    const result = await db.query(`
      SELECT * FROM ventas 
      WHERE estado NOT IN ('archivada')
      ORDER BY id ASC
    `);
    return result.rows;
  },

  getSaleById: async (id) => {
    const result = await db.query('SELECT * FROM ventas WHERE id = $1', [id]);
    return result.rows[0];
  },

  createSale: async ({ cliente_id, plan_id, empleado_id, fecha_venta, descripcion, cantidad, precio_unitario, monto, metodo_pago, estado, evento, evento_precio }) => {
    try {
      const montoFinal = parseFloat(monto) || (parseFloat(cantidad || 1) * parseFloat(precio_unitario || 0));
      const cantidadFinal = parseInt(cantidad) || 1;
      const precioFinal = parseFloat(precio_unitario) || montoFinal;

      const result = await db.query(
        `INSERT INTO ventas 
          (cliente_id, plan_id, empleado_id, fecha_venta, descripcion, 
           cantidad, precio_unitario, total, monto, 
           metodo_pago, estado, hora_venta, evento, evento_precio) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9, $10, CURRENT_TIME, $11, $12)
         RETURNING *`,
        [
          cliente_id || null,
          plan_id || null,
          empleado_id || 1,
          fecha_venta,
          descripcion,
          cantidadFinal,
          precioFinal,
          montoFinal,
          metodo_pago || 'efectivo',
          estado || 'completada',
          evento || null,
          evento_precio || null
        ]
      );
      
      const venta = result.rows[0];
      console.log('Venta insertada correctamente, ID:', venta.id);
      return venta;
    } catch (error) {
      console.error('Error en createSale:', error.message);
      throw error;
    }
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
