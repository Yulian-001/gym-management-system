const express = require('express');
const SalesController = require('./sales.controller');
const router = express.Router();

router.get('/', SalesController.getSales);
router.get('/:id', SalesController.getSale);
router.post('/', SalesController.createSale);
router.put('/:id', SalesController.updateSale);
router.delete('/:id', SalesController.deleteSale);

module.exports = router;
