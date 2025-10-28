import InsightReport from "../../domain/entities/insightReport";

export default interface IInsightReportRepository {
  create(insightReport: InsightReport): Promise<number>;
  update(insightReport: InsightReport): Promise<boolean>;
  delete(id: number): Promise<void>;
  getAll(): Promise<InsightReport[]>;
  getById(id: number): Promise<InsightReport | null>;
}
