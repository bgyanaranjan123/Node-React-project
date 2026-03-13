const mysql = require('mysql2/promise');

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '12345', // Change this to your password
            database: 'dashboard_db'
        });
        
        console.log('✅ Connected to MySQL successfully!');
        
        // Test query
        const [rows] = await connection.execute('SELECT * FROM users');
        console.log(`📊 Found ${rows.length} users in database`);
        
        if (rows.length > 0) {
            console.log('\n👤 Users:');
            rows.forEach(user => {
                console.log(`   - ${user.username} (${user.email}) - Role: ${user.role}`);
            });
        }
        
        await connection.end();
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('\n💡 Troubleshooting tips:');
        console.log('1. Make sure MySQL is running');
        console.log('2. Check if password is correct (trying with "12345")');
        console.log('3. Try with empty password: ""');
        console.log('4. Make sure database "dashboard_db" exists');
    }
}

testConnection();