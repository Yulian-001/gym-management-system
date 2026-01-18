const express = require('express');
const router = express.Router();
const ClientsController = require('./clients.controller');

router.get('/', ClientsController.getClients);
router.get('/:id', ClientsController.getClient);
router.post('/', ClientsController.createClient);
router.put('/:id', ClientsController.updateClient);
router.delete('/:id', ClientsController.deleteClient);

module.exports = router;
