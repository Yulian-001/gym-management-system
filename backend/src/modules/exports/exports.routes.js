const express = require('express');
const router = express.Router();
const ExportsController = require('./exports.controller');
const auth = require('../auth/auth.middleware');

router.get('/clients', auth, ExportsController.clients);
router.get('/memberships/active', auth, ExportsController.activeMemberships);
router.get('/memberships/expired', auth, ExportsController.expiredMemberships);
router.get('/attendance', auth, ExportsController.attendance);

module.exports = router;
