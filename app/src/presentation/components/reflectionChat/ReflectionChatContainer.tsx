import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { useState, useEffect } from "react";
import { mainColors } from "../../../shared/constants/colors";
import ChatHeader from "./ChatHeader";
import ChatBubble from "./ChatBubble";
import MessageInputBox from "./MessageInputBox";
import TypingIndicator from "./TypingIndicator";

/**
 * Message interface for the chat
 */
export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

/**
 * ReflectionChatContainer - Main container component for the reflection chatbot UI
 *
 * Features:
 * - Organized chat layout with header, message list, and input
 * - Message history displayed in chronological order
 * - Automatic scroll to latest message
 * - Typing indicator when AI is responding
 * - Typewriter effect for AI messages
 * - Theme-consistent styling throughout
 *
 * Props:
 * - messages: Array of chat messages to display
 * - inputValue: Current input field text
 * - onInputChange: Callback when input text changes
 * - onSendMessage: Callback when send button is pressed
 * - isLoading: Boolean indicating if AI is processing
 * - reportTitle: Optional title of the insight report being reflected on
 *
 * Architecture: Presentation (Smart Component Container)
 */

interface ReflectionChatContainerProps {
  messages: ChatMessage[];
  inputValue: string;
  onInputChange: (text: string) => void;
  onSendMessage: () => void;
  isLoading?: boolean;
  reportTitle?: string;
}

function ReflectionChatContainer({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  isLoading = false,
  reportTitle,
}: ReflectionChatContainerProps) {
  // Track which message is currently being animated
  const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(
    null
  );

  // When new AI message arrives, start animating it
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Only animate AI messages
      if (lastMessage.sender === "ai" && !isLoading) {
        setAnimatingMessageId(lastMessage.id);
      }
    }
  }, [messages, isLoading]);

  /**
   * Render individual message item
   */
  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <ChatBubble
      message={item.content}
      sender={item.sender}
      timestamp={item.timestamp}
      isAnimating={animatingMessageId === item.id}
    />
  );

  /**
   * Render footer with typing indicator when loading
   */
  const renderFooter = () => {
    if (!isLoading) return null;
    return <TypingIndicator />;
  };

  /**
   * Empty state message
   */
  const renderEmpty = () => {
    if (messages.length > 0) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>🤔 Start Your Reflection</Text>
        <Text style={styles.emptySubtitle}>
          Ask questions about your insights and have a meaningful conversation
          with the AI to deepen your understanding of your habits.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <ChatHeader
          subtitle={reportTitle ? `Reflecting on: ${reportTitle}` : undefined}
        />

        {/* Messages List */}
        <View style={styles.messageListContainer}>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageListContent}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            onContentSizeChange={() => {
              // Optional: Auto-scroll to bottom on new messages
            }}
          />
        </View>

        {/* Input Area */}
        <MessageInputBox
          value={inputValue}
          onChangeText={onInputChange}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          placeholder="Share your thoughts and ask questions..."
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: mainColors.background,
  },
  container: {
    flex: 1,
    backgroundColor: mainColors.background,
  },
  messageListContainer: {
    flex: 1,
    backgroundColor: mainColors.background,
  },
  messageListContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: mainColors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: mainColors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default ReflectionChatContainer;
