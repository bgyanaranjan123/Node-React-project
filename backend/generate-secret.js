const crypto = require('crypto');

// Generate a 64-character random hex string
const secret = crypto.randomBytes(32).toString('hex');
console.log('Your JWT Secret Key:');
console.log(secret);
console.log('\nCopy this and add it to your .env file as:');
console.log(`JWT_SECRET=${secret}`);