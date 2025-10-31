import React from "react";
import { StyleSheet, View } from "react-native";
import { mainColors } from "../../../shared/constants/colors";

/**
 * Card Component
 *
 * A reusable container component for elevated content surfaces.
 * Provides consistent styling with dark theme support.
 *
 * @param children - Content to be rendered inside the card
 * @param style - Optional additional styles to apply
 */

interface CardProps {
  children: React.ReactNode;
  style?: object;
}

function Card({ children, style }: CardProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: mainColors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: mainColors.border,
    shadowColor: mainColors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Card;
