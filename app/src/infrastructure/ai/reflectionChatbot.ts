import { GeminiService } from "../services/geminiService";
import {
  reflectionChatbotPrompt,
  reflectionChatbotPromptPlaceholders,
} from "./prompts";
import { GetInsightReportByIdUseCase } from "../../application/useCases/insightReportUseCases";

export async function formatInitialBehaviorPrompt(insightReportId: number) {
  const insightReport = new GetInsightReportByIdUseCase().execute(
    insightReportId
  );

  return insightReport.then((report) => {
    if (!report) {
      throw new Error("Insight report not found");
    }

    return reflectionChatbotPrompt.replace(
      reflectionChatbotPromptPlaceholders.insightReport,
      JSON.stringify({
        title: report.title,
        content: report.content,
        createdAt: report.createdAt,
      })
    );
  });
}

export async function generateResponse(userMessage: string) {}
