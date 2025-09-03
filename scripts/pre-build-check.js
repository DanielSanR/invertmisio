const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Running pre-build checks...\n');

// Check required files
const requiredFiles = [
  'app.json',
  'package.json',
  'config/production.json',
  'android/app/build.gradle',
  'ios/INVERTRACK.xcodeproj/project.pbxproj'
];

console.log('📋 Checking required files...');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing required file: ${file}`);
    process.exit(1);
  }
  console.log(`✅ Found ${file}`);
});

// Check dependencies
console.log('\n📦 Checking dependencies...');
try {
  execSync('npm audit', { stdio: 'inherit' });
  console.log('✅ Dependencies check passed');
} catch (error) {
  console.warn('⚠️ Some dependencies have vulnerabilities');
}

// Check TypeScript compilation
console.log('\n🔎 Checking TypeScript compilation...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.error('❌ TypeScript compilation failed');
  process.exit(1);
}

// Check environment variables
console.log('\n🔐 Checking environment configuration...');
const config = require('../config/production.json');
const requiredConfigFields = [
  'api.baseUrl',
  'firebase.apiKey',
  'firebase.projectId'
];

requiredConfigFields.forEach(field => {
  const value = field.split('.').reduce((obj, key) => obj?.[key], config);
  if (!value || value.includes('YOUR_')) {
    console.error(`❌ Missing or invalid configuration: ${field}`);
    process.exit(1);
  }
});
console.log('✅ Environment configuration valid');

// Check assets
console.log('\n🖼️ Checking required assets...');
const requiredAssets = [
  'assets/icon.png',
  'assets/splash.png',
  'assets/adaptive-icon.png'
];

requiredAssets.forEach(asset => {
  const assetPath = path.join(__dirname, '..', asset);
  if (!fs.existsSync(assetPath)) {
    console.error(`❌ Missing required asset: ${asset}`);
    process.exit(1);
  }
  console.log(`✅ Found ${asset}`);
});

console.log('\n✅ All pre-build checks passed successfully!\n');
