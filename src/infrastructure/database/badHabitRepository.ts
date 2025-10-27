import * as SQLite from "expo-sqlite";
import getDatabase from "./coreStorage";
import BadHabit from "../../domain/interfaces/badHabit";

/*
    This primarily concerns the CRUD operations for the bad habits table
*/

export interface BadHabitRepository {
  create(badHabit: BadHabit): Promise<number>;
  update(badHabit: BadHabit): Promise<boolean>;
  delete(id: number): Promise<void>;
  getAll(): Promise<BadHabit[]>;
  getById(id: number): Promise<BadHabit | null>;
}

export class BadHabitRepository implements BadHabitRepository {
  async create(badHabit: BadHabit): Promise<number> {
    try {
      const db = getDatabase();
      const result = await db.runAsync(
        `INSERT INTO bad_habits (name, description, date_and_time, notes) VALUES (?, ?, ?, ?);`,
        [
          badHabit.name,
          badHabit.description,
          badHabit.date_and_time,
          badHabit.notes ? badHabit.notes : null,
        ]
      );
      console.log(
        "✅ Bad habit created successfully with ID: ",
        result.lastInsertRowId
      );
      return result.lastInsertRowId;
    } catch (err) {
      console.log("Error creating bad habit: ", err);
      throw err;
    }
  }

  async update(badHabit: BadHabit): Promise<boolean> {
    try {
      const db = getDatabase();
      const result = await db.runAsync(
        `UPDATE bad_habits SET name = ?, description = ?, date_and_time = ?, notes = ? WHERE id = ?;`,
        [
          badHabit.name,
          badHabit.description,
          badHabit.date_and_time,
          badHabit.notes ? badHabit.notes : null,
          badHabit.id,
        ]
      );
      console.log("✅ Bad habit updated successfully with ID: ", badHabit.id);
      return result.changes > 0;
    } catch (err) {
      console.log("Error updating bad habit: ", err);
      throw err;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const db = getDatabase();
      await db.runAsync(`DELETE FROM bad_habits WHERE id = ?;`, [id]);
      console.log("✅ Bad habit deleted successfully with ID: ", id);
    } catch (err) {
      console.log("Error deleting bad habit: ", err);
      throw err;
    }
  }

  async getAll(): Promise<BadHabit[]> {
    try {
      const db = getDatabase();
      const results = await db.allAsync(`SELECT * FROM bad_habits;`);
      return results as BadHabit[];
    } catch (err) {
      console.log("Error retrieving bad habits: ", err);
      throw err;
    }
  }

  async getById(id: number): Promise<BadHabit | null> {
    try {
      const db = getDatabase();
      const results = await db.allAsync(
        `SELECT * FROM bad_habits WHERE id = ?;`,
        [id]
      );
      if (results.length > 0) {
        return results[0] as BadHabit;
      } else {
        return null;
      }
    } catch (err) {
      console.log("Error retrieving bad habit by ID: ", err);
      throw err;
    }
  }
}
