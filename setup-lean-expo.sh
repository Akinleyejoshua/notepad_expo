#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting Lean Expo Project Setup..."

# 1. Ask for project name
read -p "Enter your new project name: " PROJECT_NAME

if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Project name cannot be empty."
    exit 1
fi

# 2. Initialize a clean blank Expo project
echo "📦 Initializing clean Expo app: $PROJECT_NAME..."
npx create-expo-app@latest "$PROJECT_NAME" --template blank

# Move into the project directory
cd "$PROJECT_NAME"

# 3. Install required optimization build properties plugin
echo "📥 Installing expo-build-properties..."
npx expo install expo-build-properties

# 4. Inject ProGuard, Resource Shrinking, and Legacy Packaging into app.json
echo "⚙️ Injecting size optimization configurations into app.json..."
node -e '
const fs = require("fs");
const appJson = JSON.parse(fs.readFileSync("app.json", "utf8"));

appJson.expo.plugins = appJson.expo.plugins || [];
appJson.expo.plugins.push([
  "expo-build-properties",
  {
    "android": {
      "enableProguardInReleaseBuilds": true,
      "enableShrinkResourcesInReleaseBuilds": true,
      "useLegacyPackaging": true
    }
  }
]);

fs.writeFileSync("app.json", JSON.stringify(appJson, null, 2), "utf8");
console.log("✅ app.json updated successfully.");
'

# 5. Create a fully optimized eas.json file
echo "📝 Creating optimized eas.json profile matrix..."
cat << 'EOF' > eas.json
{
  "cli": {
    "version": ">= 20.4.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease -PreactNativeAndroidArchitectures=arm64-v8a"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
EOF

# 6. Initialize git tracking and commit changes (Crucial for remote EAS)
echo "📂 Initializing local Git workflow tracking..."
if [ ! -d ".git" ]; then
    git init
fi
git add .
git commit -m "chore: initial commit with lean 40MB APK build profiles optimized"

echo "--------------------------------------------------------"
echo "✅ Setup Complete! Your new project '$PROJECT_NAME' is optimized."
echo "--------------------------------------------------------"
echo "To link your EAS project and run your first small APK cloud build, run:"
echo "  1. cd $PROJECT_NAME"
echo "  2. eas project:init"
echo "  3. eas build --platform android --profile preview"
echo "--------------------------------------------------------"