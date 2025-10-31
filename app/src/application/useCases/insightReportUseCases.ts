import InsightReport from "../../domain/entities/insightReport";
import InsightReportRepository from "../../infrastructure/database/insightReportRepository";

export class CreateInsightReportUseCase {
  async execute(insightData: InsightReport): Promise<number> {
    const insightReportRepository = new InsightReportRepository();
    const newInsightId = await insightReportRepository.create(insightData);
    return newInsightId;
  }
}

export class UpdateInsightReportUseCase {
  async execute(insightData: InsightReport): Promise<boolean> {
    const insightReportRepository = new InsightReportRepository();
    const success = await insightReportRepository.update(insightData);
    return success;
  }
}

export class DeleteInsightReportUseCase {
  async execute(insightId: number): Promise<void> {
    const insightReportRepository = new InsightReportRepository();
    await insightReportRepository.delete(insightId);
  }
}

export class GetAllInsightReportsUseCase {
  async execute(): Promise<InsightReport[]> {
    const insightReportRepository = new InsightReportRepository();
    const insights = await insightReportRepository.getAll();
    return insights;
  }
}

export class GetInsightReportByIdUseCase {
  async execute(insightId: number): Promise<InsightReport | null> {
    const insightReportRepository = new InsightReportRepository();
    const insight = await insightReportRepository.getById(insightId);
    return insight;
  }
}

export class GetInsightReportsByDateRangeUseCase {
  async execute(startDate: Date, endDate: Date): Promise<InsightReport[]> {
    const insightReportRepository = new InsightReportRepository();
    const insights = await insightReportRepository.getByDateRange(
      startDate,
      endDate
    );
    return insights;
  }
}

export class UpdateInsightNotesUseCase {
  async execute(insightId: number, notes: string): Promise<void> {
    const insightReportRepository = new InsightReportRepository();
    await insightReportRepository.updateNotes(insightId, notes);
  }
}
