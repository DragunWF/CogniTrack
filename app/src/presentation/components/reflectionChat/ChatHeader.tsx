import { StyleSheet, View, Text } from "react-native";
import { mainColors } from "../../../shared/constants/colors";

/**
 * ChatHeader - Header component for the reflection chatbot screen
 *
 * Displays:
 * - Chat title/heading
 * - Description of the chatbot's purpose
 * - Optional subtitle with habit or insight reference
 *
 * Props:
 * - title: Main heading text
 * - subtitle: Optional subtitle or context information
 * - description: Optional description of the chatbot purpose
 *
 * Architecture: Presentation (Dumb Component)
 */

interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

function ChatHeader({
  title = "Reflection Chatbot",
  subtitle,
  description = "Chat with an AI assistant to reflect deeply on your insights and habits",
}: ChatHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: mainColors.backgroundElevated,
    borderBottomWidth: 1,
    borderBottomColor: mainColors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: mainColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: mainColors.textSecondary,
    marginBottom: 8,
    fontWeight: "500",
  },
  description: {
    fontSize: 12,
    color: mainColors.textMuted,
    lineHeight: 16,
  },
});

export default ChatHeader;
