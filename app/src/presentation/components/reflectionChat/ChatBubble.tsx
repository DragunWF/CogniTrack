import { StyleSheet, View, Text } from "react-native";
import { mainColors } from "../../../shared/constants/colors";
import { useTypewriter } from "../../hooks/useTypewriter";

/**
 * ChatBubble - Individual message bubble component for the reflection chatbot
 *
 * Displays a message with distinct styling based on who sent it (user or AI).
 * User messages appear on the right with primary color, AI messages appear on the left
 * with a neutral card background.
 *
 * AI messages include a typewriter effect for a more engaging experience.
 *
 * Props:
 * - message: The text content of the message
 * - sender: "user" | "ai" - Determines styling and alignment
 * - timestamp: Optional ISO timestamp string for message creation
 * - isAnimating: Whether the message is currently being animated (default: false)
 *
 * Architecture: Presentation (Dumb Component)
 */

interface ChatBubbleProps {
  message: string;
  sender: "user" | "ai";
  timestamp?: string;
  isAnimating?: boolean;
}

function ChatBubble({
  message,
  sender,
  timestamp,
  isAnimating = false,
}: ChatBubbleProps) {
  const isUserMessage = sender === "user";

  // Apply typewriter effect only to AI messages that are currently animating
  const displayedText = useTypewriter(
    message,
    12, // Delay: 30ms per character (lower delay = faster typing speed)
    !isUserMessage && isAnimating, // Enable for AI messages only when animating
  ).trim();

  /**
   * Format timestamp to readable time format
   * e.g., "2:45 PM" or "14:45"
   */
  const formatTime = (isoString?: string): string => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <View
      style={[
        styles.bubbleContainer,
        isUserMessage ? styles.userContainer : styles.aiContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isUserMessage ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUserMessage ? styles.userText : styles.aiText,
          ]}
        >
          {displayedText}
        </Text>
      </View>
      {timestamp && (
        <Text
          style={[
            styles.timestamp,
            isUserMessage ? styles.userTimestamp : styles.aiTimestamp,
          ]}
        >
          {formatTime(timestamp)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: "flex-end",
  },
  aiContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "85%",
  },
  userBubble: {
    backgroundColor: mainColors.primary500,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: mainColors.backgroundCard,
    borderWidth: 1,
    borderColor: mainColors.border,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: mainColors.textOnPrimary,
  },
  aiText: {
    color: mainColors.textPrimary,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  userTimestamp: {
    color: mainColors.textMuted,
  },
  aiTimestamp: {
    color: mainColors.textMuted,
  },
});

export default ChatBubble;
