const express = require('express');
const { loginUser, protectedRoute } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginUser);
router.get('/protected', protectedRoute);

module.exports = router;
