const express = require('express');
const router = express.Router();
const AttendanceController = require('./attendance.controller');
const auth = require('../auth/auth.middleware');

// Registrar ingreso
router.post('/', auth, AttendanceController.register);

// Listar asistencia (con filtros)
router.get('/', auth, AttendanceController.list);

module.exports = router;
