const fs = require('fs');
const path = require('path');

console.log('🔍 Checking backend structure...\n');

// Check current directory
console.log('Current directory:', __dirname);
console.log('\nFiles in backend:');
fs.readdirSync(__dirname).forEach(file => {
    console.log(`  - ${file}`);
});

// Check routes folder
const routesPath = path.join(__dirname, 'routes');
if (fs.existsSync(routesPath)) {
    console.log('\n📁 Routes folder exists');
    console.log('Files in routes:');
    fs.readdirSync(routesPath).forEach(file => {
        console.log(`  - ${file}`);
    });
} else {
    console.log('\n❌ Routes folder does NOT exist!');
}

// Check if users.js exists in routes
const usersPath = path.join(routesPath, 'users.js');
if (fs.existsSync(usersPath)) {
    console.log('\n✅ users.js exists');
} else {
    console.log('\n❌ users.js does NOT exist in routes folder!');
}

console.log('\n💡 Solution:');
console.log('1. Create the routes folder if it doesn\'t exist');
console.log('2. Create users.js in the routes folder with the code provided');
console.log('3. Make sure your server.js has: const userRoutes = require(\'./routes/users\');');