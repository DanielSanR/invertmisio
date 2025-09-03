#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Starting production build process...${NC}\n"

# Run pre-build checks
echo -e "${YELLOW}Running pre-build checks...${NC}"
node scripts/pre-build-check.js
echo -e "${GREEN}Pre-build checks completed successfully!${NC}\n"

# Clean build directories
echo -e "${YELLOW}Cleaning build directories...${NC}"
rm -rf android/app/build
rm -rf ios/build
echo -e "${GREEN}Build directories cleaned!${NC}\n"

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install --production
echo -e "${GREEN}Dependencies installed successfully!${NC}\n"

# Build Android
if [ "$1" != "ios" ]; then
  echo -e "${YELLOW}Building Android production APK...${NC}"
  cd android
  ./gradlew clean
  ./gradlew assembleRelease
  cd ..
  
  # Copy APK to releases directory
  mkdir -p releases
  cp android/app/build/outputs/apk/release/app-release.apk releases/invertrack-$(date +%Y%m%d).apk
  echo -e "${GREEN}Android build completed successfully!${NC}\n"
fi

# Build iOS
if [ "$1" != "android" ] && [ "$(uname)" == "Darwin" ]; then
  echo -e "${YELLOW}Building iOS production IPA...${NC}"
  cd ios
  xcodebuild clean
  xcodebuild archive -workspace INVERTRACK.xcworkspace -scheme INVERTRACK -configuration Release -archivePath builds/INVERTRACK.xcarchive
  xcodebuild -exportArchive -archivePath builds/INVERTRACK.xcarchive -exportOptionsPlist exportOptions.plist -exportPath builds/
  cd ..
  
  # Copy IPA to releases directory
  mkdir -p releases
  cp ios/builds/INVERTRACK.ipa releases/invertrack-$(date +%Y%m%d).ipa
  echo -e "${GREEN}iOS build completed successfully!${NC}\n"
elif [ "$1" == "ios" ] && [ "$(uname)" != "Darwin" ]; then
  echo -e "${RED}iOS builds can only be created on macOS${NC}\n"
fi

# Generate source maps
echo -e "${YELLOW}Generating source maps...${NC}"
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --sourcemap-output releases/android-sourcemap.json
if [ "$(uname)" == "Darwin" ]; then
  npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle --sourcemap-output releases/ios-sourcemap.json
fi
echo -e "${GREEN}Source maps generated successfully!${NC}\n"

# Create build report
echo -e "${YELLOW}Generating build report...${NC}"
BUILD_DATE=$(date '+%Y-%m-%d %H:%M:%S')
VERSION=$(node -p "require('./package.json').version")
BUILD_NUMBER=$(node -p "require('./app.json').expo.android.versionCode")

cat << EOF > releases/build-report.txt
INVERTRACK Production Build Report
=================================
Date: $BUILD_DATE
Version: $VERSION
Build Number: $BUILD_NUMBER

Android APK: invertrack-$(date +%Y%m%d).apk
iOS IPA: invertrack-$(date +%Y%m%d).ipa
Source Maps: android-sourcemap.json, ios-sourcemap.json

Environment: Production
Configuration: config/production.json
EOF

echo -e "${GREEN}Build report generated successfully!${NC}\n"

echo -e "${GREEN}Production build process completed successfully!${NC}"
echo -e "${YELLOW}Build artifacts can be found in the 'releases' directory${NC}\n"
