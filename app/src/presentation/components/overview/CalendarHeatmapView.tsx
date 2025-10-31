import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { mainColors } from "../../../shared/constants/colors";

/**
 * CalendarHeatmap Component
 *
 * Displays a calendar heatmap showing daily habit counts
 * Color intensity represents the severity level based on tier colors
 *
 * @param data - Array of daily habit counts with date and count
 * @param onDayPress - Callback when a day is tapped
 */

interface HeatmapData {
  date: string; // YYYY-MM-DD
  count: number;
}

interface CalendarHeatmapViewProps {
  data: HeatmapData[];
  onDayPress: (date: string) => void;
  selectedDate?: string;
}

function CalendarHeatmapView({
  data,
  onDayPress,
  selectedDate,
}: CalendarHeatmapViewProps) {
  /**
   * Returns color based on habit count using tier system
   */
  const getColorForCount = (count: number): string => {
    if (count === 0) {
      return mainColors.backgroundInput; // Neutral/Empty
    }
    if (count <= 2) {
      return "#F59E0B"; // Tier 1 - Amber/Caution
    }
    if (count <= 5) {
      return "#FB923C"; // Tier 2 - Orange/Warning
    }
    if (count <= 9) {
      return "#EF4444"; // Tier 3 - Red/Danger
    }
    return "#991B1B"; // Tier 4 - Dark Red/Critical
  };

  /**
   * Generate last 90 days with their counts
   */
  const generateHeatmapDays = () => {
    const days: Array<{ date: string; count: number; dateObj: Date }> = [];
    const dataMap = new Map(data.map((d) => [d.date, d.count]));

    for (let i = 89; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];

      days.push({
        date: dateKey,
        count: dataMap.get(dateKey) || 0,
        dateObj: date,
      });
    }

    return days;
  };

  const heatmapDays = generateHeatmapDays();

  // Group days into weeks (7 days per row)
  const weeks: (typeof heatmapDays)[] = [];
  for (let i = 0; i < heatmapDays.length; i += 7) {
    weeks.push(heatmapDays.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Heatmap</Text>
      <Text style={styles.subtitle}>Last 90 Days</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.heatmapScroll}
        contentContainerStyle={styles.heatmapScrollContent}
      >
        <View style={styles.heatmapContainer}>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {week.map((day) => (
                <TouchableOpacity
                  key={day.date}
                  style={[
                    styles.daySquare,
                    { backgroundColor: getColorForCount(day.count) },
                    selectedDate === day.date && styles.daySquareSelected,
                  ]}
                  onPress={() => onDayPress(day.date)}
                  activeOpacity={0.7}
                >
                  {day.count > 0 && (
                    <Text style={styles.dayCount}>{day.count}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        <View
          style={[
            styles.legendSquare,
            { backgroundColor: mainColors.backgroundInput },
          ]}
        />
        <View style={[styles.legendSquare, { backgroundColor: "#F59E0B" }]} />
        <View style={[styles.legendSquare, { backgroundColor: "#FB923C" }]} />
        <View style={[styles.legendSquare, { backgroundColor: "#EF4444" }]} />
        <View style={[styles.legendSquare, { backgroundColor: "#991B1B" }]} />
        <Text style={styles.legendText}>More</Text>
      </View>

      {selectedDate && (
        <View style={styles.selectedDateBadge}>
          <Text style={styles.selectedDateText}>
            Selected:{" "}
            {new Date(selectedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: mainColors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: mainColors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: mainColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: mainColors.textMuted,
    marginBottom: 16,
  },
  heatmapScroll: {
    marginVertical: 8,
  },
  heatmapScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heatmapContainer: {
    flexDirection: "column",
    gap: 3,
  },
  weekRow: {
    flexDirection: "row",
    gap: 3,
  },
  daySquare: {
    width: 32,
    height: 32,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: mainColors.border,
  },
  daySquareSelected: {
    borderWidth: 2,
    borderColor: mainColors.primary500,
  },
  dayCount: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    gap: 6,
  },
  legendSquare: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
    color: mainColors.textMuted,
    marginHorizontal: 4,
  },
  selectedDateBadge: {
    marginTop: 12,
    backgroundColor: mainColors.primary500,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "center",
  },
  selectedDateText: {
    fontSize: 12,
    fontWeight: "600",
    color: mainColors.textOnPrimary,
  },
});

export default CalendarHeatmapView;
