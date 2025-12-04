import axios, { AxiosInstance } from "axios";
import {
  MessageHistory,
  GeminiPart,
  GeminiContent,
  GeminiCandidate,
  GeminiResponse,
  GeminiRequestBody,
  AIService,
} from "../../application/services/geminiServiceInterfaces";

/*
   Preferred Gemini Models:
   - gemini-2.0-flash-lite
   - gemini-2.0-flash
   - gemini-2.5-flash-lite-preview-06-17
*/

// NOTE: This public key is temporary
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY as string;
const MODEL_NAME = "gemini-2.0-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

export class GeminiService implements AIService {
  private geminiApi: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  async generateText(messages: MessageHistory[]): Promise<string> {
    return await this.generateGeminiResponse(messages);
  }

  async generateTextWithHistory(
    messageHistory: MessageHistory[]
  ): Promise<string> {
    return await this.generateGeminiResponse(messageHistory);
  }

  private async generateGeminiResponse(
    messageHistory: MessageHistory[]
  ): Promise<string> {
    try {
      const requestBody: GeminiRequestBody = {
        contents: messageHistory.map((message) => ({
          role: message.role,
          parts: [{ text: message.text }],
        })),
      };

      const response = await this.geminiApi.post<GeminiResponse>(
        "",
        requestBody
      );
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error generating text:",
          error.response ? error.response.data : error.message
        );
      } else {
        console.error("Unexpected error for generating text:", error);
      }
      throw error; // Re-throw to handle upstream
    }
  }
}
