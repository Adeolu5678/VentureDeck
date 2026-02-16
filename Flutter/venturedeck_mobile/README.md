# VentureDeck Mobile

Cross-platform mobile application for VentureDeck - the investment platform connecting founders with investors.

Built with **Flutter 3.38.5** and **Dart 3.10.4**.

## 🛠️ Setup Requirements

### System Requirements
- Flutter SDK 3.38.5+ (already installed at `C:\Projects\Applications Development\flutter`)
- Dart SDK 3.10.4+
- Android SDK with cmdline-tools (for Android development)
- Chrome (for web development)

### IDE Setup
1. Install VS Code extensions:
   - **Dart** (Dart-Code.dart-code)
   - **Flutter** (Dart-Code.flutter)
   - **Flutter Widget Snippets** (alexisvt.flutter-snippets)
   - **Error Lens** (usernamehw.errorlens)

2. See [VSCODE_CONFIG.md](./VSCODE_CONFIG.md) for recommended settings.

### Android SDK Setup (Without Android Studio)

To develop for Android without Android Studio:

1. **Download Android Command-line Tools**:
   - Visit: https://developer.android.com/studio#command-line-tools-only
   - Download the Windows version
   - Extract to `C:\Android\cmdline-tools\latest\`

2. **Set Environment Variables** (PowerShell as Admin):
   ```powershell
   [Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Android", "User")
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Android\cmdline-tools\latest\bin;C:\Android\platform-tools", "User")
   ```

3. **Install SDK Components**:
   ```powershell
   sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" "emulator" "system-images;android-34;google_apis;x86_64"
   ```

4. **Accept Licenses**:
   ```powershell
   flutter doctor --android-licenses
   ```

5. **Create Emulator** (optional):
   ```powershell
   avdmanager create avd -n Pixel8 -k "system-images;android-34;google_apis;x86_64" -d "pixel_8"
   ```

## 🚀 Getting Started 

### Install Dependencies
```bash
cd Flutter/venturedeck_mobile
flutter pub get
```

### Run the App

**On Chrome (Web):**
```bash
flutter run -d chrome
```

**On Android Emulator:**
```bash
# Start emulator first
emulator -avd Pixel8

# Run app
flutter run -d emulator-5554
```

**On Connected Android Device:**
```bash
flutter run -d <device-id>
```

### Run Code Generation
```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

### Run Tests
```bash
flutter test
```

## 📁 Project Structure

```
lib/
├── core/
│   ├── constants/    # App constants, API endpoints
│   ├── theme/        # Theme, colors, typography
│   ├── utils/        # Utility functions
│   └── extensions/   # Dart extensions
├── data/
│   ├── models/       # Data models (Freezed)
│   ├── repositories/ # Data repositories
│   └── services/     # API services, Convex
├── domain/
│   ├── entities/     # Business entities
│   └── usecases/     # Business logic
├── presentation/
│   ├── screens/      # App screens
│   ├── widgets/      # Reusable widgets
│   └── providers/    # Riverpod providers
└── main.dart         # Entry point
```

## 🔌 Convex Integration

This app connects to the VentureDeck Convex backend.

### Configuration
1. Copy `.env.example` to `.env`
2. Update `CONVEX_URL` with your deployment URL:
   ```
   CONVEX_URL=https://your-deployment.convex.cloud
   ```

### Usage
```dart
import 'package:venturedeck_mobile/data/services/convex_service.dart';

// Initialize
await ConvexService.instance.connect();

// Query
final projects = await ConvexService.instance.query<List>('projects:list');

// Mutation
await ConvexService.instance.mutation('projects:create', {
  'title': 'New Project',
});

// Subscribe (real-time)
ConvexService.instance.subscribe('projects:list').listen((projects) {
  print('Projects updated: $projects');
});
```

## 📱 Available Platforms

| Platform | Status | Notes |
|----------|--------|-------|
| Android | ✅ Ready | Requires Android SDK setup |
| Web | ✅ Ready | Works immediately |
| Windows | ⚠️ Optional | Requires Visual Studio |
| iOS | ❌ N/A | Requires macOS |

## 🎨 Design System

The app uses VentureDeck's luxury fintech design:

- **Colors**: Warm amber/gold palette with dark mode
- **Typography**: Sora (headings) + Outfit (body)
- **Components**: Glassmorphism, subtle animations

## 📜 Common Commands

| Command | Description |
|---------|-------------|
| `flutter run` | Run in debug mode |
| `flutter run --release` | Run in release mode |
| `flutter build apk` | Build Android APK |
| `flutter build web` | Build for web |
| `flutter analyze` | Analyze code |
| `flutter test` | Run tests |
| `flutter clean` | Clean build |
| `flutter pub outdated` | Check outdated deps |

## 🐛 Troubleshooting

### Flutter lock error
```powershell
Remove-Item -Force "C:\Projects\Applications Development\flutter\bin\cache\lockfile"
```

### Dependency conflicts
```bash
flutter pub upgrade --major-versions
```

### Android toolchain issues
```bash
flutter doctor -v
```

## 📄 License

Proprietary - VentureDeck
