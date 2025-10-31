import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { mainColors } from "../../../shared/constants/colors";
import { formatTime } from "../../../shared/helpers/utils";

/**
 * HabitLogItem Component
 *
 * Displays a single habit log entry in the chronological list.
 * Shows the time, habit name, description, and optional notes.
 *
 * @param id - Unique identifier for the log entry
 * @param name - Name of the bad habit
 * @param description - Brief description of the habit
 * @param datetime - Unix timestamp of when the habit was logged
 * @param notes - Optional user notes about this specific occurrence
 * @param onPress - Optional callback when the item is pressed (for editing/viewing details)
 */

interface HabitLogItemProps {
  id?: number;
  name: string;
  description?: string;
  datetime: number;
  location?: string;
  trigger?: string;
  notes?: string;
  onPress?: () => void;
}

function HabitLogItem({
  id,
  name,
  description,
  datetime,
  location,
  trigger,
  notes,
  onPress,
}: HabitLogItemProps) {
  const formattedTime = formatTime(datetime);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      <View style={styles.timeSection}>
        <Text style={styles.timeText}>{formattedTime}</Text>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.habitName}>{name}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        {location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{location}</Text>
          </View>
        )}
        {trigger && (
          <View style={styles.triggerContainer}>
            <Text style={styles.triggerIcon}>⚡</Text>
            <Text style={styles.triggerText}>{trigger}</Text>
          </View>
        )}
        {notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Note:</Text>
            <Text style={styles.notesText}>{notes}</Text>
          </View>
        )}
      </View>

      <View style={styles.indicatorDot} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: mainColors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: mainColors.border,
    shadowColor: mainColors.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeSection: {
    marginRight: 16,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 2,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
    color: mainColors.accent500,
    letterSpacing: 0.5,
  },
  contentSection: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "700",
    color: mainColors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: mainColors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  locationIcon: {
    fontSize: 12,
  },
  locationText: {
    fontSize: 13,
    color: mainColors.textSecondary,
    fontWeight: "500",
  },
  triggerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  triggerIcon: {
    fontSize: 12,
  },
  triggerText: {
    fontSize: 13,
    color: mainColors.textSecondary,
    fontWeight: "500",
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: mainColors.border,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: mainColors.textMuted,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: mainColors.textSecondary,
    lineHeight: 18,
    fontStyle: "italic",
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: mainColors.primary500,
    marginLeft: 12,
    marginTop: 6,
  },
});

export default HabitLogItem;
