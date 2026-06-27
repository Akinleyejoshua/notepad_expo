#!/bin/bash
set -e

echo "🛠️ Optimizing current Expo project for a lean ~40MB APK..."

# 1. Install the tracking plugin safely matching your local Expo SDK
echo "📥 Checking and installing expo-build-properties..."
npx expo install expo-build-properties

# 2. Surgically append to app.json without wiping out your keys
echo "⚙️ Appending compression properties to app.json..."
node -e "
const fs = require('fs');
if (!fs.existsSync('app.json')) {
  console.error('❌ Error: app.json not found!');
  process.exit(1);
}
const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));

appJson.expo.plugins = appJson.expo.plugins || [];

// Check if the plugin is already there so we don't duplicate it
const hasPlugin = appJson.expo.plugins.some(p => Array.isArray(p) && p[0] === 'expo-build-properties');

if (!hasPlugin) {
  appJson.expo.plugins.push([
    'expo-build-properties',
    {
      'android': {
        'enableProguardInReleaseBuilds': true,
        'enableShrinkResourcesInReleaseBuilds': true,
        'useLegacyPackaging': true
      }
    }
  ]);
  fs.writeFileSync('app.json', JSON.stringify(appJson, null, 2), 'utf8');
  console.log('✅ app.json successfully updated with compression flags.');
} else {
  console.log('ℹ️ expo-build-properties already exists in app.json. Skipping.');
}
"

# 3. Smart-update eas.json profiles without wiping your file
echo "📝 Merging lean architectures into eas.json..."
node -e "
const fs = require('fs');
let easJson = { cli: {}, build: {}, submit: {} };

if (fs.existsSync('eas.json')) {
  easJson = JSON.parse(fs.readFileSync('eas.json', 'utf8'));
}

// Keep whatever is already in build, but surgically add/overwrite the preview profile
easJson.build = easJson.build || {};
easJson.build.preview = {
  "distribution": "internal",
  "android": {
    "buildType": "apk",
    "gradleCommand": ":app:assembleRelease -PreactNativeAndroidArchitectures=arm64-v8a"
  }
};

fs.writeFileSync('eas.json', JSON.stringify(easJson, null, 2), 'utf8');
console.log('✅ eas.json preview profile updated.');
"

# 4. Save to Git timeline automatically
echo "📂 Committing configuration updates to Git..."
git add app.json eas.json package.json
git commit -m "chore: optimize android build pipeline for 40MB standalone APKs" --allow-empty

echo "--------------------------------------------------------"
echo "🚀 Project Optimized! Run your cloud build now:"
echo "   eas build --platform android --profile preview"
echo "--------------------------------------------------------"