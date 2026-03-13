const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function createAdmin() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345', // your MySQL password
        database: 'dashboard_db'
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);
    
    console.log('Hashed password:', hashedPassword);
    
    // Delete old admin
    await connection.execute('DELETE FROM users WHERE username = ?', ['admin']);
    
    // Insert new admin with hashed password
    await connection.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@dashboard.com', hashedPassword, 'admin']
    );
    
    console.log('Admin user created successfully!');
    console.log('Email: admin@dashboard.com');
    console.log('Password: Admin@123');
    
    await connection.end();
}

createAdmin().catch(console.error);