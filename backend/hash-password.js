const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function hashAdminPassword() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '12345',
            database: process.env.DB_NAME || 'dashboard_db'
        });

        console.log('🔐 Generating hashed password for admin...');
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        console.log('Hashed password:', hashedPassword);
        
        // Delete existing admin if any
        await connection.execute('DELETE FROM users WHERE username = ?', ['admin']);
        
        // Insert admin with hashed password
        await connection.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['admin', 'admin@dashboard.com', hashedPassword, 'admin']
        );
        
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@dashboard.com');
        console.log('🔑 Password: admin123');
        console.log('🔒 Hashed: ' + hashedPassword);
        
        // Verify the user was created
        const [users] = await connection.execute(
            'SELECT id, username, email, role FROM users WHERE username = ?',
            ['admin']
        );
        
        if (users.length > 0) {
            console.log('\n✅ Verification:');
            console.log('   ID:', users[0].id);
            console.log('   Username:', users[0].username);
            console.log('   Email:', users[0].email);
            console.log('   Role:', users[0].role);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

hashAdminPassword();