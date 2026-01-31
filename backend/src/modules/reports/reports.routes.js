const express = require('express');
const router = express.Router();
const ReportsController = require('./reports.controller');
const auth = require('../auth/auth.middleware');

router.get('/summary', auth, ReportsController.summary);

module.exports = router;
