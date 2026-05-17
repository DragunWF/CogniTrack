import { StyleSheet, View, Text } from "react-native";
import Markdown from "react-native-markdown-display";
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

  const isTypewriterActive =
    !isUserMessage &&
    isAnimating &&
    displayedText.length < message.trim().length;

  const markdownStyles = isUserMessage ? userMarkdownStyles : aiMarkdownStyles;

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
        {isTypewriterActive ? (
          <Text
            style={[
              styles.messageText,
              isUserMessage ? styles.userText : styles.aiText,
            ]}
          >
            {displayedText}
          </Text>
        ) : (
          <Markdown style={markdownStyles} rules={markdownRules}>
            {message}
          </Markdown>
        )}
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

const baseMarkdownStyles = {
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  code_inline: {
    backgroundColor: mainColors.backgroundCard,
    fontFamily: "monospace",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  code_block: {
    backgroundColor: mainColors.backgroundCard,
    fontFamily: "monospace",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  heading1: {
    fontSize: 20,
    fontWeight: "bold" as const,
    marginVertical: 8,
  },
  heading2: {
    fontSize: 18,
    fontWeight: "bold" as const,
    marginVertical: 6,
  },
  heading3: {
    fontSize: 16,
    fontWeight: "bold" as const,
    marginVertical: 4,
  },
  strong: {
    fontWeight: "bold" as const,
  },
  bullet_list: {
    marginVertical: 4,
  },
  list_item: {
    marginVertical: 2,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 12,
    lineHeight: 24,
  },
};

const userMarkdownStyles = {
  ...baseMarkdownStyles,
  body: {
    ...baseMarkdownStyles.body,
    color: mainColors.textOnPrimary,
  },
  code_inline: {
    ...baseMarkdownStyles.code_inline,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: mainColors.textOnPrimary,
  },
  code_block: {
    ...baseMarkdownStyles.code_block,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: mainColors.textOnPrimary,
  },
  heading1: { ...baseMarkdownStyles.heading1, color: mainColors.textOnPrimary },
  heading2: { ...baseMarkdownStyles.heading2, color: mainColors.textOnPrimary },
  heading3: { ...baseMarkdownStyles.heading3, color: mainColors.textOnPrimary },
  strong: { ...baseMarkdownStyles.strong, color: mainColors.textOnPrimary },
};

const aiMarkdownStyles = {
  ...baseMarkdownStyles,
  body: {
    ...baseMarkdownStyles.body,
    color: mainColors.textPrimary,
  },
  code_inline: {
    ...baseMarkdownStyles.code_inline,
    color: mainColors.textPrimary,
  },
  code_block: {
    ...baseMarkdownStyles.code_block,
    color: mainColors.textPrimary,
  },
  heading1: { ...baseMarkdownStyles.heading1, color: mainColors.textPrimary },
  heading2: { ...baseMarkdownStyles.heading2, color: mainColors.textPrimary },
  heading3: { ...baseMarkdownStyles.heading3, color: mainColors.textPrimary },
  strong: { ...baseMarkdownStyles.strong, color: mainColors.textPrimary },
};

const markdownRules = {
  softbreak: (node: any, children: any, parent: any, styles: any) => (
    <Text key={node.key}>{"\n"}</Text>
  ),
};

export default ChatBubble;
