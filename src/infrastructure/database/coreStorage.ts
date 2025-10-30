import * as SQLite from "expo-sqlite";

/**
 * Core database instance for InkSight app
 * Initialized lazily when initDatabase() is called
 */
let db: SQLite.SQLiteDatabase | null = null;

/**
 * Table names - Centralized to avoid circular dependency issues
 * These constants should match the tableName static properties in repository classes
 */
export const TABLE_NAMES = {
  badHabits: "badHabits",
  insightReports: "insightReports",
} as const;

/**
 * Initializes the database and schema
 * Opens the SQLite database and creates tables if they don't exist
 * MUST be called before any database operations
 */
export async function initDatabase() {
  try {
    // Open database if not already opened
    if (!db) {
      db = await SQLite.openDatabaseAsync("cognitrack.db");
      console.log("✅ Database opened successfully");
    }

    // Create tables
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${TABLE_NAMES.badHabits} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        datetime INTEGER NOT NULL,
        location TEXT,
        trigger TEXT,
        notes TEXT
      );
    `);
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS ${TABLE_NAMES.insightReports} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        notes TEXT
      );
    `);

    console.log("✅ Database schema initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

/**
 * Returns the database instance for direct queries
 * Throws an error if database hasn't been initialized
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return db;
}

export async function resetDatabase(): Promise<void> {
  console.log("Resetting database...");
  for (let tableName of Object.values(TABLE_NAMES)) {
    await db?.execAsync(`DROP TABLE IF EXISTS ${tableName};`);
    console.log(`Dropped table if existed: ${tableName}`);
  }
  console.log("Database reset complete.");
}

export default getDatabase;
