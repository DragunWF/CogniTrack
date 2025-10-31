import * as SQLite from "expo-sqlite";
import getDatabase from "./coreStorage";
import InsightReport from "../../domain/entities/insightReport";
import IInsightReportRepository from "../../application/repositories/iInsightReportRepository";

export default class InsightReportRepository
  implements IInsightReportRepository
{
  public static tableName = "insightReports";

  // Column names
  public static id = "id";
  public static title = "title";
  public static content = "content";
  public static createdAt = "createdAt";
  public static notes = "notes";

  async create(insight: InsightReport): Promise<number> {
    try {
      const db = getDatabase();
      const result = await db.runAsync(
        `INSERT INTO ${InsightReportRepository.tableName} (
          ${InsightReportRepository.title}, 
          ${InsightReportRepository.content}, 
          ${InsightReportRepository.createdAt}
        ) VALUES (?, ?, ?);`,
        [insight.title, insight.content, insight.createdAt.getTime()]
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
        `UPDATE ${InsightReportRepository.tableName} 
         SET ${InsightReportRepository.title} = ?, 
             ${InsightReportRepository.content} = ?, 
             ${InsightReportRepository.createdAt} = ?, 
             ${InsightReportRepository.notes} = ? 
         WHERE ${InsightReportRepository.id} = ?;`,
        [
          insight.title,
          insight.content,
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
      await db.runAsync(
        `DELETE FROM ${InsightReportRepository.tableName} WHERE id = ?;`,
        [id]
      );
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
        `SELECT * FROM ${InsightReportRepository.tableName};`
      );
      console.log("✅ Retrieved all insight reports successfully");
      return results.map((row: any) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        createdAt: new Date(row.createdAt),
        notes: row.notes ?? "",
      }));
    } catch (err) {
      console.log("Error retrieving insight reports: ", err);
      throw err;
    }
  }

  async getById(id: number): Promise<InsightReport | null> {
    try {
      const db = getDatabase();
      const result = await db.getFirstAsync<any>(
        `SELECT * FROM ${InsightReportRepository.tableName} WHERE ${InsightReportRepository.id} = ?;`,
        [id]
      );
      if (result) {
        console.log("✅ Retrieved insight report successfully with ID: ", id);
        console.log("📄 Report data:", {
          id: result.id,
          title: result.title,
          contentLength: result.content?.length || 0,
          hasNotes: !!result.notes,
        });
        return {
          id: result.id,
          title: result.title,
          content: result.content,
          createdAt: new Date(result.createdAt),
          notes: result.notes ?? "",
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

  async getByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<InsightReport[]> {
    try {
      const db = getDatabase();
      const startTimestamp = startDate.getTime();
      const endTimestamp = endDate.getTime();

      const results = await db.getAllAsync<any>(
        `SELECT * FROM ${InsightReportRepository.tableName} 
         WHERE ${InsightReportRepository.createdAt} BETWEEN ? AND ?
         ORDER BY ${InsightReportRepository.createdAt} DESC;`,
        [startTimestamp, endTimestamp]
      );

      console.log(
        `✅ Retrieved ${results.length} insight reports for date range`
      );
      return results.map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        createdAt: new Date(row.createdAt),
        notes: row.notes ?? "",
      }));
    } catch (err) {
      console.log("Error retrieving insight reports by date range: ", err);
      throw err;
    }
  }

  async updateNotes(id: number, notes: string): Promise<void> {
    try {
      const db = getDatabase();
      await db.runAsync(
        `UPDATE ${InsightReportRepository.tableName} 
         SET ${InsightReportRepository.notes} = ? 
         WHERE ${InsightReportRepository.id} = ?;`,
        [notes, id]
      );
      console.log("✅ Notes updated successfully for report ID: ", id);
    } catch (err) {
      console.log("Error updating notes: ", err);
      throw err;
    }
  }

  /**
   * Delete all insight reports from the database
   * Used for clearing all data or importing backups
   */
  async deleteAll(): Promise<void> {
    try {
      const db = getDatabase();
      await db.runAsync(`DELETE FROM ${InsightReportRepository.tableName};`);
      console.log("✅ All insight reports deleted successfully");
    } catch (err) {
      console.log("Error deleting all insight reports: ", err);
      throw err;
    }
  }

  /**
   * Bulk insert insight reports (used for import operations)
   * @param reports - Array of insight reports to insert
   */
  async bulkInsert(
    reports: Array<{
      id: number;
      title: string;
      content: string;
      createdAt: string;
      notes?: string;
    }>
  ): Promise<void> {
    try {
      const db = getDatabase();
      for (const report of reports) {
        const createdAtTimestamp = new Date(report.createdAt).getTime();
        await db.runAsync(
          `INSERT INTO ${InsightReportRepository.tableName} (
            ${InsightReportRepository.id},
            ${InsightReportRepository.title},
            ${InsightReportRepository.content},
            ${InsightReportRepository.createdAt},
            ${InsightReportRepository.notes}
          ) VALUES (?, ?, ?, ?, ?);`,
          [
            report.id,
            report.title,
            report.content,
            createdAtTimestamp,
            report.notes || null,
          ]
        );
      }
      console.log(`✅ Bulk inserted ${reports.length} insight reports`);
    } catch (err) {
      console.log("Error bulk inserting insight reports: ", err);
      throw err;
    }
  }
}
