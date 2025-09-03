# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
- `npm start` - Start Metro bundler for React Native development
- `npm run android` - Run app on Android emulator/device
- `npm run ios` - Run app on iOS simulator/device (macOS only)
- `npm install` - Install dependencies
- `cd ios && pod install && cd ..` - Install iOS pods (macOS only)

### Testing and Code Quality
- `npm test` - Run Jest tests
- `npm run lint` - Run ESLint for code quality checks

### Build Commands
- `npm run clean` - Clean Android build directories (`cd android && gradlew clean`)
- `npm run build:android` - Build Android release APK (`cd android && gradlew assembleRelease`)
- `./scripts/build-production.sh` - Full production build with pre-checks and source maps
- `./scripts/build-production.sh android` - Android-only production build
- `./scripts/build-production.sh ios` - iOS-only production build (macOS only)

## Architecture Overview

### Technology Stack
- **Framework**: React Native 0.72.6 with TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Database**: Realm for local data storage
- **Authentication**: Firebase Auth
- **Cloud Database**: Firestore
- **UI Components**: React Native Paper
- **State Management**: React Context
- **Maps**: React Native Maps
- **Image Handling**: React Native Image Picker

### Project Structure
- `/src/components/` - Reusable UI components
- `/src/screens/` - App screens and their components
- `/src/navigation/` - Navigation configuration (Auth, Infrastructure, Tasks, Root)
- `/src/services/` - Business logic and API services
- `/src/hooks/` - Custom React hooks
- `/src/context/` - Context providers (AuthContext)
- `/src/types/` - TypeScript type definitions

### Database Architecture
Uses Realm for offline-first local storage with these main entities:
- **Lot**: Agricultural plots with coordinates and metadata
- **CropHistory**: Crop cycles with planting, growth, and harvest data
- **Treatment**: Fertilizer, pesticide, and other agricultural treatments
- **HealthRecord**: Pest, disease, and plant health issues
- **Task**: Scheduled agricultural activities
- **Infrastructure**: Equipment and facility management
- **ImageRecord**: Photo documentation
- **EconomicRecord**: Financial tracking

### Path Aliases (tsconfig.json)
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@screens/*` → `src/screens/*`
- `@navigation/*` → `src/navigation/*`
- `@services/*` → `src/services/*`
- `@hooks/*` → `src/hooks/*`
- `@context/*` → `src/context/*`
- `@types/*` → `src/types/*`

### Configuration
- `config/production.json` - Production environment configuration
- Environment-specific builds supported via build scripts

### Key Services
- `realm.ts` - Database initialization and schema definitions
- `authService.ts` - Firebase authentication
- `exportService.ts` - Data export functionality
- `notificationService.ts` - Push notifications
- `reportService.ts` - Report generation
- `imageService.ts` - Image handling utilities

### App Features
INVERTRACK is a comprehensive agricultural management app for crop tracking with:
- Lot management with GPS coordinates and mapping
- Crop cycle tracking from planting to harvest
- Treatment application logging (fertilizers, pesticides)
- Plant health monitoring (pests, diseases)
- Task scheduling and calendar management
- Infrastructure monitoring
- Economic tracking (costs and income)
- Photo documentation
- Report generation and data export
- Offline-first architecture with cloud sync

### Build Artifacts
Production builds generate timestamped releases in `/releases/` directory with APK, IPA, source maps, and build reports.