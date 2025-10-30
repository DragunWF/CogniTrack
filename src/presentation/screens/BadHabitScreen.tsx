import { useState, useCallback } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import BadHabit from "../../domain/entities/badHabit";
import Title from "../components/ui/Title";
import SectionHeader from "../components/ui/SectionHeader";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import HabitCounter from "../components/badHabit/HabitCounter";
import HabitLogItem from "../components/badHabit/HabitLogItem";
import HabitModal from "../components/badHabit/HabitModal";
import { HabitModalModeEnum } from "../components/badHabit/HabitModal";

import { mainColors } from "../../shared/constants/colors";
import {
  CreateBadHabitUseCase,
  GetAllTodayBadHabitsUseCase,
  UpdateBadHabitUseCase,
  DeleteBadHabitUseCase,
} from "../../application/useCases/badHabitUseCases";

/**
 * BadHabitScreen
 *
 * Main screen for tracking bad habits. Features:
 * 1. Quick-add counters at the top for selected habits
 * 2. Chronological log of all habits recorded today
 *
 * The screen is divided into two sections:
 * - "Today's Habits" - Quick counter cards for frequent habits
 * - "Today's Log" - Detailed chronological list of all logged entries
 */

interface HabitCounter {
  id: string;
  name: string;
  description?: string;
  count: number;
}

function BadHabitScreen() {
  const [selectedHabits, setSelectedHabits] = useState<HabitCounter[]>([]);
  const [todayLog, setTodayLog] = useState<BadHabit[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<HabitModalModeEnum>(
    HabitModalModeEnum.ADD
  );
  const [editingHabit, setEditingHabit] = useState<BadHabit | undefined>(
    undefined
  );

  /**
   * Fetches all bad habits logged today and processes them for display
   * - Updates the today's log with all entries
   * - Calculates counts for the counter cards
   */
  const fetchHabitData = async () => {
    try {
      const getTodayBadHabits = new GetAllTodayBadHabitsUseCase();
      const todayBadHabits = await getTodayBadHabits.execute();

      // Sort by datetime descending (most recent first)
      const sortedLog = todayBadHabits.sort((a, b) => b.datetime - a.datetime);
      setTodayLog(sortedLog);

      // Calculate habit counts and create counter cards
      const habitCounts = calculateHabitCounts(todayBadHabits);
      setSelectedHabits(habitCounts);
    } catch (error) {
      console.error("Error fetching habit data:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load habits",
      });
    }
  };

  /**
   * Calculates the count of each unique habit from today's log
   * Returns an array of habit counters with name, description, and count
   */
  const calculateHabitCounts = (habits: BadHabit[]): HabitCounter[] => {
    const habitMap = new Map<string, HabitCounter>();

    habits.forEach((habit) => {
      const existing = habitMap.get(habit.name);
      if (existing) {
        existing.count += 1;
      } else {
        habitMap.set(habit.name, {
          id: habit.name, // Use name as unique identifier
          name: habit.name,
          description: habit.description,
          count: 1,
        });
      }
    });

    // Convert to array and sort by count (descending)
    return Array.from(habitMap.values()).sort((a, b) => b.count - a.count);
  };

  /**
   * useFocusEffect hook to fetch data when screen comes into focus
   * This ensures the data is always fresh when user navigates to this screen
   * Also triggers on initial mount
   */
  useFocusEffect(
    useCallback(() => {
      fetchHabitData();
    }, [])
  );

  /**
   * Handles incrementing a habit counter
   * Creates a new habit entry in the database with current timestamp
   * Refreshes the UI to reflect the new count
   */
  const handleIncrement = async (habitId: string) => {
    try {
      const habit = selectedHabits.find((h) => h.id === habitId);
      if (!habit) return;

      const createBadHabit = new CreateBadHabitUseCase();
      await createBadHabit.execute({
        name: habit.name,
        description: habit.description,
        datetime: Date.now(),
      });

      // Refresh data to update counts
      await fetchHabitData();
    } catch (error) {
      console.error("Error incrementing habit:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to log habit",
      });
    }
  };

  /**
   * Handles decrementing a habit counter
   * Finds and deletes the most recent entry for this habit
   * Prevents decrementing below 0
   */
  const handleDecrement = async (habitId: string) => {
    try {
      const habit = selectedHabits.find((h) => h.id === habitId);
      if (!habit || habit.count === 0) return;

      // Find the most recent entry for this habit
      const habitEntries = todayLog
        .filter((log) => log.name === habit.name)
        .sort((a, b) => b.datetime - a.datetime);

      if (habitEntries.length > 0 && habitEntries[0].id) {
        const deleteBadHabit = new DeleteBadHabitUseCase();
        await deleteBadHabit.execute(habitEntries[0].id);

        // Refresh data to update counts
        await fetchHabitData();

        Toast.show({
          type: "success",
          text1: "Entry Removed",
          text2: `${habit.name} entry deleted`,
        });
      }
    } catch (error) {
      console.error("Error decrementing habit:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to remove entry",
      });
    }
  };

  /**
   * Opens the modal in edit mode with the selected habit's data
   * Allows user to modify existing habit entry
   */
  const handleLogItemPress = (logId: number | undefined) => {
    if (!logId) return;

    const habit = todayLog.find((log) => log.id === logId);
    if (habit) {
      setModalMode(HabitModalModeEnum.EDIT);
      setEditingHabit(habit);
      setModalVisible(true);
    }
  };

  /**
   * Opens the modal in add mode for creating a new habit entry
   */
  const handleAddHabit = () => {
    setModalMode(HabitModalModeEnum.ADD);
    setEditingHabit(undefined);
    setModalVisible(true);
  };

  /**
   * Closes the modal and resets the editing state
   */
  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingHabit(undefined);
  };

  /**
   * Handles form submission from the modal
   * Creates new habit or updates existing one based on mode
   * Refreshes the UI after successful operation
   */
  const handleSubmitHabit = async (data: BadHabit): Promise<void> => {
    try {
      if (modalMode === HabitModalModeEnum.ADD) {
        // Create new habit entry
        const createBadHabit = new CreateBadHabitUseCase();
        const id = await createBadHabit.execute(data);

        Toast.show({
          type: "success",
          text1: "Habit Added",
          text2: `${data.name} logged successfully`,
        });
      } else {
        // Update existing habit entry
        if (editingHabit?.id) {
          const updateBadHabit = new UpdateBadHabitUseCase();
          const isUpdated = await updateBadHabit.execute({
            ...data,
            id: editingHabit.id,
          });

          if (isUpdated) {
            Toast.show({
              type: "success",
              text1: "Habit Updated",
              text2: `${data.name} updated successfully`,
            });
          }
        } else {
          Toast.show({
            type: "error",
            text1: "Habit Update Failed",
            text2:
              "An unexpected error has occurred while trying to update your habit!",
          });
        }
      }

      // Refresh data after successful operation
      await fetchHabitData();
    } catch (error) {
      console.error("Error submitting habit:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Failed to ${
          modalMode === HabitModalModeEnum.ADD ? "add" : "update"
        } habit`,
      });
      throw error; // Re-throw so modal knows not to close on error
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Title textStyles={styles.titleText}>Bad Habit Tracker</Title>
        </View>

        {/* Quick-Add Counters Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Today's Habits"
            subtitle="Track your most common habits"
          />
          <View style={styles.countersGrid}>
            {selectedHabits.length > 0 ? (
              selectedHabits.map((habit) => (
                <View key={habit.id} style={styles.counterItem}>
                  <HabitCounter
                    name={habit.name}
                    count={habit.count}
                    onIncrement={() => handleIncrement(habit.id)}
                    onDecrement={() => handleDecrement(habit.id)}
                  />
                </View>
              ))
            ) : (
              <View style={styles.emptyCounters}>
                <Text style={styles.emptyCountersText}>
                  No habits tracked yet today
                </Text>
                <Text style={styles.emptyCountersSubtext}>
                  Tap the + button to log your first habit
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Today's Log Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Today's Log"
            subtitle="Chronological record of all entries"
          />
          {todayLog.length > 0 ? (
            <View style={styles.logList}>
              {todayLog.map((log) => (
                <HabitLogItem
                  key={log.id}
                  id={log.id}
                  name={log.name}
                  description={log.description}
                  datetime={log.datetime}
                  location={log.location}
                  notes={log.notes}
                  onPress={() => handleLogItemPress(log.id)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>✨</Text>
              <Text style={styles.emptyStateText}>No habits logged today</Text>
              <Text style={styles.emptyStateSubtext}>
                Start tracking to build awareness
              </Text>
            </View>
          )}
        </View>

        {/* Bottom spacing for comfortable scrolling */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleAddHabit} icon="add" />

      {/* Add/Edit Habit Modal */}
      <HabitModal
        visible={modalVisible}
        mode={modalMode}
        habitData={editingHabit}
        onClose={handleCloseModal}
        onSubmit={handleSubmitHabit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainColors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "800",
    color: mainColors.textPrimary,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  countersGrid: {
    gap: 12,
  },
  counterItem: {
    width: "100%",
  },
  divider: {
    height: 1,
    backgroundColor: mainColors.border,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  logList: {
    width: "100%",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: mainColors.textSecondary,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: mainColors.textMuted,
  },
  bottomSpacer: {
    height: 32,
  },
  emptyCounters: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyCountersText: {
    fontSize: 14,
    fontWeight: "600",
    color: mainColors.textSecondary,
    marginBottom: 4,
    textAlign: "center",
  },
  emptyCountersSubtext: {
    fontSize: 12,
    color: mainColors.textMuted,
    textAlign: "center",
  },
});

export default BadHabitScreen;
