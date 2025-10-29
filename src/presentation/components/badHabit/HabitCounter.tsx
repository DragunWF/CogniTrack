import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { mainColors } from "../../../shared/constants/colors";

/**
 * HabitCounter Component
 *
 * Displays a quick-add counter for a specific bad habit with increment/decrement buttons.
 * Used in the top section of the BadHabitScreen for tracking daily habit occurrences.
 *
 * @param name - The name of the bad habit
 * @param count - Current count of how many times the habit was performed today
 * @param onIncrement - Callback function when increment (+) button is pressed
 * @param onDecrement - Callback function when decrement (-) button is pressed
 */

interface HabitCounterProps {
  name: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

function HabitCounter({
  name,
  count,
  onIncrement,
  onDecrement,
}: HabitCounterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.habitInfo}>
        <Text style={styles.habitName}>{name}</Text>
        <View
          style={[
            styles.visualIndicator,
            { backgroundColor: getVisualTierColor(count) },
          ]}
        ></View>
      </View>

      <View style={styles.counterSection}>
        <TouchableOpacity
          style={[styles.button, count === 0 && styles.buttonDisabled]}
          onPress={onDecrement}
          disabled={count === 0}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.buttonText,
              count === 0 && styles.buttonTextDisabled,
            ]}
          >
            −
          </Text>
        </TouchableOpacity>

        <View style={styles.countDisplay}>
          <Text style={styles.countText}>{count}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={onIncrement}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * Returns a color based on habit count
 * Uses meaningful psychology-based color progression:
 * - Green (0): Success state - no occurrences today
 * - Yellow (1-2): Caution - slight concern
 * - Orange (3-5): Warning - needs attention
 * - Red (6-9): Danger - significant issue
 * - Dark Red (10+): Critical - severe habit pattern
 */
function getVisualTierColor(count: number): string {
  if (count <= 1) return "#22C55E"; // Green - Success
  if (count <= 2) return "#F59E0B"; // Amber - Caution
  if (count <= 6) return "#FB923C"; // Orange - Warning
  if (count <= 10) return "#EF4444"; // Red - Danger
  return "#991B1B"; // Dark Red - Critical
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: mainColors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: mainColors.border,
    shadowColor: mainColors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  habitInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    color: mainColors.textPrimary,
    flex: 1,
  },
  visualIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  counterSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: mainColors.primary500,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: mainColors.backgroundInput,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: "600",
    color: mainColors.textOnPrimary,
    lineHeight: 32,
  },
  buttonTextDisabled: {
    color: mainColors.textMuted,
  },
  countDisplay: {
    minWidth: 60,
    height: 44,
    backgroundColor: mainColors.backgroundInput,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: mainColors.border,
  },
  countText: {
    fontSize: 24,
    fontWeight: "700",
    color: mainColors.textPrimary,
  },
});

export default HabitCounter;
