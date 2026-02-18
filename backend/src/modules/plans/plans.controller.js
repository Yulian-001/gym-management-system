const PlansService = require('./plans.service');

module.exports = {
  getPlans: async (req, res) => {
    try {
      const plans = await PlansService.getAllPlans();
      res.json(plans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createPlan: async (req, res) => {
    try {
      const { name, duration_days, price } = req.body;

      if (!name || !duration_days || !price) {
        return res.status(400).json({ error: 'Faltan datos obligatorios: name, duration_days, price' });
      }

      const newPlan = await PlansService.createPlan(
        name,
        duration_days,
        price
      );
      res.status(201).json(newPlan);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deletePlan: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'ID del plan es requerido' });
      }

      const deletedPlan = await PlansService.deletePlan(id);
      
      if (!deletedPlan) {
        return res.status(404).json({ error: 'Plan no encontrado' });
      }

      res.json({ message: 'Plan eliminado exitosamente', plan: deletedPlan });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
