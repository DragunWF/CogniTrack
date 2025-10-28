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
        <View style={styles.visualIndicator}>
          <Text style={styles.indicatorEmoji}>{getVisualTier(count)}</Text>
        </View>
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
 * Returns a visual indicator emoji based on habit count
 * Provides immediate visual feedback on daily progress
 */
function getVisualTier(count: number): string {
  if (count === 0) return "⚪";
  if (count <= 2) return "✖️";
  return "🚫";
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: mainColors.backgroundInput,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorEmoji: {
    fontSize: 18,
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
