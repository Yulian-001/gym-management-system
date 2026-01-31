const AttendanceService = require('./attendance.service');
const ClientsService = require('../clients/clients.service');

module.exports = {
  /**
   * Registrar ingreso
   */
  register: async (req, res) => {
    try {
      const { client_id } = req.body;

      const client = await ClientsService.checkMembershipStatus(client_id);

      if (!client || !client.plan_id || new Date(client.end_date) < new Date()) {
        return res.status(403).json({
          error: 'Membresía inactiva o vencida'
        });
      }

      const entry = await AttendanceService.registerAttendance(client_id);

      res.status(201).json({
        message: 'Ingreso registrado',
        entry
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * Listar asistencia (con filtros opcionales)
   * GET /Api/attendance?from=YYYY-MM-DD&to=YYYY-MM-DD
   */
  list: async (req, res) => {
    try {
      const { from, to } = req.query;
      const data = await AttendanceService.getAttendance(from, to);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
