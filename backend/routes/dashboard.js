const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { getStats, getProducts, createProduct } = require('../controllers/dashboardController');

router.get('/stats', authMiddleware, getStats);
router.get('/products', authMiddleware, getProducts);
router.post('/products', authMiddleware, adminMiddleware, createProduct);

module.exports = router;