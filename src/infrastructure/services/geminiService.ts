import axios, { AxiosInstance } from "axios";

/*
   Preferred Gemini Models:
   - gemini-2.0-flash-lite
   - gemini-2.0-flash
   - gemini-2.5-flash-lite-preview-06-17
*/

// NOTE: This public key is temporary
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY as string;
const MODEL_NAME = "gemini-2.5-flash-lite-preview-06-17";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

interface MessageHistory {
  role: string;
  text: string;
}

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role: string;
  parts: GeminiPart[];
}

interface GeminiCandidate {
  content: {
    parts: GeminiPart[];
  };
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
}

interface GeminiRequestBody {
  contents: GeminiContent[];
}

const geminiApi: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function generateText(prompt: string): Promise<string> {
  return await generateGeminiResponse([{ role: "user", text: prompt }]);
}

export async function generateTextWithHistory(
  messageHistory: MessageHistory[]
): Promise<string> {
  return await generateGeminiResponse(messageHistory);
}

async function generateGeminiResponse(
  messageHistory: MessageHistory[]
): Promise<string> {
  try {
    const requestBody: GeminiRequestBody = {
      contents: messageHistory.map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      })),
    };

    const response = await geminiApi.post<GeminiResponse>("", requestBody);
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
