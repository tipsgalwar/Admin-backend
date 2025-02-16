const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

// Get all registrations
router.get('/', registrationController.getRegistrations);

// Add a new registration
router.post('/', registrationController.addRegistration);

module.exports = router;