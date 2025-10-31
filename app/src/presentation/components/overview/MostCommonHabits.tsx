import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { mainColors } from "../../../shared/constants/colors";

/**
 * MostCommonHabits Component
 *
 * Displays a ranked list of the most frequently logged habits
 * Each item shows the habit name and total count
 * Tapping an item filters the chronological feed
 *
 * @param habits - Array of aggregated habit data sorted by count
 * @param onHabitPress - Callback when a habit is selected
 * @param selectedHabit - Currently selected habit name (if any)
 */

interface HabitAggregate {
  name: string;
  count: number;
  description: string;
  lastOccurrence: number;
}

interface MostCommonHabitsProps {
  habits: HabitAggregate[];
  onHabitPress: (habitName: string) => void;
  selectedHabit?: string;
}

function MostCommonHabits({
  habits,
  onHabitPress,
  selectedHabit,
}: MostCommonHabitsProps) {
  const renderHabitItem = ({
    item,
    index,
  }: {
    item: HabitAggregate;
    index: number;
  }) => {
    const isSelected = selectedHabit === item.name;
    const rankEmoji =
      index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "📌";

    return (
      <TouchableOpacity
        style={[styles.habitItem, isSelected && styles.habitItemSelected]}
        onPress={() => onHabitPress(item.name)}
        activeOpacity={0.7}
      >
        <View style={styles.habitLeft}>
          <Text style={styles.rankEmoji}>{rankEmoji}</Text>
          <View style={styles.habitInfo}>
            <Text style={styles.habitName}>{item.name}</Text>
            <Text style={styles.habitDescription} numberOfLines={1}>
              {item.description}
            </Text>
          </View>
        </View>
        <View style={styles.habitRight}>
          <Text style={styles.habitCount}>{item.count}</Text>
          <Text style={styles.habitLabel}>times</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📊</Text>
      <Text style={styles.emptyText}>No habits tracked yet</Text>
      <Text style={styles.emptySubtext}>
        Start logging habits to see insights
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Most Common Bad Habits</Text>
        <Text style={styles.subtitle}>
          {habits.length > 0 ? `Top ${habits.length}` : "No data"}
        </Text>
      </View>

      {selectedHabit && (
        <View style={styles.filterBadge}>
          <Text style={styles.filterText}>Filtered: {selectedHabit}</Text>
          <TouchableOpacity
            onPress={() => onHabitPress("")}
            style={styles.clearButton}
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={habits}
        renderItem={renderHabitItem}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        scrollEnabled={false}
      />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: mainColors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: mainColors.textMuted,
  },
  filterBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: mainColors.accent500,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: mainColors.textOnPrimary,
  },
  clearButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: {
    fontSize: 12,
    color: mainColors.textOnPrimary,
    fontWeight: "700",
  },
  listContent: {
    gap: 8,
  },
  habitItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: mainColors.backgroundInput,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: mainColors.border,
  },
  habitItemSelected: {
    backgroundColor: mainColors.primary500,
    borderColor: mainColors.primary500,
  },
  habitLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  rankEmoji: {
    fontSize: 24,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 15,
    fontWeight: "600",
    color: mainColors.textPrimary,
    marginBottom: 2,
  },
  habitDescription: {
    fontSize: 12,
    color: mainColors.textMuted,
  },
  habitRight: {
    alignItems: "flex-end",
  },
  habitCount: {
    fontSize: 22,
    fontWeight: "700",
    color: mainColors.primary500,
  },
  habitLabel: {
    fontSize: 11,
    color: mainColors.textMuted,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
    color: mainColors.textSecondary,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: mainColors.textMuted,
  },
});

export default MostCommonHabits;
