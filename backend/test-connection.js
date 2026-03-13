const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testEverything() {
    console.log('🔍 Testing Configuration...\n');
    
    // 1. Check Environment Variables
    console.log('📁 Environment Variables:');
    console.log(`   PORT: ${process.env.PORT}`);
    console.log(`   DB_HOST: ${process.env.DB_HOST}`);
    console.log(`   DB_USER: ${process.env.DB_USER}`);
    console.log(`   DB_NAME: ${process.env.DB_NAME}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
    console.log(`   JWT_EXPIRE: ${process.env.JWT_EXPIRE}`);
    console.log('');

    // 2. Test Database Connection
    try {
        console.log('🛢️  Testing Database Connection...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log('   ✅ Database connected successfully!');
        
        // Check if users table exists
        const [tables] = await connection.query('SHOW TABLES LIKE "users"');
        if (tables.length > 0) {
            console.log('   ✅ Users table exists');
            
            // Check if admin user exists
            const [users] = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@dashboard.com']);
            if (users.length > 0) {
                console.log('   ✅ Admin user exists');
            } else {
                console.log('   ❌ Admin user not found. Creating...');
                // Create admin user
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('Admin@123', salt);
                await connection.execute(
                    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                    ['admin', 'admin@dashboard.com', hashedPassword, 'admin']
                );
                console.log('   ✅ Admin user created!');
            }
        } else {
            console.log('   ❌ Users table not found. Please run database setup.');
        }
        
        await connection.end();
    } catch (error) {
        console.log('   ❌ Database connection failed:', error.message);
        console.log('\n💡 Tips:');
        console.log('   1. Make sure MySQL is running');
        console.log('   2. Check your MySQL password in .env');
        console.log('   3. Create the database first');
    }
    console.log('');

    // 3. Test JWT
    try {
        console.log('🔑 Testing JWT...');
        const token = jwt.sign(
            { id: 1, username: 'test', role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log('   ✅ JWT Signing works');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('   ✅ JWT Verification works');
    } catch (error) {
        console.log('   ❌ JWT test failed:', error.message);
    }
    console.log('');

    console.log('✅ Test complete!');
}

testEverything();