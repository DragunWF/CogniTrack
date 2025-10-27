import * as SQLite from "expo-sqlite";
import getDatabase from "./coreStorage";
import BadHabit from "../../domain/interfaces/badHabit";

/*
    This primarily concerns the CRUD operations for the bad habits table
*/

export async function createBadHabit(badHabit: BadHabit) {
  try {
    const db = getDatabase();
    const result = await db.runAsync(
      `INSERT INTO bad_habits (name, description, date_and_time, notes) VALUES (?, ?, ?, ?);`,
      [
        badHabit.name,
        badHabit.description,
        badHabit.date_and_time,
        badHabit.notes,
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

export async function updateBadHabit(
  badHabit: BadHabit
): Promise<BadHabit> {
  try {
    const db = getDatabase();
    const result = await db.runAsync(
      `UPDATE bad_habits SET name = ?, description = ?, date_and_time = ?, notes = ? WHERE id = ?;`,
      [
        badHabit.name,
        badHabit.description,
        badHabit.date_and_time,
        badHabit.notes,
        badHabit.id,
      ]
    );
    console.log("✅ Bad habit updated successfully with ID: ", badHabit.id);
    return result;
  } catch (err) {
    console.log("Error updating bad habit: ", err);
    throw err;
  }
}

export async function deleteBadHabit(id: number) {
  try {
    const db = getDatabase();
    await db.runAsync(`DELETE FROM bad_habits WHERE id = ?;`, [id]);
    console.log("✅ Bad habit deleted successfully with ID: ", id);
  } catch (err) {
    console.log("Error deleting bad habit: ", err);
    throw err;
  }
}

// export async function getBadHabits(): Promise<BadHabit[]> {}
