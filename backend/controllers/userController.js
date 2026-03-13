const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, username, email, role, avatar, created_at, last_login FROM users ORDER BY created_at DESC'
        );
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [users] = await db.query(
            'SELECT id, username, email, role, avatar, created_at, last_login FROM users WHERE id = ?',
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
};

// Create new user (admin only)
const createUser = async (req, res) => {
    try {
        const { username, email, password, role = 'user' } = req.body;
        const createdBy = req.user.id; // ID of admin creating the user
        
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
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT) || 10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, role, created_by) VALUES (?, ?, ?, ?, ?)',
            [username, email, hashedPassword, role, createdBy]
        );
        
        // Log the activity
        await db.query(
            'INSERT INTO user_activity_log (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [
                createdBy,
                'CREATE_USER',
                JSON.stringify({ new_user_id: result.insertId, username, email, role }),
                req.ip
            ]
        );
        
        // Get the created user
        const [newUser] = await db.query(
            'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json({
            message: 'User created successfully',
            user: newUser[0]
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role } = req.body;
        
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Update user
        await db.query(
            'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
            [username, email, role, id]
        );
        
        // Log activity
        await db.query(
            'INSERT INTO user_activity_log (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [req.user.id, 'UPDATE_USER', JSON.stringify({ user_id: id }), req.ip]
        );
        
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Don't allow deleting yourself
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }
        
        // Log activity before deletion
        await db.query(
            'INSERT INTO user_activity_log (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [req.user.id, 'DELETE_USER', JSON.stringify({ deleted_user_id: id }), req.ip]
        );
        
        // Delete user
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Change user password
const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT) || 10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update password
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
        
        // Log activity
        await db.query(
            'INSERT INTO user_activity_log (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [req.user.id, 'CHANGE_PASSWORD', JSON.stringify({ user_id: id }), req.ip]
        );
        
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user activity log (admin only)
const getUserActivity = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [logs] = await db.query(
            `SELECT l.*, u.username 
             FROM user_activity_log l
             JOIN users u ON l.user_id = u.id
             WHERE l.user_id = ? 
             ORDER BY l.created_at DESC 
             LIMIT 50`,
            [id]
        );
        
        res.json(logs);
    } catch (error) {
        console.error('Error fetching activity:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    getUserActivity
};