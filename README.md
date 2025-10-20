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

Quick Start
Follow these steps to see the calculator running on your device in just a few minutes.

1. Clone the repository and open the Expo project:
   ```bash
   git clone https://github.com/<your-org>/SLT_business_date_calculator.git
   cd SLT_business_date_calculator/app
   ```
2. Install dependencies (Expo CLI, React Native, TypeScript, and supporting libraries are included in `package.json`):
   ```bash
   npm install
   ```
3. Launch the development server with Metro bundler and QR code dashboard:
   ```bash
   npm start
   ```
4. Scan the QR code with the Expo Go mobile app (available on Google Play and the iOS App Store) while your development machine and device share the same network to load the app instantly.

Installation
Prerequisites
- Node.js LTS (18.x or newer is recommended) and npm.
- Optional: [nvm](https://github.com/nvm-sh/nvm) for managing Node.js versions.
- Expo CLI tooling installs automatically when you run the npm scripts above; no global installation is required.

Project setup
1. Ensure you are inside the `app` directory and install dependencies: `npm install`.
2. Copy any environment configuration (if introduced later) such as `.env.example` to `.env`.
3. Verify the TypeScript and Metro caches are clean before first run (optional):
   ```bash
   npm run lint -- --fix
   npm run test -- --watch=false
   ```

Running the application
- Development: `npm start` to open the Expo developer tools. Press `a` for Android emulator, `i` for iOS simulator (macOS only), or `w` for the web preview.
- Android build: `npm run android` generates the native Android project, produces a debug APK in `android/app/build/outputs/apk/debug/`, and installs it on any connected emulator or device.
- iOS build: `npm run ios` creates the iOS native project and launches it in the default simulator or Xcode. A macOS host with Xcode is required.

Production-ready builds
For store submissions, use Expo Application Services (EAS Build). After creating an Expo account and configuring credentials, run `npx eas build -p android` or `npx eas build -p ios` from the `app` directory to produce signed binaries.

Testing
Run `npm test` to execute the Jest and React Native Testing Library suites that cover business-day calculations and UI defaults.

Tech Stack
Expo 50, React Native 0.73, React 18, and TypeScript.

@react-native-community/datetimepicker for cross-platform calendar pickers.

date-fns for calendar arithmetic and holiday calculations.

