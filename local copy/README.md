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
Node.js LTS and npm.

Android Studio (or the standalone Android SDK command-line tools) with the Android SDK installed. Open the SDK Manager at least once to download the required packages, accept the SDK licenses (sdkmanager --licenses), and then set the ANDROID_HOME (or ANDROID_SDK_ROOT) environment variable to the SDK location.

Add the SDK's platform-tools directory—where adb lives—to your PATH so expo run:android can communicate with devices:

- Windows PowerShell (profile or system environment variables): $env:Path += ";$env:ANDROID_HOME\platform-tools".
- macOS (e.g., ~/.zshrc): export PATH="$ANDROID_HOME/platform-tools:$PATH".
- Linux (e.g., ~/.bashrc): export PATH="$ANDROID_HOME/platform-tools:$PATH".

Verify the setup by running adb devices. If the command lists attached devices (or reports "List of devices attached" with none connected), your PATH is correct.

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
This invokes expo run:android, generates the native Android project, and produces a debug APK you can side-load (Expo places it in the standard android/app/build/outputs/apk/debug/ folder after the build completes). The script shells out to the Android SDK tools, so it will fail with an "android not recognized" error until Android Studio/SDK, ANDROID_HOME, and the platform-tools PATH entries described above are configured.

The command also installs the build on any connected device; you can grab the APK from the output directory for distribution to testers.

Run on iOS simulator or device
npm run ios
The script wraps expo run:ios, generating the native iOS project and opening it in Xcode or the default simulator. macOS with Xcode installed is required for simulator/device builds.
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

