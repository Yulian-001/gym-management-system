const { Parser } = require('json2csv');
const ExportsService = require('./exports.service');

const sendCSV = (res, data, filename) => {
  const parser = new Parser();
  const csv = parser.parse(data);

  res.header('Content-Type', 'text/csv');
  res.attachment(filename);
  res.send(csv);
};

module.exports = {
  clients: async (req, res) => {
    try {
      const data = await ExportsService.getClients();
      sendCSV(res, data, 'clients.csv');
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  activeMemberships: async (req, res) => {
    try {
      const data = await ExportsService.getActiveMemberships();
      sendCSV(res, data, 'memberships_active.csv');
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  expiredMemberships: async (req, res) => {
    try {
      const data = await ExportsService.getExpiredMemberships();
      sendCSV(res, data, 'memberships_expired.csv');
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  attendance: async (req, res) => {
    try {
      const data = await ExportsService.getAttendance();
      sendCSV(res, data, 'attendance.csv');
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
