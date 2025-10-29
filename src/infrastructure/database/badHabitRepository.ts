import * as SQLite from "expo-sqlite";
import getDatabase from "./coreStorage";
import BadHabit from "../../domain/entities/badHabit";
import IBadHabitRepository from "../../application/repositories/iBadHabitRepository";

export default class BadHabitRepository implements IBadHabitRepository {
  private static tableName = "badHabits";

  async create(badHabit: BadHabit): Promise<number> {
    try {
      const db = getDatabase();

      const randomId = await this.generateRandomId();
      badHabit.id = randomId;
      const result = await db.runAsync(
        `INSERT INTO ${BadHabitRepository.tableName} (id, name, description, datetime, notes) VALUES (?, ?, ?, ?, ?);`,
        [
          badHabit.id,
          badHabit.name,
          badHabit.description,
          badHabit.datetime,
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
      if (!badHabit.id) {
        throw new Error("Bad habit ID is required for update");
      }

      const db = getDatabase();
      const result = await db.runAsync(
        `UPDATE ${BadHabitRepository.tableName} SET name = ?, description = ?, datetime = ?, notes = ? WHERE id = ?;`,
        [
          badHabit.name,
          badHabit.description,
          badHabit.datetime,
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
      await db.runAsync(
        `DELETE FROM ${BadHabitRepository.tableName} WHERE id = ?;`,
        [id]
      );
      console.log("✅ Bad habit deleted successfully with ID: ", id);
    } catch (err) {
      console.log("Error deleting bad habit: ", err);
      throw err;
    }
  }

  async getAll(): Promise<BadHabit[]> {
    try {
      const db = getDatabase();
      const results = await db.getAllAsync<BadHabit>(
        `SELECT * FROM badHabits;`
      );
      return results as BadHabit[];
    } catch (err) {
      console.log("Error retrieving bad habits: ", err);
      throw err;
    }
  }

  async getAllToday(): Promise<BadHabit[]> {
    try {
      const db = getDatabase();
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const results = await db.getAllAsync<BadHabit>(
        `SELECT * FROM ${BadHabitRepository.tableName} WHERE datetime BETWEEN ? AND ?;`,
        [startOfDay.getTime(), endOfDay.getTime()]
      );
      return results as BadHabit[];
    } catch (err) {
      console.log("Error retrieving today's bad habits: ", err);
      throw err;
    }
  }

  async getById(id: number): Promise<BadHabit | null> {
    try {
      const db = getDatabase();
      const results = await db.getAllAsync<BadHabit>(
        `SELECT * FROM badHabits WHERE id = ?;`,
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

  // Utility method to generate a random ID
  async generateRandomId(): Promise<number> {
    const randomId = Math.floor(Math.random() * 1000000);
    const db = getDatabase();
    const existing = await db.getAllAsync<BadHabit>(
      `SELECT * FROM badHabits WHERE id = ?;`,
      [randomId]
    );
    if (existing.length > 0) {
      return this.generateRandomId(); // Recursively generate a new ID
    }
    return randomId;
  }

  async isNameUnique(name: string): Promise<boolean> {
    try {
      const db = getDatabase();
      const results = await db.getAllAsync<BadHabit>(
        `SELECT * FROM ${BadHabitRepository.tableName} WHERE name = ?;`,
        [name]
      );
      return results.length === 0;
    } catch (err) {
      console.log("Error checking name uniqueness: ", err);
      throw err;
    }
  }
}
