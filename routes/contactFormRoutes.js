const express = require('express');
const router = express.Router();
const contactFormController = require('../controllers/contactFormController');

// Get all inquiries
router.get('/', contactFormController.getInquiries);

// Add a new inquiry
router.post('/', contactFormController.addInquiry);

module.exports = router;