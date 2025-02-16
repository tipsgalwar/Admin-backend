const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');

// Get all results
router.get('/', resultController.getResults);

// Add a new result
router.post('/', resultController.addResult);

module.exports = router;