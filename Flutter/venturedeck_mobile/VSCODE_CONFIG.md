# VS Code Configuration for VentureDeck Flutter Development

This file contains the recommended VS Code settings that you should manually add to your `.vscode/settings.json` file.

## Required VS Code Extensions

Install these extensions for the best Flutter development experience:

1. **Dart** (Dart-Code.dart-code) - Dart language support
2. **Flutter** (Dart-Code.flutter) - Flutter development tools
3. **Flutter Widget Snippets** (alexisvt.flutter-snippets) - Useful widget snippets
4. **Pubspec Assist** (jeroen-meijer.pubspec-assist) - Manage dependencies easily
5. **Error Lens** (usernamehw.errorlens) - Inline error display
6. **Better Comments** (aaron-bond.better-comments) - Colored comments
7. **GitLens** (eamodio.gitlens) - Git integration
8. **Bracket Pair Color DL** (CoenraadS.bracket-pair-colorizer-2) - Bracket coloring
9. **Material Icon Theme** (PKief.material-icon-theme) - Better file icons

## Recommended Settings

Add these to your VS Code settings (Ctrl+Shift+P → "Preferences: Open Settings (JSON)"):

```json
{
  // Flutter & Dart Settings
  "[dart]": {
    "editor.formatOnSave": true,
    "editor.formatOnType": true,
    "editor.rulers": [80, 120],
    "editor.selectionHighlight": false,
    "editor.suggestSelection": "first",
    "editor.tabCompletion": "onlySnippets",
    "editor.wordBasedSuggestions": "off",
    "editor.codeActionsOnSave": {
      "source.fixAll": "explicit",
      "source.organizeImports": "explicit"
    }
  },
  
  // Dart Analysis
  "dart.analysisExcludedFolders": [
    ".dart_tool",
    ".idea",
    "build",
    "android/.gradle",
    "ios/Pods"
  ],
  "dart.previewFlutterUiGuides": true,
  "dart.previewFlutterUiGuidesCustomTracking": true,
  "dart.debugExternalPackageLibraries": false,
  "dart.debugSdkLibraries": false,
  "dart.openDevTools": "flutter",
  "dart.flutterHotReloadOnSave": "always",
  "dart.lineLength": 80,
  
  // Editor Settings for Flutter
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active",
  "editor.minimap.enabled": false,
  "editor.snippetSuggestions": "top",
  "editor.stickyScroll.enabled": true,
  
  // File Exclusions
  "files.exclude": {
    "**/.dart_tool": true,
    "**/.idea": true,
    "**/build": true
  },
  "search.exclude": {
    "**/build": true,
    "**/.dart_tool": true,
    "**/android/.gradle": true,
    "**/ios/Pods": true,
    "**/*.g.dart": true,
    "**/*.freezed.dart": true
  },
  
  // Flutter Specific
  "dart.warnWhenEditingFilesOutsideWorkspace": true,
  "dart.closingLabels": true,
  "dart.enableSnippets": true,
  "dart.showTodos": true
}
```

## Launch Configurations

Create a `.vscode/launch.json` file with these debug configurations:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Flutter (Debug)",
      "request": "launch",
      "type": "dart",
      "flutterMode": "debug",
      "program": "lib/main.dart"
    },
    {
      "name": "Flutter (Profile)",
      "request": "launch",
      "type": "dart",
      "flutterMode": "profile",
      "program": "lib/main.dart"
    },
    {
      "name": "Flutter (Release)",
      "request": "launch",
      "type": "dart",
      "flutterMode": "release",
      "program": "lib/main.dart"
    },
    {
      "name": "Flutter (Web)",
      "request": "launch",
      "type": "dart",
      "flutterMode": "debug",
      "program": "lib/main.dart",
      "args": ["-d", "chrome"]
    },
    {
      "name": "Flutter (Attach)",
      "request": "attach",
      "type": "dart"
    }
  ]
}
```

## Keyboard Shortcuts for Flutter

Add these to your `keybindings.json` for faster development:

```json
[
  {
    "key": "ctrl+shift+r",
    "command": "flutter.hotReload",
    "when": "dart-code:anyFlutterProjectLoaded && activeEditor"
  },
  {
    "key": "ctrl+shift+f5",
    "command": "flutter.hotRestart",
    "when": "dart-code:anyFlutterProjectLoaded && inDebugMode"
  },
  {
    "key": "ctrl+shift+d",
    "command": "flutter.openDevTools",
    "when": "dart-code:anyFlutterProjectLoaded"
  }
]
```
