import React from "react";
import { StyleSheet, TextInput as RNTextInput, View, Text } from "react-native";
import { mainColors } from "../../../shared/constants/colors";

/**
 * TextInput Component
 *
 * A styled text input field with label and error message support.
 * Optimized for dark theme with proper contrast.
 *
 * @param label - Optional label above input
 * @param value - Current input value
 * @param onChangeText - Callback when text changes
 * @param placeholder - Placeholder text
 * @param error - Error message to display
 * @param multiline - Whether input supports multiple lines
 * @param numberOfLines - Number of lines for multiline input
 * @param style - Optional additional container styles
 * @param ...rest - All other TextInput props
 */

interface TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: object;
  [key: string]: any; // For spreading remaining TextInput props
}

function TextInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  numberOfLines = 1,
  style,
  ...rest
}: TextInputProps) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <RNTextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={mainColors.textMuted}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        textAlignVertical={multiline ? "top" : "center"}
        {...rest}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: mainColors.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: mainColors.backgroundInput,
    borderWidth: 1.5,
    borderColor: mainColors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: mainColors.textPrimary,
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: 14,
  },
  inputError: {
    borderColor: mainColors.primary500, // Using primary for consistency
  },
  errorText: {
    fontSize: 12,
    color: mainColors.primary500,
    marginTop: 6,
    marginLeft: 4,
  },
});

export default TextInput;
