import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { mainColors } from "../../../shared/constants/colors";
import { TimeRangeStats } from "../../../application/useCases/badHabitStatsUseCases";

/**
 * KeyStatBoxes Component
 *
 * Displays key statistics in a horizontal row of cards
 * Shows total habits, worst day, and top habit for the selected time range
 *
 * @param stats - Statistical data for the selected time range
 * @param loading - Whether data is being fetched
 */

interface KeyStatBoxesProps {
  stats: TimeRangeStats;
  loading?: boolean;
}

function KeyStatBoxes({ stats, loading }: KeyStatBoxesProps) {
  const statCards = [
    {
      label: "Total Habits",
      value: stats.totalHabits.toString(),
      icon: "📊",
      color: mainColors.primary500,
    },
    {
      label: "Worst Day",
      value: stats.worstDay,
      icon: "📅",
      color: mainColors.accent500,
    },
    {
      label: "Top Habit",
      value: stats.topHabit,
      subtitle: `${stats.topHabitCount}x`,
      icon: "🎯",
      color: "#F59E0B",
    },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        {statCards.map((card, index) => (
          <View key={index} style={styles.statCard}>
            <View style={styles.loadingPlaceholder} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {statCards.map((card, index) => (
        <View key={index} style={styles.statCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{card.icon}</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>{card.label}</Text>
            <Text style={[styles.statValue, { color: card.color }]}>
              {card.value}
            </Text>
            {card.subtitle && (
              <Text style={styles.statSubtitle}>{card.subtitle}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: mainColors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: mainColors.border,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 8,
  },
  icon: {
    fontSize: 32,
  },
  statContent: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: mainColors.textMuted,
    marginBottom: 4,
    textAlign: "center",
  },
  statValue: {
    fontSize: 12,
    fontWeight: "800",
    color: mainColors.textPrimary,
    textAlign: "center",
  },
  statSubtitle: {
    fontSize: 10,
    fontWeight: "600",
    color: mainColors.textMuted,
    marginTop: 2,
  },
  loadingPlaceholder: {
    width: "100%",
    height: 80,
    backgroundColor: mainColors.backgroundInput,
    borderRadius: 8,
  },
});

export default KeyStatBoxes;
