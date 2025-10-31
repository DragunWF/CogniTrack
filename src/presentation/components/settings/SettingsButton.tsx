import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { mainColors, utilityColors } from "../../../shared/constants/colors";

/**
 * SettingsButton - Configurable button for settings actions
 *
 * Supports different visual styles (primary, danger, secondary).
 * Used for all actionable items in the settings screen.
 *
 * Architecture Layer: Presentation (UI Component)
 */

interface SettingsButtonProps {
  label: string;
  description?: string;
  icon?: string; // Emoji icon
  variant?: "primary" | "danger" | "secondary";
  onPress: () => void;
  disabled?: boolean;
}

function SettingsButton({
  label,
  description,
  icon,
  variant = "primary",
  onPress,
  disabled = false,
}: SettingsButtonProps) {
  const getButtonStyle = () => {
    if (disabled) return styles.buttonDisabled;
    switch (variant) {
      case "danger":
        return styles.buttonDanger;
      case "secondary":
        return styles.buttonSecondary;
      default:
        return styles.buttonPrimary;
    }
  };

  const getTextStyle = () => {
    if (disabled) return styles.textDisabled;
    switch (variant) {
      case "danger":
        return styles.textDanger;
      case "secondary":
        return styles.textSecondary;
      default:
        return styles.textPrimary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle()]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={styles.content}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <View style={styles.textContainer}>
          <Text style={[styles.label, getTextStyle()]}>{label}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: mainColors.border,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: mainColors.backgroundCard,
  },
  buttonSecondary: {
    backgroundColor: mainColors.backgroundCard,
  },
  buttonDanger: {
    backgroundColor: mainColors.backgroundCard,
  },
  buttonDisabled: {
    backgroundColor: mainColors.backgroundInput,
    opacity: 0.5,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  textPrimary: {
    color: mainColors.textPrimary,
  },
  textSecondary: {
    color: mainColors.textSecondary,
  },
  textDanger: {
    color: utilityColors.error500,
  },
  textDisabled: {
    color: mainColors.textMuted,
  },
  description: {
    fontSize: 13,
    color: mainColors.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
});

export default SettingsButton;
