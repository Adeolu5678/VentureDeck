# VentureDeck Mobile - Convex Backend & Testing Guide

## 1. Convex Backend Connection

### Step 1: Configure Convex URL

Update the Convex deployment URL in your constants file:

**File**: `lib/core/constants/app_constants.dart`

```dart
abstract final class ApiConfig {
  // Update this to your Convex deployment URL
  static const String convexUrl = 'https://your-deployment.convex.cloud';
  
  // For local development (Convex dev server)
  // static const String convexUrl = 'http://localhost:3210';
}
```

### Step 2: Get Your Convex Deployment URL

1. **If running locally**:
   ```bash
   cd path/to/your/convex/project
   npx convex dev
   ```
   The URL will be shown in the terminal (e.g., `http://127.0.0.1:3210`)

2. **If using production**:
   - Go to [Convex Dashboard](https://dashboard.convex.dev)
   - Select your project
   - Copy the deployment URL from the project settings

### Step 3: Ensure Backend Functions Exist

The mobile app expects these Convex functions:

| Function | Purpose |
|----------|---------|
| `auth:signInWithClerk` | Clerk authentication |
| `users:me` | Get current user |
| `projects:list` | List projects |
| `projects:get` | Get single project |
| `conversations:list` | List conversations |
| `messages:list` | Get messages |
| `bounties:listOpen` | List open bounties |
| `milestones:listByProject` | Get project milestones |

---

## 2. Clerk Authentication Setup

### Step 1: Configure Clerk for Mobile

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your VentureDeck application
3. Enable OAuth providers (Google, Apple, etc.)
4. Add your mobile app's URL scheme to allowed origins

### Step 2: Update Clerk Config

**File**: `lib/core/constants/app_constants.dart`

```dart
abstract final class ClerkConfig {
  static const String publishableKey = 'pk_live_YOUR_CLERK_KEY';
  // For testing, use pk_test_XXX
}
```

### Step 3: iOS Configuration

**File**: `ios/Runner/Info.plist`
- Ensure URL schemes are configured for deep linking
- Add Clerk callback URLs

### Step 4: Android Configuration

**File**: `android/app/src/main/AndroidManifest.xml`
- Add intent filters for Clerk redirects

---

## 3. Testing the App

### Option A: Run on Android Emulator

```bash
# From the project directory
cd c:\Projects\Applications Development\VentureDeck\Flutter\venturedeck_mobile

# List available devices
flutter devices

# Run on Android emulator
flutter run -d android
```

### Option B: Run on iOS Simulator (Mac only)

```bash
# Run on iOS simulator
flutter run -d ios
```

### Option C: Run on Physical Device

1. **Android**: Enable USB debugging, connect device
2. **iOS**: Configure signing in Xcode

```bash
flutter run
```

### Option D: Run on Chrome (Web Preview)

```bash
flutter run -d chrome
```

---

## 4. Testing Checklist

### Authentication Flow
- [ ] App shows splash screen on launch
- [ ] Redirects to login if not authenticated
- [ ] Clerk sign-in works (Google/Apple/Email)
- [ ] User is redirected to dashboard after login

### Dashboard
- [ ] Dashboard loads with metrics
- [ ] Quick actions work
- [ ] Recent projects display

### Projects
- [ ] Projects list loads
- [ ] Project details page works
- [ ] Create new project form works
- [ ] Milestones section displays
- [ ] Follow/unfollow works (investors)
- [ ] Analytics page loads (owners)

### Messaging
- [ ] Conversations list loads
- [ ] Chat screen displays messages
- [ ] Send message works
- [ ] Real-time updates work
- [ ] Unread badge shows in nav

### Bounties
- [ ] Bounties list loads with tabs
- [ ] Filter chips work
- [ ] Bounty detail page works
- [ ] Claim bounty works
- [ ] Submit work works

### Profile & Settings
- [ ] Profile screen loads
- [ ] Edit profile works
- [ ] Settings options work
- [ ] Logout works

---

## 5. Debugging Tips

### View Logs
```bash
# Flutter logs
flutter logs

# Device logs
adb logcat | grep flutter
```

### Hot Reload
Press `r` in the terminal while the app is running.

### Hot Restart
Press `R` (capital) for a full restart.

### Network Issues
1. Check Convex URL is correct
2. Ensure device can reach `YOUR_URL.convex.cloud`
3. Check for CORS issues (web only)

### WebSocket Issues
The ConvexService uses WebSocket for real-time updates. If subscriptions aren't working:
1. Check WebSocket connection status in logs
2. Ensure network allows WebSocket connections
3. Try HTTP fallback if needed

---

## 6. Environment-Specific Configuration

### Development
```dart
// In app_constants.dart
static const String convexUrl = 'http://localhost:3210';
static const bool debugMode = true;
```

### Staging
```dart
static const String convexUrl = 'https://staging-xxx.convex.cloud';
static const bool debugMode = true;
```

### Production
```dart
static const String convexUrl = 'https://prod-xxx.convex.cloud';
static const bool debugMode = false;
```

---

## 7. Building for Release

### Android APK
```bash
flutter build apk --release
```
Output: `build/app/outputs/flutter-apk/app-release.apk`

### Android App Bundle (Play Store)
```bash
flutter build appbundle --release
```

### iOS (requires Mac)
```bash
flutter build ios --release
```

---

## Quick Start Summary

1. **Update Convex URL** in `app_constants.dart`
2. **Update Clerk key** in `app_constants.dart`  
3. **Start Convex** (`npx convex dev`)
4. **Run the app** (`flutter run`)
5. **Test authentication** with your Clerk credentials
6. **Verify data loads** from Convex backend
