const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// All routes require authentication
router.use(authMiddleware);

// Get all users (admin only)
router.get('/', adminMiddleware, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, username, email, role, avatar, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single user
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Users can only access their own data unless they're admin
        if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const [users] = await db.query(
            'SELECT id, username, email, role, avatar, created_at FROM users WHERE id = ?',
            [id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(users[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new user (admin only)
router.post('/', adminMiddleware, async (req, res) => {
    try {
        const { username, email, password, role = 'user' } = req.body;
        
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Check if user exists
        const [existing] = await db.query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, username]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, role, created_by) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, role, req.user.id]
        );
        
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: result.insertId,
                username,
                email,
                role
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;
        
        // Users can only update their own data unless they're admin
        if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Update user
        await db.query(
            'UPDATE users SET username = ?, email = ? WHERE id = ?',
            [username, email, id]
        );
        
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user (admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Don't allow deleting yourself
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }
        
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Delete user
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Change password
router.put('/:id/password', async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        
        // Users can only change their own password unless they're admin
        if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update password
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
        
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;