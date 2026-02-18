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
      const { nombre, cedula, email, telefono, eps, rh, plan_id, inicio, vence, estado } = req.body;

      // Validaciones
      if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
      if (!cedula) return res.status(400).json({ error: 'La cédula es obligatoria' });
      if (!telefono) return res.status(400).json({ error: 'El teléfono es obligatorio' });

      // Crear cliente con los datos completos
      const newClient = await ClientsService.createClient({
        nombre,
        cedula,
        email: email || '',
        telefono,
        eps: eps || 'Capital Salud',
        rh: rh || 'O+',
        plan_id: plan_id || 1,
        inicio: inicio || new Date().toISOString().split('T')[0],
        vence: vence || null,
        estado: estado || 'activo'
      });

      res.status(201).json(newClient);
    } catch (err) {
      console.error('Error creating client:', err);
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
