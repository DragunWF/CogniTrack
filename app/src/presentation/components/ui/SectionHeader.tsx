import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { mainColors } from "../../../shared/constants/colors";

/**
 * SectionHeader Component
 *
 * A reusable header component for different sections of a screen.
 * Provides consistent typography and spacing.
 *
 * @param title - The main heading text
 * @param subtitle - Optional descriptive text below the title
 * @param style - Optional additional styles
 */

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  style?: object;
}

function SectionHeader({ title, subtitle, style }: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: mainColors.textPrimary,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    color: mainColors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
});

export default SectionHeader;
