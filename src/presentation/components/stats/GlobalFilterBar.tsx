import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { mainColors } from "../../../shared/constants/colors";
import { TimeRange } from "../../../application/useCases/badHabitStatsUseCases";

/**
 * GlobalFilterBar Component
 *
 * Segmented control for selecting time range filter
 * Updates the global filter state that controls all dashboard data
 *
 * @param selectedTimeRange - Currently selected time range
 * @param onTimeRangeChange - Callback when time range changes
 */

interface GlobalFilterBarProps {
  selectedTimeRange: TimeRange;
  onTimeRangeChange: (timeRange: TimeRange) => void;
}

const TIME_RANGES: TimeRange[] = [
  "Today",
  "This Week",
  "This Month",
  "This Year",
  "All Time",
];

function GlobalFilterBar({
  selectedTimeRange,
  onTimeRangeChange,
}: GlobalFilterBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.label}>Time Range</Text>
        <View style={styles.segmentedControl}>
          {TIME_RANGES.map((range) => {
            const isSelected = selectedTimeRange === range;
            return (
              <TouchableOpacity
                key={range}
                style={[styles.segment, isSelected && styles.segmentSelected]}
                onPress={() => onTimeRangeChange(range)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isSelected && styles.segmentTextSelected,
                  ]}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: mainColors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: mainColors.border,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: mainColors.textPrimary,
    marginBottom: 12,
  },
  segmentedControl: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  segment: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: mainColors.backgroundInput,
    borderWidth: 1,
    borderColor: mainColors.border,
  },
  segmentSelected: {
    backgroundColor: mainColors.primary500,
    borderColor: mainColors.primary500,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "600",
    color: mainColors.textSecondary,
    textAlign: "center",
  },
  segmentTextSelected: {
    color: mainColors.textOnPrimary,
  },
});

export default GlobalFilterBar;
