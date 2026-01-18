const express = require('express');
const router = express.Router();
const PlansController = require('./plans.controller');

router.get('/', PlansController.getPlans);
router.post('/', PlansController.createPlan);

module.exports = router;
