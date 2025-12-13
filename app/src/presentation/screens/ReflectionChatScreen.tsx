import { useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import {
  ReflectionChatContainer,
  type ChatMessage,
} from "../components/reflectionChat";
import { InsightStackParamList } from "../navigation/InsightNavigator";
import { INSIGHT_NAVIGATION_ROUTES } from "../../shared/constants/navigation";

/**
 * ReflectionChatScreen - Main screen for the reflection chatbot feature
 *
 * Features:
 * - Chat interface for users to reflect on insights
 * - Message management (send/receive)
 * - Integration with AI service for generating responses
 * - Persistent message history during session
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

  /**
   * Handle sending a new message
   * TODO: Integrate with AI service to generate responses
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // TODO: Call AI service to get response
    // setIsLoading(true);
    // try {
    //   const aiResponse = await generateAIResponse(inputValue, reportId);
    //   const aiMessage: ChatMessage = {
    //     id: (Date.now() + 1).toString(),
    //     content: aiResponse,
    //     sender: "ai",
    //     timestamp: new Date().toISOString(),
    //   };
    //   setMessages((prev) => [...prev, aiMessage]);
    // } catch (error) {
    //   console.error("Error generating AI response:", error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <ReflectionChatContainer
      messages={messages}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      reportTitle="Your Insight Report"
    />
  );
}

export default ReflectionChatScreen;
