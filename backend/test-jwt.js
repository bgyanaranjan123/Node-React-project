// test-jwt.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const payload = { userId: 1, username: 'test' };

// Sign a token
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log('Generated Token:', token);

// Verify the token
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Verified Token:', decoded);
    console.log('✅ JWT_SECRET is working correctly!');
} catch (error) {
    console.log('❌ JWT_SECVER failed:', error.message);
}