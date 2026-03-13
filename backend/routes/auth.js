const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Make sure these controller functions exist and are properly exported
router.post('/register', register);
router.post('/login', login);

module.exports = router;