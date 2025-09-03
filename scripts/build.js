const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BUILD_TYPE = process.env.BUILD_TYPE || 'development';
const PLATFORM = process.env.PLATFORM || 'android';

// Validate environment
if (!['development', 'staging', 'production'].includes(BUILD_TYPE)) {
  console.error('Invalid BUILD_TYPE. Must be one of: development, staging, production');
  process.exit(1);
}

if (!['android', 'ios'].includes(PLATFORM)) {
  console.error('Invalid PLATFORM. Must be one of: android, ios');
  process.exit(1);
}

console.log(`Building ${BUILD_TYPE} for ${PLATFORM}...`);

// Load configuration
const config = require(`../config/${BUILD_TYPE}.json`);

// Ensure build directories exist
const buildDir = path.join(__dirname, '../build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Clean previous builds
console.log('Cleaning previous builds...');
if (PLATFORM === 'android') {
  try {
    execSync('cd android && ./gradlew clean', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error cleaning Android build:', error);
    process.exit(1);
  }
} else {
  try {
    execSync('cd ios && xcodebuild clean', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error cleaning iOS build:', error);
    process.exit(1);
  }
}

// Install dependencies
console.log('Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}

// Build the app
console.log('Building the app...');
try {
  if (PLATFORM === 'android') {
    execSync('cd android && ./gradlew assembleRelease', { stdio: 'inherit' });
    
    // Copy APK to build directory
    const apkSource = path.join(__dirname, '../android/app/build/outputs/apk/release/app-release.apk');
    const apkDest = path.join(buildDir, `invertrack-${BUILD_TYPE}.apk`);
    fs.copyFileSync(apkSource, apkDest);
    
    console.log(`APK built successfully: ${apkDest}`);
  } else {
    execSync('cd ios && xcodebuild -workspace INVERTRACK.xcworkspace -scheme INVERTRACK -configuration Release', { stdio: 'inherit' });
    console.log('iOS app built successfully');
  }
} catch (error) {
  console.error('Error building app:', error);
  process.exit(1);
}

// Generate source maps
console.log('Generating source maps...');
try {
  execSync(`npx react-native bundle --platform ${PLATFORM} --dev false --entry-file index.js --bundle-output build/main.jsbundle --sourcemap-output build/main.jsbundle.map`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error generating source maps:', error);
  process.exit(1);
}

console.log('Build completed successfully!');
