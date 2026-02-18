const express = require('express');
const router = express.Router();
const entradaController = require('./entradaDia.controller');

// Rutas CRUD
router.get('/', entradaController.getAllEntradas);
router.get('/:id', entradaController.getEntradaById);
router.post('/', entradaController.createEntrada);
router.put('/:id', entradaController.updateEntrada);
router.delete('/:id', entradaController.deleteEntrada);

module.exports = router;
