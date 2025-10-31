/**
 * Data Management Use Cases
 *
 * Handles backup/export and restore/import operations for all app data.
 * Provides centralized business logic for data portability.
 *
 * Architecture Layer: Application (Use Cases)
 * Dependencies: Infrastructure (Repositories), Domain (Entities)
 */

import BadHabitRepository from "../../infrastructure/database/badHabitRepository";
import InsightReportRepository from "../../infrastructure/database/insightReportRepository";
import BadHabit from "../../domain/entities/badHabit";
import InsightReport from "../../domain/entities/insightReport";
import { getDatabase } from "../../infrastructure/database/coreStorage";

/**
 * Structure of exported backup data
 */
export interface BackupData {
  version: string; // Backup format version for future compatibility
  exportedAt: string; // ISO timestamp
  badHabits: BadHabit[];
  insightReports: Array<{
    id: number;
    title: string;
    content: string;
    createdAt: string; // ISO string for JSON compatibility
    notes?: string;
  }>;
}

/**
 * Export All Data Use Case
 *
 * Retrieves all data from the database and formats it as a JSON-serializable object
 */
export class ExportAllDataUseCase {
  async execute(): Promise<BackupData> {
    try {
      // Instantiate repositories (use case layer responsibility)
      const badHabitRepository = new BadHabitRepository();
      const insightReportRepository = new InsightReportRepository();

      // Fetch all data from repositories
      const badHabits = await badHabitRepository.getAll();
      const insightReports = await insightReportRepository.getAll();

      // Convert InsightReport dates to ISO strings for JSON serialization
      const serializedReports = insightReports.map((report) => ({
        id: report.id,
        title: report.title,
        content: report.content,
        createdAt: report.createdAt.toISOString(),
        notes: report.notes,
      }));

      // Create backup object
      const backup: BackupData = {
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
        badHabits,
        insightReports: serializedReports,
      };

      console.log("✅ Data export successful:", {
        badHabits: badHabits.length,
        insightReports: insightReports.length,
      });

      return backup;
    } catch (error) {
      console.error("❌ Error exporting data:", error);
      throw new Error("Failed to export data. Please try again.");
    }
  }
}

/**
 * Import From Backup Use Case
 *
 * Validates and imports backup data, replacing all existing data
 * Uses a database transaction to ensure atomicity
 */
export class ImportFromBackupUseCase {
  async execute(backupData: BackupData): Promise<void> {
    try {
      // Validate backup data structure
      this.validateBackupData(backupData);

      // Instantiate repositories
      const badHabitRepository = new BadHabitRepository();
      const insightReportRepository = new InsightReportRepository();

      const db = getDatabase();

      // Execute import in a transaction for atomicity
      await db.withTransactionAsync(async () => {
        // Step 1: Clear all existing data using repository methods
        await badHabitRepository.deleteAll();
        await insightReportRepository.deleteAll();
        console.log("🗑️ Cleared existing data");

        // Step 2: Import bad habits using repository method
        await badHabitRepository.bulkInsert(backupData.badHabits);
        console.log(`✅ Imported ${backupData.badHabits.length} bad habits`);

        // Step 3: Import insight reports using repository method
        await insightReportRepository.bulkInsert(backupData.insightReports);
        console.log(
          `✅ Imported ${backupData.insightReports.length} insight reports`
        );
      });

      console.log("✅ Data import completed successfully");
    } catch (error) {
      console.error("❌ Error importing data:", error);
      throw new Error(
        "Failed to import data. The backup file may be corrupted or invalid."
      );
    }
  }

  /**
   * Validates the structure and content of backup data
   */
  private validateBackupData(data: any): void {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid backup data: not an object");
    }

    if (!data.version || typeof data.version !== "string") {
      throw new Error("Invalid backup data: missing or invalid version");
    }

    if (!Array.isArray(data.badHabits)) {
      throw new Error("Invalid backup data: badHabits must be an array");
    }

    if (!Array.isArray(data.insightReports)) {
      throw new Error("Invalid backup data: insightReports must be an array");
    }

    // Validate bad habits structure
    for (const habit of data.badHabits) {
      if (!habit.name || typeof habit.name !== "string") {
        throw new Error("Invalid backup data: bad habit missing name");
      }
      if (!habit.datetime || typeof habit.datetime !== "number") {
        throw new Error("Invalid backup data: bad habit missing datetime");
      }
    }

    // Validate insight reports structure
    for (const report of data.insightReports) {
      if (!report.id || typeof report.id !== "number") {
        throw new Error("Invalid backup data: insight report missing id");
      }
      if (!report.title || typeof report.title !== "string") {
        throw new Error("Invalid backup data: insight report missing title");
      }
      if (!report.content || typeof report.content !== "string") {
        throw new Error("Invalid backup data: insight report missing content");
      }
      if (!report.createdAt || typeof report.createdAt !== "string") {
        throw new Error(
          "Invalid backup data: insight report missing createdAt"
        );
      }
    }
  }
}

/**
 * Clear All Bad Habits Use Case
 *
 * Deletes all habit logs from the database
 */
export class ClearAllBadHabitsUseCase {
  async execute(): Promise<void> {
    try {
      const badHabitRepository = new BadHabitRepository();
      await badHabitRepository.deleteAll();
      console.log("✅ All bad habits cleared successfully");
    } catch (error) {
      console.error("❌ Error clearing bad habits:", error);
      throw new Error("Failed to clear habit logs. Please try again.");
    }
  }
}

/**
 * Clear All Insight Reports Use Case
 *
 * Deletes all AI-generated insight reports from the database
 */
export class ClearAllInsightReportsUseCase {
  async execute(): Promise<void> {
    try {
      const insightReportRepository = new InsightReportRepository();
      await insightReportRepository.deleteAll();
      console.log("✅ All insight reports cleared successfully");
    } catch (error) {
      console.error("❌ Error clearing insight reports:", error);
      throw new Error("Failed to clear AI insights. Please try again.");
    }
  }
}
