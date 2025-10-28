export interface AIService {
  generateText(messages: MessageHistory[]): Promise<string>;
  generateTextWithHistory(messageHistory: MessageHistory[]): Promise<string>;
}

export interface MessageHistory {
  role: string;
  text: string;
}

export interface GeminiPart {
  text: string;
}

export interface GeminiContent {
  role: string;
  parts: GeminiPart[];
}

export interface GeminiCandidate {
  content: {
    parts: GeminiPart[];
  };
}

export interface GeminiResponse {
  candidates: GeminiCandidate[];
}

export interface GeminiRequestBody {
  contents: GeminiContent[];
}
