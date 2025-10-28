import { useState, useEffect } from "react";
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from "react-native";

import BadHabit from "../../domain/entities/badHabit";
import Title from "../components/ui/Title";
import SectionHeader from "../components/ui/SectionHeader";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import HabitCounter from "../components/badHabit/HabitCounter";
import HabitLogItem from "../components/badHabit/HabitLogItem";
import HabitModal from "../components/badHabit/HabitModal";

import { mainColors } from "../../shared/constants/colors";
import { GetAllBadHabitsUseCase } from "../../application/useCases/badHabitUseCases";

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

function BadHabitScreen() {
  const [selectedHabits, setSelectedHabits] = useState<BadHabit[]>([]);
  const [todayLog, setTodayLog] = useState<BadHabit[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingHabit, setEditingHabit] = useState<BadHabit | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchHabitData = async () => {
      const getAllBadHabits = new GetAllBadHabitsUseCase();
      const allBadHabits = await getAllBadHabits.execute();

      setTodayLog(allBadHabits);
    };

    fetchHabitData();
  }, []);

  // TODO: Replace with actual data from database/state management
  const mockSelectedHabits = [
    { id: 1, name: "Social Media Scrolling", count: 3 },
    { id: 2, name: "Snacking", count: 1 },
    { id: 3, name: "Procrastination", count: 0 },
  ];

  // TODO: Replace with actual data from database/state management
  // Mock data should be in chronological order (most recent first)
  const mockTodayLog = [
    {
      id: 1,
      name: "Social Media Scrolling",
      description: "Mindlessly scrolling through social media",
      datetime: Date.now() - 1000 * 60 * 30, // 30 minutes ago
      notes: "Felt stressed after work meeting",
    },
    {
      id: 2,
      name: "Social Media Scrolling",
      description: "Mindlessly scrolling through social media",
      datetime: Date.now() - 1000 * 60 * 90, // 1.5 hours ago
    },
    {
      id: 3,
      name: "Snacking",
      description: "Eating unhealthy snacks between meals",
      datetime: Date.now() - 1000 * 60 * 180, // 3 hours ago
      notes: "Bored while watching TV",
    },
    {
      id: 4,
      name: "Social Media Scrolling",
      description: "Mindlessly scrolling through social media",
      datetime: Date.now() - 1000 * 60 * 240, // 4 hours ago
    },
  ];

  // TODO: Implement increment functionality
  // Should update the count in the database and refresh the UI
  const handleIncrement = (habitId: number) => {
    // Implementation here
    console.log(`Increment habit ${habitId}`);
  };

  // TODO: Implement decrement functionality
  // Should update the count in the database and refresh the UI
  const handleDecrement = (habitId: number) => {
    // Implementation here
    console.log(`Decrement habit ${habitId}`);
  };

  // TODO: Implement log item press functionality
  // Should navigate to detail view or open edit modal
  const handleLogItemPress = (logId: number) => {
    // Implementation here
    console.log(`View/edit log item ${logId}`);
  };

  // TODO: Implement FAB press to open add modal
  const handleAddHabit = () => {
    setModalMode("add");
    setEditingHabit(undefined);
    setModalVisible(true);
  };

  // TODO: Implement modal close handler
  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingHabit(undefined);
  };

  // TODO: Implement modal submit handler
  // This should add/update habit in database and refresh UI
  const handleSubmitHabit = (data: {
    id?: number;
    name: string;
    description: string;
    notes?: string;
  }) => {
    // Implementation here
    console.log("Submit habit:", data);
    // If editing, update existing habit
    // If adding, create new habit
    // Then refresh the habit list
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
            {mockSelectedHabits.map((habit) => (
              <View key={habit.id} style={styles.counterItem}>
                <HabitCounter
                  name={habit.name}
                  count={habit.count}
                  onIncrement={() => handleIncrement(habit.id)}
                  onDecrement={() => handleDecrement(habit.id)}
                />
              </View>
            ))}
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
          {mockTodayLog.length > 0 ? (
            <View style={styles.logList}>
              {mockTodayLog.map((log) => (
                <HabitLogItem
                  key={log.id}
                  id={log.id}
                  name={log.name}
                  description={log.description}
                  datetime={log.datetime}
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
});

export default BadHabitScreen;
