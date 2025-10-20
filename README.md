Proposed README
SLT Business Date Calculator
An Expo-managed React Native application for calculating contract value based on Canadian business days, configurable rate changes, and optional tax, complete with a fiscal year breakdown for reporting.

Features
Counts only working days between two dates, skipping weekends and Canadian federal holidays while observing weekend holidays on the next business day.

Uses 7.5 billable hours per business day and can toggle a 13 % tax rate on or off to match contract requirements.

Lets you define a base hourly rate and optionally schedule a new rate that takes effect on a specific date, such as Remembrance Day adjustments.

Provides touch-friendly date pickers, numeric inputs, and switches for quick data entry on mobile devices.

Summarizes total business days, billable hours, subtotal, tax, and grand total, plus a fiscal-year breakdown to support government reporting cycles.

Starts with a 60-business-day planning window so you can see a typical contract quickly, with tests covering the default and key calculations.

Getting Started
Prerequisites
Node.js LTS and npm.

Expo CLI tooling (installed automatically when using the scripts below).

Install dependencies
cd app
npm install
All runtime and development dependencies—including Expo 50, React Native 0.73, and the community date-time picker—are defined in package.json.

Run in development
npm start
npm start launches expo start, opening the Metro bundler with QR codes for mobile devices.

Trying it on Your Phone
Quick preview with Expo Go (Android & iOS)
Start the development server: npm start.

Install the free Expo Go app from Google Play or the iOS App Store.

Ensure your phone and development machine share the same network, then scan the QR code shown in your terminal or browser tab to load the app instantly.

Install a debug APK on Android
Connect an Android device (with USB debugging enabled) or launch an emulator.

Run:

npm run android
This invokes expo run:android, generates the native Android project, and produces a debug APK you can side-load (Expo places it in the standard android/app/build/outputs/apk/debug/ folder after the build completes).

The command also installs the build on any connected device; you can grab the APK from the output directory for distribution to testers.

Run on iOS simulator or device
npm run ios
The script wraps expo run:ios, generating the native iOS project and opening it in Xcode or the default simulator. macOS with Xcode installed is required for simulator/device builds.

Production-ready builds
For signing and publishing to the Apple App Store or Google Play, use Expo Application Services (EAS Build). After creating an Expo account and configuring your credentials, run npx eas build -p android or npx eas build -p ios from the app directory to produce store-ready binaries.

Testing
npm test
The test suite covers both the UI defaults and the business-day calculation service using Jest and React Native Testing Library.

Tech Stack
Expo 50, React Native 0.73, React 18, and TypeScript.

@react-native-community/datetimepicker for cross-platform calendar pickers.

date-fns for calendar arithmetic and holiday calculations.

