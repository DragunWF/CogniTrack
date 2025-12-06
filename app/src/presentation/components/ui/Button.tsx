import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { mainColors, utilityColors } from "../../../shared/constants/colors";

/**
 * Button Component
 *
 * A reusable button component with multiple variants.
 * Supports primary, secondary, and danger styles.
 *
 * @param title - Button text
 * @param onPress - Callback when pressed
 * @param variant - Visual style: 'primary' | 'secondary' | 'danger'
 * @param disabled - Whether button is disabled
 * @param loading - Shows loading spinner instead of text
 * @param style - Optional additional styles
 */

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  loading?: boolean;
  style?: object;
}

function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const getButtonStyle = () => {
    if (disabled) return styles.buttonDisabled;

    switch (variant) {
      case "secondary":
        return styles.buttonSecondary;
      case "danger":
        return styles.buttonDanger;
      default:
        return styles.buttonPrimary;
    }
  };

  const getTextStyle = () => {
    if (disabled) return styles.textDisabled;

    switch (variant) {
      case "secondary":
        return styles.textSecondary;
      default:
        return styles.textPrimary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "secondary"
              ? mainColors.primary500
              : mainColors.textOnPrimary
          }
        />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  buttonPrimary: {
    backgroundColor: mainColors.primary500,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: mainColors.border,
  },
  buttonDanger: {
    backgroundColor: utilityColors.error700,
  },
  buttonDisabled: {
    backgroundColor: mainColors.backgroundInput,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  textPrimary: {
    color: mainColors.textOnPrimary,
  },
  textSecondary: {
    color: mainColors.textPrimary,
  },
  textDisabled: {
    color: mainColors.textMuted,
  },
});

export default Button;
