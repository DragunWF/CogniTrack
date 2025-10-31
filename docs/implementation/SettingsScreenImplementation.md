# Settings Screen Implementation

## Overview

The Settings Screen has been successfully implemented for the CogniTrack app, following Clean Architecture principles as defined by Robert C. Martin. This implementation provides data management and maintenance features with a focus on user safety and data portability.

## Features Implemented

### 1. Data Management Section

#### Export All Data

- **Functionality**: Exports all app data (bad habits and insight reports) to a JSON backup file
- **User Flow**:
  1. User taps "Export All Data" button
  2. System fetches all data from SQLite database
  3. Creates a timestamped JSON file (`cognitrack_backup_YYYY-MM-DD.json`)
  4. Opens native share sheet for user to save to Files, cloud storage, etc.
- **Technical Details**:
  - Uses `ExportAllDataUseCase` for business logic
  - Leverages `react-native-fs` for file operations
  - Uses `react-native-share` for native sharing
  - Includes metadata (version, timestamp) for future compatibility

#### Import from Backup

- **Functionality**: Restores data from a previously exported JSON backup file
- **User Flow**:
  1. User taps "Import from Backup" button
  2. Native document picker opens
  3. User selects a `.json` backup file
  4. **Critical**: Confirmation modal warns about data overwrite
  5. If confirmed, replaces ALL current data with backup data
- **Technical Details**:
  - Uses `ImportFromBackupUseCase` with validation
  - Leverages `react-native-document-picker` for file selection
  - Uses SQLite transaction for atomicity (all-or-nothing)
  - Validates backup structure before import
  - Handles date conversion (ISO strings → Date objects)

### 2. Danger Zone Section

#### Clear All Habit Logs

- **Functionality**: Permanently deletes all logged bad habits
- **User Flow**:
  1. User taps "Clear All Habit Logs" button
  2. Confirmation dialog appears with warning
  3. If confirmed, executes `DELETE FROM badHabits`
- **Technical Details**:
  - Uses `ClearAllBadHabitsUseCase`
  - Confirmation modal uses danger styling (red theme)
  - Operation is irreversible

#### Clear All AI Insights

- **Functionality**: Permanently deletes all AI-generated insight reports
- **User Flow**:
  1. User taps "Clear All AI Insights" button
  2. Confirmation dialog appears with warning
  3. If confirmed, executes `DELETE FROM insightReports`
- **Technical Details**:
  - Uses `ClearAllInsightReportsUseCase`
  - Confirmation modal uses danger styling (red theme)
  - Operation is irreversible

## Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────────────┐
│         Presentation Layer                   │
│  - SettingsScreen.tsx (UI + State)          │
│  - Components (SettingsButton, etc.)        │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Application Layer                    │
│  - dataManagementUseCases.ts                │
│    • ExportAllDataUseCase                   │
│    • ImportFromBackupUseCase                │
│    • ClearAllBadHabitsUseCase               │
│    • ClearAllInsightReportsUseCase          │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Infrastructure Layer                 │
│  - badHabitRepository.ts                    │
│  - insightReportRepository.ts               │
│  - coreStorage.ts (Database)                │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Domain Layer                         │
│  - badHabit.ts (Entity)                     │
│  - insightReport.ts (Entity)                │
└─────────────────────────────────────────────┘
```

### Key Files Created

1. **Use Cases** (`src/application/useCases/dataManagementUseCases.ts`)

   - Encapsulates business logic for data operations
   - Independent of UI frameworks and databases
   - Validates data integrity and structure

2. **UI Components** (`src/presentation/components/settings/`)

   - `ConfirmationModal.tsx` - Two-button confirmation dialog
   - `LoadingModal.tsx` - Full-screen loading indicator
   - `SettingsButton.tsx` - Configurable action button
   - `SettingsSection.tsx` - Section header with danger mode
   - `index.ts` - Barrel export for clean imports

3. **Screen** (`src/presentation/screens/SettingsScreen.tsx`)
   - Orchestrates use cases and UI
   - Manages modal states
   - Handles user interactions

## Technical Decisions

### 1. Use Case Pattern

- **Why**: Separates business logic from UI, making code testable and maintainable
- **Benefit**: Each operation has a single responsibility and can be tested in isolation

### 2. Repository Pattern

- **Why**: Abstracts data access, allowing for easy swapping of storage mechanisms
- **Benefit**: Database queries are centralized and reusable

### 3. Confirmation Modals

- **Why**: Protects users from accidental destructive actions
- **Benefit**: Follows best practices for dangerous operations (especially import/clear)

### 4. Transaction for Import

- **Why**: Ensures data consistency (all data imported or none)
- **Benefit**: Prevents partial imports that could corrupt the database

### 5. Backup Metadata

- **Why**: Version field allows for future format migrations
- **Benefit**: Timestamp helps users identify backup files

### 6. Danger Zone Styling

- **Why**: Visual distinction for destructive operations
- **Benefit**: Users immediately recognize high-risk actions

## Color Theme Usage

All components use the app's defined color palette from `colors.ts`:

- **Primary Actions**: `mainColors.primary500` (purple)
- **Danger Actions**: `utilityColors.error500` (red)
- **Backgrounds**: `mainColors.background`, `mainColors.backgroundCard`
- **Text**: `mainColors.textPrimary`, `mainColors.textSecondary`
- **Borders**: `mainColors.border`

No hardcoded colors were used.

## Dependencies Added

```json
{
  "expo-file-system": "~19.0.17",
  "expo-sharing": "~13.0.3",
  "expo-document-picker": "~13.0.3"
}
```

### Package Purposes

- **expo-file-system**: File system operations (read/write JSON files) - Expo-compatible
- **expo-sharing**: Native share sheet for exporting backups - Expo-compatible
- **expo-document-picker**: Native file picker for importing backups - Expo-compatible

**Note**: These are Expo modules that work with Expo Go and don't require a custom development build.

## Error Handling

All operations include comprehensive error handling:

1. **Try-Catch Blocks**: All async operations wrapped in try-catch
2. **Error Modals**: User-friendly error messages displayed
3. **Loading States**: Prevents duplicate operations during processing
4. **Validation**: Backup data structure validated before import
5. **Console Logging**: Detailed logs for debugging

## Data Structure

### Backup JSON Format

```json
{
  "version": "1.0.0",
  "exportedAt": "2025-10-31T12:00:00.000Z",
  "badHabits": [
    {
      "id": 12345,
      "name": "Procrastination",
      "description": "Delaying important tasks",
      "datetime": 1698768000000,
      "location": "Office",
      "trigger": "Stress",
      "notes": "Need to work on this"
    }
  ],
  "insightReports": [
    {
      "id": 1,
      "title": "Weekly Insights",
      "content": "# Analysis...",
      "createdAt": "2025-10-31T12:00:00.000Z",
      "notes": "Review this later"
    }
  ]
}
```

## Testing Recommendations

### Manual Testing Checklist

1. **Export Data**

   - [ ] Export creates valid JSON file
   - [ ] Share sheet opens correctly
   - [ ] File can be saved to Files app
   - [ ] Export includes all data

2. **Import Data**

   - [ ] File picker opens correctly
   - [ ] Confirmation modal appears
   - [ ] Cancel button works
   - [ ] Import replaces all data
   - [ ] Invalid JSON shows error

3. **Clear Habit Logs**

   - [ ] Confirmation modal appears
   - [ ] Cancel button works
   - [ ] Confirm deletes all habits
   - [ ] Success message shown

4. **Clear AI Insights**

   - [ ] Confirmation modal appears
   - [ ] Cancel button works
   - [ ] Confirm deletes all reports
   - [ ] Success message shown

5. **Edge Cases**
   - [ ] Empty database export/import
   - [ ] Large dataset (100+ records)
   - [ ] Malformed JSON file
   - [ ] Concurrent operations prevented

## Future Enhancements

1. **Incremental Backup**: Allow backing up only new/changed data
2. **Encrypted Backups**: Option to encrypt backup files
3. **Auto-Backup**: Scheduled automatic backups to cloud
4. **Selective Import**: Choose which data to import
5. **Backup History**: Keep track of multiple backups
6. **Cloud Sync**: Sync data across devices

## Code Quality

- ✅ TypeScript strict mode compliance
- ✅ No hardcoded values
- ✅ Comprehensive JSDoc comments
- ✅ Consistent naming conventions
- ✅ Clean Architecture principles
- ✅ SOLID principles applied
- ✅ DRY (Don't Repeat Yourself)
- ✅ Error handling throughout

## Summary

The SettingsScreen implementation provides a robust, user-friendly interface for data management with:

- **Safety**: Multiple confirmations for destructive actions
- **Portability**: Standard JSON format for backups
- **Architecture**: Clean separation of concerns
- **UX**: Clear visual hierarchy and feedback
- **Maintainability**: Well-documented, testable code

All requirements from the specification have been met, including the use of Clean Architecture, proper color theming, and comprehensive functionality for data management.
