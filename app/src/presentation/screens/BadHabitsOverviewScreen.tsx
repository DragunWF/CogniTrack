import { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import Title from "../components/ui/Title";
import CalendarHeatmapView from "../components/overview/CalendarHeatmapView";
import MostCommonHabits from "../components/overview/MostCommonHabits";
import ChronologicalFeed from "../components/overview/ChronologicalFeed";
import HabitModal from "../components/badHabit/HabitModal";
import { HabitModalModeEnum } from "../components/badHabit/HabitModal";

import { mainColors } from "../../shared/constants/colors";
import BadHabit from "../../domain/entities/badHabit";
import {
  GetDailyHabitCountsUseCase,
  GetHabitTypeAggregatesUseCase,
  GetFilteredHabitsUseCase,
  DailyHabitCount,
  HabitTypeAggregate,
} from "../../application/useCases/badHabitAnalyticsUseCases";
import { UpdateBadHabitUseCase } from "../../application/useCases/badHabitUseCases";

/**
 * BadHabitsOverviewScreen
 *
 * Provides a comprehensive overview of habit tracking history with three main sections:
 * 1. Calendar Heatmap - Visual representation of daily habit counts
 * 2. Most Common Habits - Ranked list of frequently logged habits
 * 3. Chronological Feed - Filterable list of all habit entries grouped by date
 *
 * Features interactive filtering:
 * - Tap a day on the heatmap to filter by date
 * - Tap a habit in the summary to filter by habit type
 * - Both filters can be active simultaneously
 */

function BadHabitsOverviewScreen() {
  // Data states
  const [dailyCounts, setDailyCounts] = useState<DailyHabitCount[]>([]);
  const [topHabits, setTopHabits] = useState<HabitTypeAggregate[]>([]);
  const [filteredHabits, setFilteredHabits] = useState<BadHabit[]>([]);

  // Filter states
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const [selectedHabit, setSelectedHabit] = useState<string | undefined>(
    undefined
  );

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<BadHabit | undefined>(
    undefined
  );

  /**
   * Fetches all data needed for the overview screen
   */
  const fetchAllData = async () => {
    try {
      // Fetch daily counts for heatmap
      const getDailyCounts = new GetDailyHabitCountsUseCase();
      const counts = await getDailyCounts.execute();
      setDailyCounts(counts);

      // Fetch top 10 most common habits
      const getTopHabits = new GetHabitTypeAggregatesUseCase();
      const habits = await getTopHabits.execute(10);
      setTopHabits(habits);

      // Fetch filtered habits based on current filters
      await fetchFilteredHabits();
    } catch (error) {
      console.error("Error fetching overview data:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load habit data",
      });
    }
  };

  /**
   * Fetches habits based on active filters
   */
  const fetchFilteredHabits = async () => {
    try {
      const getFilteredHabits = new GetFilteredHabitsUseCase();
      const habits = await getFilteredHabits.execute(
        selectedDate,
        selectedHabit
      );
      setFilteredHabits(habits);
    } catch (error) {
      console.error("Error fetching filtered habits:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load filtered habits",
      });
    }
  };

  /**
   * Refresh data when screen comes into focus
   */
  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, [selectedDate, selectedHabit])
  );

  /**
   * Handles date selection from heatmap
   * Toggles the date filter on/off
   */
  const handleDatePress = (date: string) => {
    if (selectedDate === date) {
      // Deselect if clicking the same date
      setSelectedDate(undefined);
    } else {
      setSelectedDate(date);
    }
  };

  /**
   * Handles habit selection from summary list
   * Toggles the habit filter on/off
   */
  const handleHabitPress = (habitName: string) => {
    if (selectedHabit === habitName || habitName === "") {
      // Deselect if clicking the same habit or clear button
      setSelectedHabit(undefined);
    } else {
      setSelectedHabit(habitName);
    }
  };

  /**
   * Opens edit modal when a habit entry is tapped
   */
  const handleHabitEntryPress = (habitId: number | undefined) => {
    if (!habitId) return;

    const habit = filteredHabits.find((h) => h.id === habitId);
    if (habit) {
      setEditingHabit(habit);
      setModalVisible(true);
    }
  };

  /**
   * Closes the modal
   */
  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingHabit(undefined);
  };

  /**
   * Handles habit update from modal
   */
  const handleUpdateHabit = async (data: BadHabit): Promise<void> => {
    try {
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
          await fetchAllData();
        }
      }
    } catch (error) {
      console.error("Error updating habit:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update habit",
      });
      throw error;
    }
  };

  /**
   * Clears all active filters
   */
  const handleClearFilters = () => {
    setSelectedDate(undefined);
    setSelectedHabit(undefined);
  };

  const hasActiveFilters = selectedDate || selectedHabit;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Title textStyles={styles.titleText}>Overview</Title>
          {hasActiveFilters && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={handleClearFilters}
            >
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Component 1: Calendar Heatmap */}
        <View style={styles.section}>
          <CalendarHeatmapView
            data={dailyCounts}
            onDayPress={handleDatePress}
            selectedDate={selectedDate}
          />
        </View>

        {/* Component 2: Most Common Habits Summary */}
        <View style={styles.section}>
          <MostCommonHabits
            habits={topHabits}
            onHabitPress={handleHabitPress}
            selectedHabit={selectedHabit}
          />
        </View>

        {/* Component 3: Chronological Feed */}
        <View style={styles.section}>
          <ChronologicalFeed
            habits={filteredHabits}
            onHabitPress={handleHabitEntryPress}
            selectedDate={selectedDate}
            selectedHabit={selectedHabit}
          />
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Edit Habit Modal */}
      <HabitModal
        visible={modalVisible}
        mode={HabitModalModeEnum.EDIT}
        habitData={editingHabit}
        onClose={handleCloseModal}
        onSubmit={handleUpdateHabit}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "800",
    color: mainColors.textPrimary,
  },
  clearFiltersButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  clearFiltersText: {
    fontSize: 12,
    fontWeight: "600",
    color: mainColors.textOnPrimary,
  },
  section: {
    paddingHorizontal: 20,
  },
  bottomSpacer: {
    height: 32,
  },
});

export default BadHabitsOverviewScreen;
