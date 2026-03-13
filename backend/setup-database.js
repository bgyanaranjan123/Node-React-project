const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupDatabase() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '12345',
            database: process.env.DB_NAME || 'dashboard_db'
        });

        console.log('🚀 Starting database setup...\n');

        // 1. Add missing columns to users table
        console.log('📝 Updating users table...');
        try {
            await connection.execute(`
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL,
                ADD COLUMN IF NOT EXISTS created_by INT NULL
            `);
            console.log('✅ Users table updated');
        } catch (err) {
            console.log('⚠️  Columns might already exist:', err.message);
        }

        // 2. Create user activity log table
        console.log('\n📝 Creating user_activity_log table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS user_activity_log (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT,
                action VARCHAR(100),
                details JSON,
                ip_address VARCHAR(45),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
                INDEX idx_user_id (user_id),
                INDEX idx_created_at (created_at)
            )
        `);
        console.log('✅ User activity log table created');

        // 3. Add foreign key for created_by
        try {
            await connection.execute(`
                ALTER TABLE users 
                ADD FOREIGN KEY IF NOT EXISTS (created_by) REFERENCES users(id)
            `);
        } catch (err) {
            console.log('⚠️  Foreign key might already exist');
        }

        // 4. Create admin user with hashed password
        console.log('\n🔐 Setting up admin user...');
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        // Delete existing admin
        await connection.execute('DELETE FROM users WHERE username = ?', ['admin']);
        
        // Insert admin with hashed password
        await connection.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            ['admin', 'admin@dashboard.com', hashedPassword, 'admin']
        );
        
        console.log('✅ Admin user created/updated');
        console.log('   Email: admin@dashboard.com');
        console.log('   Password: admin123');

        // 5. Insert sample products if none exist
        console.log('\n📦 Checking products...');
        const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
        
        if (products[0].count === 0) {
            console.log('Adding sample products...');
            await connection.execute(`
                INSERT INTO products (name, description, price, stock, category, image_url) VALUES
                ('iPhone 15 Pro', 'Latest Apple iPhone with A17 Pro chip', 1299.99, 50, 'Electronics', 'https://via.placeholder.com/150'),
                ('MacBook Pro 16', 'Apple M3 Max chip, 32GB RAM', 2499.99, 25, 'Electronics', 'https://via.placeholder.com/150'),
                ('Wireless Headphones', 'Noise cancelling Bluetooth headphones', 199.99, 100, 'Audio', 'https://via.placeholder.com/150'),
                ('Smart Watch', 'Fitness tracker with heart rate monitor', 299.99, 75, 'Wearables', 'https://via.placeholder.com/150'),
                ('4K Monitor', '32-inch 4K UHD display', 499.99, 30, 'Electronics', 'https://via.placeholder.com/150')
            `);
            console.log('✅ Sample products added');
        } else {
            console.log('✅ Products already exist');
        }

        // 6. Insert sample analytics if none exist
        console.log('\n📊 Checking analytics...');
        const [analytics] = await connection.execute('SELECT COUNT(*) as count FROM analytics');
        
        if (analytics[0].count === 0) {
            console.log('Adding sample analytics...');
            await connection.execute(`
                INSERT INTO analytics (date, visitors, page_views, sales, revenue) VALUES
                (CURDATE(), 1250, 3500, 45, 12500.00),
                (DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1100, 3200, 38, 9800.00)
            `);
            console.log('✅ Sample analytics added');
        } else {
            console.log('✅ Analytics already exist');
        }

        console.log('\n✨ Database setup complete!');
        console.log('\n📋 Summary:');
        console.log('   - Users table: updated');
        console.log('   - User activity log: created');
        console.log('   - Admin user: configured');
        console.log('   - Sample products: checked');
        console.log('   - Sample analytics: checked');
        
    } catch (error) {
        console.error('❌ Setup failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

setupDatabase();