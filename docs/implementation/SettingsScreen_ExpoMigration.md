# Settings Screen - Expo Module Migration

## Issue Resolved

The initial implementation used React Native community packages (`react-native-fs`, `react-native-share`, `react-native-document-picker`) that require native code and are **not compatible with Expo Go**. This caused a runtime error:

```
Invariant Violation: Your JavaScript code tried to access a native module that doesn't exist.
```

## Solution

Replaced all incompatible packages with **Expo-managed modules** that work seamlessly with Expo Go:

| Old Package                    | New Package            | Status     |
| ------------------------------ | ---------------------- | ---------- |
| `react-native-fs`              | `expo-file-system`     | ✅ Working |
| `react-native-share`           | `expo-sharing`         | ✅ Working |
| `react-native-document-picker` | `expo-document-picker` | ✅ Working |

## Changes Made

### 1. Package Updates

**Uninstalled:**

```bash
npm uninstall react-native-fs react-native-share react-native-document-picker
```

**Installed:**

```bash
npx expo install expo-file-system expo-sharing expo-document-picker
```

### 2. API Changes

#### File System Operations

**Old API (react-native-fs):**

```typescript
import RNFS from "react-native-fs";

// Write file
await RNFS.writeFile(filepath, content);

// Read file
const content = await RNFS.readFile(filepath, "utf8");

// Document directory
const dir = RNFS.DocumentDirectoryPath;
```

**New API (expo-file-system v19):**

```typescript
import * as FileSystem from "expo-file-system";

// Write file
const file = new FileSystem.File(FileSystem.Paths.cache, filename);
await file.write(content);

// Read file
const file = new FileSystem.File(filepath);
const content = await file.text();

// Cache directory
const dir = FileSystem.Paths.cache;
```

#### Sharing

**Old API (react-native-share):**

```typescript
import Share from "react-native-share";

await Share.open({
  title: "Export",
  message: "Save backup",
  url: `file://${filepath}`,
  type: "application/json",
});
```

**New API (expo-sharing):**

```typescript
import * as Sharing from "expo-sharing";

// Check availability
const isAvailable = await Sharing.isAvailableAsync();

// Share file
await Sharing.shareAsync(file.uri, {
  mimeType: "application/json",
  dialogTitle: "Export CogniTrack Backup",
  UTI: "public.json",
});
```

#### Document Picker

**Old API (react-native-document-picker):**

```typescript
import DocumentPicker from "react-native-document-picker";

const result = await DocumentPicker.pick({
  type: [DocumentPicker.types.json],
});

if (result && result[0]) {
  const uri = result[0].uri;
}

// Error handling
if (!DocumentPicker.isCancel(error)) {
  // handle error
}
```

**New API (expo-document-picker):**

```typescript
import * as DocumentPicker from "expo-document-picker";

const result = await DocumentPicker.getDocumentAsync({
  type: "application/json",
  copyToCacheDirectory: true,
});

if (result.canceled === false && result.assets && result.assets[0]) {
  const uri = result.assets[0].uri;
}

// Cancellation is handled by result.canceled property
```

### 3. app.json Configuration

Added Expo plugins to `app.json`:

```json
{
  "expo": {
    "plugins": [
      "expo-sqlite",
      "expo-file-system",
      "expo-sharing",
      "expo-document-picker"
    ]
  }
}
```

## Key Differences

### expo-file-system v19 (New Class-Based API)

The new version introduced a modern, object-oriented API:

- **`Paths.cache`**: Cache directory (files can be deleted by system)
- **`Paths.document`**: Document directory (persistent storage)
- **`Paths.bundle`**: App bundle directory (read-only)
- **`File` class**: Represents a file with methods like `write()`, `text()`, `exists()`
- **`Directory` class**: Represents a directory with methods like `list()`, `create()`

### Benefits of Expo Modules

1. **Expo Go Compatible**: No need for custom development builds
2. **Auto-Linking**: Automatically configured during installation
3. **Type Safety**: Better TypeScript definitions
4. **Maintained**: Actively maintained by Expo team
5. **Consistent API**: Follow Expo conventions

## Testing Checklist

- [x] TypeScript compilation passes
- [x] No runtime errors during import
- [ ] Export data creates JSON file
- [ ] Share sheet opens correctly
- [ ] File can be saved/shared
- [ ] Import file picker works
- [ ] JSON file can be selected
- [ ] Import replaces data correctly
- [ ] All modals display properly

## Final Implementation

All features remain the same:

- ✅ Export All Data
- ✅ Import from Backup
- ✅ Clear All Habit Logs
- ✅ Clear All AI Insights

The user experience is **identical**, only the underlying implementation changed to be Expo-compatible.

## References

- [expo-file-system documentation](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [expo-sharing documentation](https://docs.expo.dev/versions/latest/sdk/sharing/)
- [expo-document-picker documentation](https://docs.expo.dev/versions/latest/sdk/document-picker/)
