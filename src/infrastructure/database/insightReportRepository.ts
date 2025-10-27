import * as SQLite from "expo-sqlite";
import getDatabase from "./coreStorage";
import InsightReport from "../../domain/entities/insightReport";
import IInsightReportRepository from "../../domain/repositories/IInsightReportRepository";

export default class InsightReportRepository
  implements IInsightReportRepository
{
  async create(insight: InsightReport): Promise<number> {
    try {
      const db = getDatabase();
      const result = await db.runAsync(
        `INSERT INTO insight_reports (title, description, created_at) VALUES (?, ?, ?);`,
        [insight.title, insight.description, insight.createdAt.getTime()]
      );
      console.log(
        "✅ Insight report created successfully with ID: ",
        result.lastInsertRowId
      );
      return result.lastInsertRowId;
    } catch (err) {
      console.log("Error creating insight report: ", err);
      throw err;
    }
  }

  async update(insight: InsightReport): Promise<boolean> {
    try {
      const db = getDatabase();
      const result = await db.runAsync(
        `UPDATE insight_reports SET title = ?, description = ?, created_at = ?, notes = ? WHERE id = ?;`,
        [
          insight.title,
          insight.description,
          insight.createdAt.getTime(),
          insight.notes ? insight.notes : null,
          insight.id,
        ]
      );
      console.log(
        "✅ Insight report updated successfully with ID: ",
        insight.id
      );
      return result.changes > 0;
    } catch (err) {
      console.log("Error updating insight report: ", err);
      throw err;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const db = getDatabase();
      await db.runAsync(`DELETE FROM insight_reports WHERE id = ?;`, [id]);
      console.log("✅ Insight report deleted successfully with ID: ", id);
    } catch (err) {
      console.log("Error deleting insight report: ", err);
      throw err;
    }
  }

  async getAll(): Promise<InsightReport[]> {
    try {
      const db = getDatabase();
      const results = await db.getAllAsync<InsightReport>(
        `SELECT * FROM insight_reports;`
      );
      console.log("✅ Retrieved all insight reports successfully");
      return results.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        createdAt: new Date(row.createdAt),
      }));
    } catch (err) {
      console.log("Error retrieving insight reports: ", err);
      throw err;
    }
  }

  async getById(id: number): Promise<InsightReport | null> {
    try {
      const db = getDatabase();
      const result = await db.getFirstAsync<InsightReport>(
        `SELECT * FROM insight_reports WHERE id = ?;`,
        [id]
      );
      if (result) {
        console.log("✅ Retrieved insight report successfully with ID: ", id);
        return {
          id: result.id,
          title: result.title,
          description: result.description,
          createdAt: new Date(result.createdAt),
        };
      } else {
        console.log("⚠️ No insight report found with ID: ", id);
        return null;
      }
    } catch (err) {
      console.log("Error retrieving insight report: ", err);
      throw err;
    }
  }
}
