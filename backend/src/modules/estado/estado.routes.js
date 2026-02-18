const express = require('express');
const router = express.Router();
const estadoController = require('./estado.controller');

// Rutas
router.get('/congelados', estadoController.getClientesCongelados);
router.get('/descongelados', estadoController.getClientesDescongelados);
router.get('/total-congelados', estadoController.getTotalClientesCongelados);
router.get('/buscar', estadoController.buscarCliente);
router.post('/congelar', estadoController.congelarCliente);
router.post('/descongelar', estadoController.descongelarCliente);

module.exports = router;
