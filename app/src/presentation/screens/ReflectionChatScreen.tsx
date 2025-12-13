import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import {
  ReflectionChatContainer,
  type ChatMessage,
} from "../components/reflectionChat";
import { InsightStackParamList } from "../navigation/InsightNavigator";
import { INSIGHT_NAVIGATION_ROUTES } from "../../shared/constants/navigation";
import { GetInsightReportByIdUseCase } from "../../application/useCases/insightReportUseCases";
import { reflectionChatbotPrompt } from "../../infrastructure/ai/prompts";
import { GeminiService } from "../../infrastructure/services/geminiService";
import InsightReport from "../../domain/entities/insightReport";
import { MessageHistory } from "../../application/services/geminiServiceInterfaces";

/**
 * ReflectionChatScreen - Main screen for the reflection chatbot feature
 *
 * Features:
 * - Chat interface for users to reflect on insights
 * - Message management (send/receive)
 * - Integration with AI service for generating responses
 * - Persistent message history during session
 * - System prompt initialization with insight report context
 *
 * Navigation:
 * - Receives reportId via route params
 * - Used to provide context for AI responses
 *
 * Architecture Layer: Presentation (Screen Component)
 */

type ReflectionChatScreenProps = StackScreenProps<
  InsightStackParamList,
  typeof INSIGHT_NAVIGATION_ROUTES.REFLECTION_CHATBOT
>;

function ReflectionChatScreen({ route }: ReflectionChatScreenProps) {
  const { reportId } = route.params;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [insightReport, setInsightReport] = useState<InsightReport | null>(
    null
  );
  const [systemPrompt, setSystemPrompt] = useState<string>("");

  const geminiService = new GeminiService();

  /**
   * Load insight report on component mount
   */
  useEffect(() => {
    const loadInsightReport = async () => {
      try {
        const useCase = new GetInsightReportByIdUseCase();
        const report = await useCase.execute(reportId);

        if (!report) {
          Alert.alert("Error", "Insight report not found");
          return;
        }

        setInsightReport(report);

        // Initialize system prompt with the report data
        const reportJson = JSON.stringify({
          title: report.title,
          content: report.content,
          createdAt: report.createdAt,
        });

        const initialPrompt = reflectionChatbotPrompt.replace(
          "{insightReport}",
          reportJson
        );
        setSystemPrompt(initialPrompt);
      } catch (error) {
        console.error("Error loading insight report:", error);
        Alert.alert("Error", "Failed to load insight report");
      }
    };

    loadInsightReport();
  }, [reportId]);

  /**
   * Construct message history for the API call
   * Includes system prompt followed by conversation history
   */
  const constructMessageHistory = (userMessage: string): MessageHistory[] => {
    // Start with the system prompt
    const history: MessageHistory[] = [
      {
        role: "user",
        text: systemPrompt,
      },
      {
        role: "model",
        text: "I understand. I'm ready to help you reflect on your insights using the Atomic Habits framework and evidence-based coaching strategies. What would you like to discuss?",
      },
    ];

    // Add previous conversation messages
    messages.forEach((msg) => {
      history.push({
        role: msg.sender === "user" ? "user" : "model",
        text: msg.content,
      });
    });

    // Add the current user message
    history.push({
      role: "user",
      text: userMessage,
    });

    return history;
  };

  /**
   * Handle sending a new message
   * Integrates with Gemini API for AI response generation
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !systemPrompt) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    // Add user message to chat immediately
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Construct the full message history with system prompt
      const messageHistory = constructMessageHistory(inputValue);

      // Call Gemini API
      const aiResponseText = await geminiService.generateTextWithHistory(
        messageHistory
      );

      // Create AI response message
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponseText,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };

      // Add AI message to chat
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating AI response:", error);

      // Show user-friendly error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        content:
          "Unable to connect to the AI coach. Please check your connection and try again.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReflectionChatContainer
      messages={messages}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      reportTitle={insightReport?.title || "Your Insight Report"}
    />
  );
}

export default ReflectionChatScreen;
