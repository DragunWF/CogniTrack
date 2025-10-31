import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

import { mainColors } from "../../shared/constants/colors";
import SettingsSection from "../components/settings/SettingsSection";
import SettingsButton from "../components/settings/SettingsButton";
import ConfirmationModal from "../components/settings/ConfirmationModal";

// Use cases
import {
  ExportAllDataUseCase,
  ImportFromBackupUseCase,
  ClearAllBadHabitsUseCase,
  ClearAllInsightReportsUseCase,
  BackupData,
} from "../../application/useCases/dataManagementUseCases";

/**
 * Settings Screen
 *
 * Provides data management and maintenance features:
 * - Export/Import app data as JSON backups
 * - Clear habit logs (danger zone)
 * - Clear AI insight reports (danger zone)
 *
 * Architecture Layer: Presentation (Screen)
 * Clean Architecture: Uses use cases for business logic, repositories for data access
 */

function SettingsScreen() {
  // Modal states
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [showClearHabitsConfirm, setShowClearHabitsConfirm] = useState(false);
  const [showClearInsightsConfirm, setShowClearInsightsConfirm] =
    useState(false);

  // Store selected backup file for import
  const [selectedBackupFile, setSelectedBackupFile] = useState<string | null>(
    null
  );

  /**
   * Export All Data Handler
   * Creates backup file and opens share sheet (iOS standard for file export)
   * NOTE: iOS doesn't have a "save file picker" API - only share sheet with "Save to Files" option
   *
   * FIX: Removed LoadingModal to prevent touch blocking issue
   */
  const handleExportData = async () => {
    try {
      // REMOVED: LoadingModal causes touch responder system to break
      // setIsLoading(true);
      // setLoadingMessage("Exporting data...");

      // Execute use case
      const exportUseCase = new ExportAllDataUseCase();
      const backupData = await exportUseCase.execute();

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const filename = `cognitrack-backup-${timestamp}.json`;

      // Create file in cache directory (matching InkSight exactly)
      const file = new FileSystem.File(FileSystem.Paths.cache, filename);

      // Write data to file
      await file.write(JSON.stringify(backupData, null, 2));
      console.log(`✅ Export file created: ${file.uri}`);

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // Share the file (user can save to Files, send via email, etc.)
        await Sharing.shareAsync(file.uri, {
          mimeType: "application/json",
          dialogTitle: "Save Your CogniTrack Backup",
          UTI: "public.json",
        });
      } else {
        // setIsLoading(false); // REMOVED
        Alert.alert(
          "Export Successful",
          `Your data has been exported to:\n${file.uri}\n\nYou can find this file in your app's cache folder.`,
          [{ text: "OK" }]
        );
        return;
      }

      // setIsLoading(false); // REMOVED
    } catch (error: any) {
      // setIsLoading(false); // REMOVED
      Alert.alert(
        "Export Failed",
        error.message || "Failed to export data. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  /**
   * Import Backup - Step 1: Select File
   * Opens document picker to select backup JSON file
   */
  const handleSelectBackupFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets[0]) {
        setSelectedBackupFile(result.assets[0].uri);
        setShowImportConfirm(true); // Show confirmation dialog
      }
    } catch (error: any) {
      console.error("File picker error:", error);
      Alert.alert("Error", "Failed to select file. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  /**
   * Import Backup - Step 2: Confirm and Execute
   * Reads the selected JSON file and imports data
   *
   * FIX: Removed LoadingModal to prevent touch blocking issue
   */
  const handleConfirmImport = async () => {
    if (!selectedBackupFile) return;

    // Close confirmation modal
    setShowImportConfirm(false);
    // REMOVED: LoadingModal causes touch responder system to break
    // setIsLoading(true);
    // setLoadingMessage("Importing backup...");

    // Store file URI locally so we can clear state early
    const fileUri = selectedBackupFile;

    try {
      // Read file content using new expo-file-system API
      const file = new FileSystem.File(fileUri);
      const fileContent = await file.text();
      const backupData: BackupData = JSON.parse(fileContent);

      // Execute database transaction
      const importUseCase = new ImportFromBackupUseCase();
      await importUseCase.execute(backupData);

      // Clear state
      // setIsLoading(false); // REMOVED
      setSelectedBackupFile(null);

      // Show success alert immediately
      Alert.alert(
        "Import Successful",
        "Backup imported successfully!\nYour data has been restored.",
        [{ text: "OK" }]
      );
    } catch (error: any) {
      // Clear state
      // setIsLoading(false); // REMOVED
      setSelectedBackupFile(null);

      // Show error alert
      Alert.alert(
        "Import Failed",
        error.message ||
          "Failed to import backup. The file may be corrupted or invalid.",
        [{ text: "OK" }]
      );
    }
  };

  /**
   * Clear All Habit Logs
   * Deletes all BadHabit records from the database
   *
   * TEST: Removed LoadingModal to diagnose touch blocking issue
   */
  const handleClearHabits = async () => {
    try {
      setShowClearHabitsConfirm(false);
      // TESTING: No loading modal
      // setIsLoading(true);
      // setLoadingMessage("Clearing habit logs...");

      const clearUseCase = new ClearAllBadHabitsUseCase();
      await clearUseCase.execute();

      // TESTING: No loading modal to unmount
      // setIsLoading(false);

      // Show alert immediately (no modal to wait for)
      Alert.alert("Success", "All habit logs have been cleared successfully.", [
        { text: "OK" },
      ]);
    } catch (error: any) {
      // setIsLoading(false);
      console.error("Clear habits error:", error);

      Alert.alert(
        "Error",
        error.message || "Failed to clear habit logs. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  /**
   * Clear All AI Insights
   * Deletes all InsightReport records from the database
   *
   * FIX: Removed LoadingModal to prevent touch blocking issue
   */
  const handleClearInsights = async () => {
    try {
      setShowClearInsightsConfirm(false);
      // REMOVED: LoadingModal causes touch responder system to break
      // setIsLoading(true);
      // setLoadingMessage("Clearing AI insights...");

      const clearUseCase = new ClearAllInsightReportsUseCase();
      await clearUseCase.execute();

      // REMOVED: No loading modal to unmount
      // setIsLoading(false);

      // Show alert immediately
      Alert.alert(
        "Success",
        "All AI insights have been cleared successfully.",
        [{ text: "OK" }]
      );
    } catch (error: any) {
      // setIsLoading(false); // REMOVED
      console.error("Clear insights error:", error);

      Alert.alert(
        "Error",
        error.message || "Failed to clear AI insights. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Data Management Section */}
          <SettingsSection title="Data Management">
            <SettingsButton
              label="Export All Data"
              description="Create backup and choose where to save it (Files, iCloud, etc.)"
              icon="💾"
              variant="primary"
              onPress={handleExportData}
            />
            <SettingsButton
              label="Import from Backup"
              description="Restore data from a previous backup (replaces current data)"
              icon="📥"
              variant="secondary"
              onPress={handleSelectBackupFile}
            />
          </SettingsSection>

          {/* Danger Zone Section */}
          <SettingsSection title="Danger Zone" isDanger>
            <SettingsButton
              label="Clear All Habit Logs"
              description="Delete all logged habits (keeps habit types)"
              icon="🗑️"
              variant="danger"
              onPress={() => setShowClearHabitsConfirm(true)}
            />
            <SettingsButton
              label="Clear All AI Insights"
              description="Delete all generated AI reports"
              icon="🧹"
              variant="danger"
              onPress={() => setShowClearInsightsConfirm(true)}
            />
          </SettingsSection>
        </ScrollView>
      </SafeAreaView>

      {/* Modals - Rendered outside SafeAreaView to ensure proper z-index */}
      {/* LoadingModal REMOVED - causes touch responder system to break on iOS */}

      <ConfirmationModal
        visible={showImportConfirm}
        title="Overwrite Data?"
        message="This will replace ALL current data with the backup. This action cannot be undone. Are you sure?"
        confirmText="Import"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleConfirmImport}
        onCancel={() => {
          setShowImportConfirm(false);
          setSelectedBackupFile(null);
        }}
      />

      <ConfirmationModal
        visible={showClearHabitsConfirm}
        title="Clear All Habit Logs?"
        message="This will delete all logged habits but keep your habit types. This action cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleClearHabits}
        onCancel={() => setShowClearHabitsConfirm(false)}
      />

      <ConfirmationModal
        visible={showClearInsightsConfirm}
        title="Clear All AI Insights?"
        message="This will delete all generated AI reports. This action cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleClearInsights}
        onCancel={() => setShowClearInsightsConfirm(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,
  },
});

export default SettingsScreen;
