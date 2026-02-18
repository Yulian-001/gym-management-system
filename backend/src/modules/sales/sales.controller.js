const SalesService = require('./sales.service');

module.exports = {
  getSales: async (req, res) => {
    try {
      const sales = await SalesService.getAllSales();
      res.json(sales);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getSale: async (req, res) => {
    try {
      const sale = await SalesService.getSaleById(req.params.id);
      if (!sale) return res.status(404).json({ error: 'Venta no encontrada' });
      res.json(sale);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createSale: async (req, res) => {
    try {
      const { cliente_id, plan_id, empleado_id, fecha_venta, descripcion, cantidad, precio_unitario, metodo_pago, estado } = req.body;

      // Validaciones
      if (!fecha_venta) return res.status(400).json({ error: 'La fecha es obligatoria' });
      if (!descripcion) return res.status(400).json({ error: 'La descripción es obligatoria' });
      if (!cantidad || cantidad <= 0) return res.status(400).json({ error: 'Cantidad inválida' });
      if (!precio_unitario || precio_unitario <= 0) return res.status(400).json({ error: 'Precio inválido' });

      // Calcular monto
      const monto = (cantidad * precio_unitario).toFixed(2);

      const newSale = await SalesService.createSale({
        cliente_id: cliente_id || null,
        plan_id: plan_id || null,
        empleado_id: empleado_id || 1,
        fecha_venta,
        descripcion,
        cantidad,
        precio_unitario,
        monto,
        metodo_pago: metodo_pago || 'efectivo',
        estado: estado || 'completada'
      });

      res.status(201).json(newSale);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateSale: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedSale = await SalesService.updateSale(id, req.body);
      res.json(updatedSale);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteSale: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedSale = await SalesService.deleteSale(id);
      res.json(deletedSale);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
