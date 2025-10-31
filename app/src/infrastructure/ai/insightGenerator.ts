import { insightGenerationPrompt } from "./prompts";
import { GeminiService } from "../services/geminiService";
import BadHabit from "../../domain/entities/badHabit";

/**
 * InsightGenerator - Generates AI-powered insights from bad habit data
 *
 * Uses Google's Gemini API to analyze user's habit patterns and provide
 * actionable recommendations based on the Atomic Habits framework.
 *
 * Architecture Layer: Infrastructure (AI Service)
 */
export default class InsightGenerator {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  /**
   * Generate AI insights from bad habit data
   * @param badHabits - Array of bad habits from the analysis period
   * @param startDate - Start date of the analysis period (for context)
   * @param endDate - End date of the analysis period (for context)
   * @returns JSON object with title and markdown content
   */
  async generateInsights(
    badHabits: BadHabit[],
    startDate: Date,
    endDate: Date
  ): Promise<{ title: string; content: string }> {
    try {
      // Transform bad habits data to match prompt format
      const habitData = badHabits.map((habit) => ({
        name: habit.name,
        date_time: new Date(habit.datetime).toISOString(),
        location: habit.location || "Not specified",
        trigger: habit.trigger || "Not specified",
        notes: habit.notes || "",
      }));

      // Replace {data} placeholder in prompt with actual data
      const promptWithData = insightGenerationPrompt.replace(
        "{data}",
        JSON.stringify(habitData, null, 2)
      );

      // Call Gemini API
      const response = await this.geminiService.generateText([
        {
          role: "user",
          text: promptWithData,
        },
      ]);

      // Parse JSON response
      const parsedResponse = this.parseAIResponse(response);
      console.log("✅ Parsed AI Response:", {
        title: parsedResponse.title,
        contentLength: parsedResponse.content.length,
        contentPreview: parsedResponse.content.substring(0, 100) + "...",
      });
      return parsedResponse;
    } catch (error) {
      console.error("Error generating insights:", error);
      throw new Error("Failed to generate AI insights. Please try again.");
    }
  }

  /**
   * Parse and validate AI response
   * Handles potential markdown code blocks or extra text
   */
  private parseAIResponse(response: string): {
    title: string;
    content: string;
  } {
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = response.trim();

      // Remove ```json ... ``` wrapper if present
      if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*\n?/, "");
        cleanedResponse = cleanedResponse.replace(/\n?```\s*$/, "");
      }

      // Parse JSON
      const parsed = JSON.parse(cleanedResponse);

      // Validate required fields
      if (!parsed.title || !parsed.content) {
        throw new Error("Invalid response format: missing title or content");
      }

      return {
        title: parsed.title,
        content: parsed.content,
      };
    } catch (error) {
      console.error("Error parsing AI response:", error);
      console.error("Raw response:", response);

      // Return fallback content
      return {
        title: "Insight Generation Error",
        content:
          "# Unable to Generate Insights\n\nWe encountered an issue while analyzing your habit data. Please try again later.",
      };
    }
  }
}
