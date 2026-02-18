const express = require('express');
const router = express.Router();
const AsistenciaController = require('./asistencia.controller');

router.post('/', AsistenciaController.createAsistencia);
router.get('/counts', AsistenciaController.getCounts);

module.exports = router;
