const ClientsService = require('./clients.service');
const db = require('../../config/db');

module.exports = {
  getClients: async (req, res) => {
    try {
      const clients = await ClientsService.getAllClients();
      res.json(clients);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getClient: async (req, res) => {
    try {
      const client = await ClientsService.getClientById(req.params.id);
      if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
      res.json(client);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createClient: async (req, res) => {
    try {
      const { name, email, phone, plan_id } = req.body;

      if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });

      let start_date = null;
      let end_date = null;

      // Si asigna un plan, calculamos fechas
      if (plan_id) {
        const plan = await db.query('SELECT duration_days FROM plans WHERE id = $1', [plan_id]);

        if (plan.rows.length === 0) {
          return res.status(400).json({ error: 'El plan no existe' });
        }

        const duration = plan.rows[0].duration_days;

        start_date = new Date();
        end_date = new Date();
        end_date.setDate(end_date.getDate() + duration);
      }

      const newClient = await ClientsService.createClient({
        name,
        email,
        phone,
        plan_id,
        start_date,
        end_date
      });

      res.status(201).json(newClient);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateClient: async (req, res) => {
    try {
      const updated = await ClientsService.updateClient(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Cliente no encontrado' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteClient: async (req, res) => {
    try {
      const deleted = await ClientsService.deleteClient(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Cliente no encontrado' });
      res.json({ message: 'Cliente eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
