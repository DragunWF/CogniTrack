import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { mainColors } from "../../shared/constants/colors";
import GlobalFilterBar from "../components/stats/GlobalFilterBar";
import KeyStatBoxes from "../components/stats/KeyStatBoxes";
import BreakdownCard from "../components/stats/BreakdownCard";
import TrendsCard from "../components/stats/TrendsCard";
import {
  GetTimeRangeStatsUseCase,
  GetBreakdownDataUseCase,
  GetTrendDataUseCase,
  type TimeRange,
  type BreakdownItem,
  type TrendDataPoint,
} from "../../application/useCases/badHabitStatsUseCases";

function StatsScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>("This Week");
  const [loading, setLoading] = useState(true);

  // Stats data
  const [stats, setStats] = useState({
    totalHabits: 0,
    worstDay: "None",
    topHabit: "None",
    topHabitCount: 0,
  });

  // Breakdown data
  const [breakdownData, setBreakdownData] = useState<{
    byHabit: BreakdownItem[];
    byTrigger: BreakdownItem[];
    byLocation: BreakdownItem[];
  }>({
    byHabit: [],
    byTrigger: [],
    byLocation: [],
  });

  // Trends data
  const [trendsData, setTrendsData] = useState<TrendDataPoint[]>([]);

  // Initialize use cases
  const getTimeRangeStats = new GetTimeRangeStatsUseCase();
  const getBreakdownData = new GetBreakdownDataUseCase();
  const getTrendData = new GetTrendDataUseCase();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Load time range stats (total, worst day, top habit)
      const statsResult = await getTimeRangeStats.execute(timeRange);
      setStats(statsResult);

      // Load breakdown data for all three types
      const habitBreakdown = await getBreakdownData.execute(timeRange, "habit");
      const triggerBreakdown = await getBreakdownData.execute(
        timeRange,
        "trigger"
      );
      const locationBreakdown = await getBreakdownData.execute(
        timeRange,
        "location"
      );

      setBreakdownData({
        byHabit: habitBreakdown,
        byTrigger: triggerBreakdown,
        byLocation: locationBreakdown,
      });

      // Load trends data
      const trends = await getTrendData.execute(timeRange);
      setTrendsData(trends);
    } catch (error) {
      console.error("Error loading stats data:", error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Reload data when screen comes into focus or time range changes
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Cognitive Dashboard</Text>
        <Text style={styles.headerSubtitle}>
          Visualize patterns and track progress
        </Text>
      </View>

      {/* Global Filter Bar */}
      <GlobalFilterBar
        selectedTimeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Key Stat Boxes */}
        <KeyStatBoxes stats={stats} loading={loading} />

        {/* Breakdown Card (Pie Chart) */}
        <BreakdownCard
          habitData={breakdownData.byHabit}
          triggerData={breakdownData.byTrigger}
          locationData={breakdownData.byLocation}
          loading={loading}
        />

        {/* Trends Card (Bar Graph) */}
        <TrendsCard data={trendsData} timeRange={timeRange} loading={loading} />

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainColors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: mainColors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: mainColors.textPrimary,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 15,
    color: mainColors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default StatsScreen;
