const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNOSING REACT APP\n');

// Check if node_modules exists
if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('✅ node_modules exists');
} else {
    console.log('❌ node_modules missing - run npm install');
}

// Check package.json
try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    console.log('✅ package.json found');
    
    // Check key dependencies
    const deps = ['react', 'react-dom', 'react-scripts', '@mui/material', 'react-router-dom'];
    deps.forEach(dep => {
        if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) {
            console.log(`  ✅ ${dep} installed`);
        } else {
            console.log(`  ❌ ${dep} missing - npm install ${dep}`);
        }
    });
} catch (err) {
    console.log('❌ Error reading package.json');
}

// Check src folder
const srcPath = path.join(__dirname, 'src');
if (fs.existsSync(srcPath)) {
    console.log('\n✅ src folder exists');
    
    // Check index.js
    if (fs.existsSync(path.join(srcPath, 'index.js'))) {
        console.log('  ✅ index.js exists');
    } else {
        console.log('  ❌ index.js missing');
    }
    
    // Check App.js
    if (fs.existsSync(path.join(srcPath, 'App.js'))) {
        console.log('  ✅ App.js exists');
    } else {
        console.log('  ❌ App.js missing');
    }
} else {
    console.log('❌ src folder missing');
}

console.log('\n📋 Next steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm start');
console.log('3. If it still fails, check for syntax errors in your components');