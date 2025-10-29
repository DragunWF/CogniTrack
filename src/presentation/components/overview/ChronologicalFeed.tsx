import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  SectionListData,
} from "react-native";
import { mainColors } from "../../../shared/constants/colors";
import HabitLogItem from "../badHabit/HabitLogItem";
import BadHabit from "../../../domain/entities/badHabit";

/**
 * ChronologicalFeed Component
 *
 * Displays filtered habit entries grouped by date
 * Shows entries in chronological order with date section headers
 *
 * @param habits - Array of habits (already filtered by date/type)
 * @param onHabitPress - Callback when a habit entry is tapped
 * @param selectedDate - Currently filtered date (if any)
 * @param selectedHabit - Currently filtered habit name (if any)
 */

interface ChronologicalFeedProps {
  habits: BadHabit[];
  onHabitPress: (habitId: number | undefined) => void;
  selectedDate?: string;
  selectedHabit?: string;
}

interface HabitSection {
  title: string;
  data: BadHabit[];
}

function ChronologicalFeed({
  habits,
  onHabitPress,
  selectedDate,
  selectedHabit,
}: ChronologicalFeedProps) {
  /**
   * Groups habits by date for section list
   */
  const groupHabitsByDate = (): HabitSection[] => {
    const grouped = new Map<string, BadHabit[]>();

    habits.forEach((habit) => {
      const date = new Date(habit.datetime);
      const dateKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (grouped.has(dateKey)) {
        grouped.get(dateKey)!.push(habit);
      } else {
        grouped.set(dateKey, [habit]);
      }
    });

    // Convert to section array
    const sections: HabitSection[] = [];
    grouped.forEach((habits, dateKey) => {
      sections.push({
        title: dateKey,
        data: habits,
      });
    });

    return sections;
  };

  const sections = groupHabitsByDate();

  const renderSectionHeader = ({
    section,
  }: {
    section: SectionListData<BadHabit, HabitSection>;
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionBadge}>
        <Text style={styles.sectionCount}>{section.data.length}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: BadHabit }) => (
    <HabitLogItem
      id={item.id}
      name={item.name}
      description={item.description}
      datetime={item.datetime}
      notes={item.notes}
      onPress={() => onHabitPress(item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🔍</Text>
      <Text style={styles.emptyText}>No habits found</Text>
      {(selectedDate || selectedHabit) && (
        <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
      )}
      {!selectedDate && !selectedHabit && (
        <Text style={styles.emptySubtext}>
          Start tracking to see your history
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chronological Feed</Text>
        <Text style={styles.subtitle}>
          {habits.length} {habits.length === 1 ? "entry" : "entries"}
        </Text>
      </View>

      {/* Active Filters Display */}
      {(selectedDate || selectedHabit) && (
        <View style={styles.filtersContainer}>
          {selectedDate && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>
                📅{" "}
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>
          )}
          {selectedHabit && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>🏷️ {selectedHabit}</Text>
            </View>
          )}
        </View>
      )}

      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        stickySectionHeadersEnabled={false}
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
  filtersContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  filterChip: {
    backgroundColor: mainColors.primary500,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: mainColors.textOnPrimary,
  },
  listContent: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: mainColors.backgroundInput,
    borderRadius: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: mainColors.textPrimary,
  },
  sectionBadge: {
    backgroundColor: mainColors.primary500,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: "center",
  },
  sectionCount: {
    fontSize: 11,
    fontWeight: "700",
    color: mainColors.textOnPrimary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
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

export default ChronologicalFeed;
