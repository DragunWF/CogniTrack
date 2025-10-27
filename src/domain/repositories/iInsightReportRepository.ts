import InsightReport from "../entities/insightReport";

export default interface IInsightReportRepository {
  create(insightReport: Omit<InsightReport, "id">): Promise<number>;
  update(insightReport: InsightReport): Promise<boolean>;
  delete(id: number): Promise<void>;
  getAll(): Promise<InsightReport[]>;
  getById(id: number): Promise<InsightReport | null>;
}
