const db = require('../config/db');

const getStats = async (req, res) => {
    try {
        // Get total users
        const [users] = await db.query('SELECT COUNT(*) as total FROM users');
        
        // Get total products
        const [products] = await db.query('SELECT COUNT(*) as total FROM products');
        
        // Get total orders
        const [orders] = await db.query('SELECT COUNT(*) as total, SUM(total_amount) as revenue FROM orders WHERE status = "completed"');
        
        // Get recent analytics
        const [analytics] = await db.query('SELECT * FROM analytics ORDER BY date DESC LIMIT 7');
        
        res.json({
            totalUsers: users[0].total,
            totalProducts: products[0].total,
            totalOrders: orders[0].total || 0,
            totalRevenue: orders[0].revenue || 0,
            analytics
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getProducts = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, image_url } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, stock, category, image_url]
        );
        
        res.status(201).json({
            id: result.insertId,
            name,
            description,
            price,
            stock,
            category,
            image_url
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getStats, getProducts, createProduct };