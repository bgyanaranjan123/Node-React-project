const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixAdminPassword() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '12345', // Change this to your MySQL password
            database: 'dashboard_db'
        });

        console.log('🔧 Fixing admin password...');
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@123', salt);
        
        // Update the admin user with hashed password
        const [result] = await connection.execute(
            'UPDATE users SET password = ?, email = ? WHERE username = ?',
            [hashedPassword, 'admin@dashboard.com', 'admin']
        );
        
        if (result.affectedRows > 0) {
            console.log('✅ Admin password fixed successfully!');
            console.log('\n📧 New login credentials:');
            console.log('   Email: admin@dashboard.com');
            console.log('   Password: Admin@123');
        } else {
            console.log('❌ Admin user not found. Creating new one...');
            
            // Insert new admin user
            await connection.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                ['admin', 'admin@dashboard.com', hashedPassword, 'admin']
            );
            console.log('✅ New admin user created!');
        }
        
        // Verify the update
        const [users] = await connection.execute(
            'SELECT id, username, email, role FROM users WHERE username = ?',
            ['admin']
        );
        
        if (users.length > 0) {
            console.log('\n📊 User verification:');
            console.log(`   ID: ${users[0].id}`);
            console.log(`   Username: ${users[0].username}`);
            console.log(`   Email: ${users[0].email}`);
            console.log(`   Role: ${users[0].role}`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

fixAdminPassword();