import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { mainColors } from "../../../shared/constants/colors";

/**
 * SettingsSection - Section header component for Settings screen
 *
 * Provides visual separation and labeling for different settings groups.
 * Supports danger mode for critical sections.
 *
 * Architecture Layer: Presentation (UI Component)
 */

interface SettingsSectionProps {
  title: string;
  isDanger?: boolean; // If true, uses red/warning styling
  children: React.ReactNode;
}

function SettingsSection({
  title,
  isDanger = false,
  children,
}: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      <View style={[styles.header, isDanger && styles.dangerHeader]}>
        <Text style={[styles.title, isDanger && styles.dangerTitle]}>
          {isDanger && "⚠️ "}
          {title}
        </Text>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: mainColors.backgroundElevated,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: mainColors.border,
  },
  dangerHeader: {
    backgroundColor: "rgba(255, 107, 107, 0.1)", // Transparent red tint
    borderBottomColor: "rgba(255, 107, 107, 0.3)",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: mainColors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dangerTitle: {
    color: "#FF6B6B", // Error red
  },
  content: {
    backgroundColor: mainColors.backgroundCard,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: mainColors.border,
    overflow: "hidden",
  },
});

export default SettingsSection;
