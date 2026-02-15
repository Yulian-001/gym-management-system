const ReportsService = require('./reports.service');

module.exports = {
  summary: async (req, res) => {
    try {
      const data = await ReportsService.getSummary();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
