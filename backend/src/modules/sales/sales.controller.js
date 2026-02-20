const SalesService = require('./sales.service');

module.exports = {
  getSales: async (req, res) => {
    try {
      const { empleado_id, rol } = req.query;
      const sales = await SalesService.getAllSales(
        empleado_id ? parseInt(empleado_id) : null,
        rol || null
      );
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
      console.log('📨 POST /Api/sales recibido con body:', req.body);
      
      const { cliente_id, plan_id, empleado_id, fecha_venta, descripcion, 
              monto, cantidad, precio_unitario, metodo_pago, estado, evento, evento_precio } = req.body;

      // Validaciones
      if (!fecha_venta) {
        return res.status(400).json({ error: 'La fecha es obligatoria' });
      }
      if (!descripcion || descripcion.trim() === '') {
        return res.status(400).json({ error: 'La descripción es obligatoria' });
      }

      // Calcular monto: puede venir directo o calcularse de cantidad * precio_unitario
      let montoFinal = null;
      if (monto && parseFloat(monto) > 0) {
        montoFinal = parseFloat(monto);
      } else if (cantidad && precio_unitario && parseFloat(precio_unitario) > 0) {
        montoFinal = parseFloat(cantidad) * parseFloat(precio_unitario);
      }

      if (!montoFinal || montoFinal <= 0) {
        return res.status(400).json({ error: 'Monto inválido' });
      }

      const cantidadFinal = parseInt(cantidad) || 1;
      const precioFinal = parseFloat(precio_unitario) || montoFinal;

      // Validar estado
      const estadosValidos = ['pendiente', 'pagado', 'cancelado', 'completada', 'archivada', 'cancelada'];
      const estadoFinal = estado && estadosValidos.includes(estado) ? estado : 'completada';

      const newSale = await SalesService.createSale({
        cliente_id: cliente_id || null,
        plan_id: plan_id || null,
        empleado_id: empleado_id || 1,
        fecha_venta,
        descripcion: descripcion.trim(),
        cantidad: cantidadFinal,
        precio_unitario: precioFinal,
        monto: montoFinal,
        metodo_pago: metodo_pago || 'efectivo',
        estado: estadoFinal,
        evento: evento || null,
        evento_precio: evento_precio ? parseFloat(evento_precio) : null
      });

      console.log('✅ Venta creada exitosamente:', newSale.id);

      res.status(201).json({
        success: true,
        message: '✅ Venta creada exitosamente',
        data: newSale
      });
    } catch (err) {
      console.error('❌ Error en createSale:', err.message);
      res.status(500).json({ 
        success: false,
        error: err.message 
      });
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
