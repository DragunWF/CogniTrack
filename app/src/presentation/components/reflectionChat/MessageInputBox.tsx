import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Text as RNText,
} from "react-native";
import { mainColors } from "../../../shared/constants/colors";

/**
 * MessageInputBox - Input component for user messages in the reflection chatbot
 *
 * Features:
 * - Text input field with placeholder and theme-matched styling
 * - Send button that calls onSendMessage callback
 * - Loading state to disable input while message is being processed
 * - Accessible and responsive design with proper touch feedback
 *
 * Props:
 * - value: Current input text value
 * - onChangeText: Callback when text changes
 * - onSendMessage: Callback when send button is pressed
 * - isLoading: Boolean to disable input during processing
 * - placeholder: Optional custom placeholder text
 *
 * Architecture: Presentation (Dumb Component)
 */

interface MessageInputBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  onSendMessage: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

function MessageInputBox({
  value,
  onChangeText,
  onSendMessage,
  isLoading = false,
  placeholder = "Share your thoughts...",
}: MessageInputBoxProps) {
  const isSendDisabled = !value.trim() || isLoading;

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={mainColors.textMuted}
          value={value}
          onChangeText={onChangeText}
          editable={!isLoading}
          multiline
          maxLength={1000}
          numberOfLines={1}
          textAlignVertical="center"
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            isSendDisabled && styles.sendButtonDisabled,
          ]}
          onPress={onSendMessage}
          disabled={isSendDisabled}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={mainColors.textOnPrimary} />
          ) : (
            <SendIcon />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * SendIcon - Simple SVG-based send icon
 * Renders a paper plane icon for the send button
 */
function SendIcon() {
  return (
    <View style={styles.iconContainer}>
      <RNText style={styles.iconText}>➤</RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: mainColors.background,
    borderTopWidth: 1,
    borderTopColor: mainColors.border,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: mainColors.backgroundCard,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: mainColors.borderActive,
  },
  input: {
    flex: 1,
    color: mainColors.textPrimary,
    fontSize: 14,
    paddingVertical: 8,
    paddingRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 35,
    borderRadius: 20,
    backgroundColor: mainColors.primary500,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 18,
    color: mainColors.textOnPrimary,
  },
});

export default MessageInputBox;
