import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { mainColors } from "../../../shared/constants/colors";

/**
 * FloatingActionButton (FAB)
 *
 * A circular floating action button positioned in the bottom-right corner.
 * Commonly used for primary actions like adding new items.
 *
 * Features:
 * - Fixed position with shadow/elevation
 * - Smooth press animation
 * - Customizable icon and color
 *
 * @param onPress - Callback when button is pressed
 * @param icon - Ionicon name (default: "add")
 * @param backgroundColor - Custom background color (default: primary500)
 * @param iconColor - Custom icon color (default: white)
 * @param size - Button size in pixels (default: 56)
 */

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  backgroundColor?: string;
  iconColor?: string;
  size?: number;
}

function FloatingActionButton({
  onPress,
  icon = "add",
  backgroundColor = mainColors.primary500,
  iconColor = mainColors.textOnPrimary,
  size = 56,
}: FloatingActionButtonProps) {
  const iconSize = size * 0.5; // Icon is 50% of button size

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
    // iOS shadow
    shadowColor: mainColors.shadowStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    // Android elevation
    elevation: 8,
  },
});

export default FloatingActionButton;
