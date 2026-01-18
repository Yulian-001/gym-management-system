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
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
      }

      const newPlan = await PlansService.createPlan(name, duration_days, price);
      res.status(201).json(newPlan);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
