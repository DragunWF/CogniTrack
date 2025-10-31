import BadHabitRepository from "../../infrastructure/database/badHabitRepository";
import InsightGenerator from "../../infrastructure/ai/insightGenerator";

/**
 * GenerateInsightUseCase - Business logic for generating AI insights
 *
 * Orchestrates the process of:
 * 1. Fetching bad habit data within a date range
 * 2. Sending data to AI service for analysis
 * 3. Returning structured insight report
 *
 * Architecture Layer: Application (Use Case)
 */
export class GenerateInsightUseCase {
  private badHabitRepository: BadHabitRepository;
  private insightGenerator: InsightGenerator;

  constructor() {
    this.badHabitRepository = new BadHabitRepository();
    this.insightGenerator = new InsightGenerator();
  }

  /**
   * Execute the insight generation process
   * @param startDate - Start of analysis period (30 days before endDate)
   * @param endDate - End of analysis period (selected by user)
   * @returns Object containing title and markdown content
   */
  async execute(
    startDate: Date,
    endDate: Date
  ): Promise<{ title: string; content: string }> {
    try {
      // Fetch bad habits within date range
      const badHabits = await this.badHabitRepository.getByDateRange(
        startDate,
        endDate
      );

      // Check if there's enough data
      if (badHabits.length === 0) {
        return {
          title: "No Data Available",
          content: `# Insufficient Data\n\n## Analysis Period\n- Start: ${startDate.toLocaleDateString()}\n- End: ${endDate.toLocaleDateString()}\n\n## Summary\n\nNo bad habits were logged during this period. Keep tracking your habits to receive personalized insights!\n\n### Tips for Better Insights\n\n1. **Log consistently** - Track your habits daily for more accurate patterns\n2. **Add details** - Include triggers, locations, and notes for deeper analysis\n3. **Be honest** - Accurate logging leads to more helpful recommendations\n\n---\n\n*Start logging your habits to unlock AI-powered insights!*`,
        };
      }

      // Generate insights using AI
      const insights = await this.insightGenerator.generateInsights(
        badHabits,
        startDate,
        endDate
      );

      return insights;
    } catch (error) {
      console.error("Error in GenerateInsightUseCase:", error);
      throw error;
    }
  }
}
