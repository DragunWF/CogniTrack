import * as SQLite from "expo-sqlite";

/**
 * Core database instance for InkSight app
 * Initialized lazily when initDatabase() is called
 */
let db: SQLite.SQLiteDatabase | null = null;

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
      CREATE TABLE IF NOT EXISTS badHabits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        datetime INTEGER NOT NULL,
        notes TEXT
      );
    `);
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS insightReports (
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

export default getDatabase;
