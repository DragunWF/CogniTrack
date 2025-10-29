import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { mainColors } from "../../../shared/constants/colors";
import { BreakdownItem } from "../../../application/useCases/badHabitStatsUseCases";

/**
 * BreakdownCard Component
 *
 * Displays pie chart breakdown with internal tabs
 * User can switch between habit, trigger, and location breakdowns
 *
 * @param habitData - Breakdown by habit name
 * @param triggerData - Breakdown by trigger
 * @param locationData - Breakdown by location
 * @param loading - Whether data is being fetched
 */

interface BreakdownCardProps {
  habitData: BreakdownItem[];
  triggerData: BreakdownItem[];
  locationData: BreakdownItem[];
  loading?: boolean;
}

type BreakdownTab = "habit" | "trigger" | "location";

const CHART_COLORS = [
  "#6B5FCC", // Primary purple
  "#4DBDB3", // Teal
  "#F59E0B", // Amber
  "#FB923C", // Orange
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#10B981", // Green
];

function BreakdownCard({
  habitData,
  triggerData,
  locationData,
  loading,
}: BreakdownCardProps) {
  const [activeTab, setActiveTab] = useState<BreakdownTab>("habit");

  const getActiveData = (): BreakdownItem[] => {
    switch (activeTab) {
      case "habit":
        return habitData;
      case "trigger":
        return triggerData;
      case "location":
        return locationData;
    }
  };

  const activeData = getActiveData();
  const hasData = activeData.length > 0;

  // Prepare chart data with colors
  const chartData = activeData.slice(0, 8).map((item, index) => ({
    x: item.label,
    y: item.value,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const tabs: { key: BreakdownTab; label: string; icon: string }[] = [
    { key: "habit", label: "By Habit", icon: "🎯" },
    { key: "trigger", label: "By Trigger", icon: "⚡" },
    { key: "location", label: "By Location", icon: "📍" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breakdown</Text>

      {/* Internal Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Chart Area */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingPlaceholder} />
        </View>
      ) : hasData ? (
        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={Dimensions.get("window").width / 2}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => mainColors.textPrimary,
            }}
            accessor="y"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
            hasLegend={false}
            center={[Dimensions.get("window").width / 6.75, 0]}
          />

          {/* Legend */}
          <View style={styles.legend}>
            {chartData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendLabel} numberOfLines={1}>
                  {item.x}
                </Text>
                <Text style={styles.legendValue}>{item.y}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyText}>No data available</Text>
          <Text style={styles.emptySubtext}>
            Log some habits to see breakdown
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
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: mainColors.backgroundInput,
    borderWidth: 1,
    borderColor: mainColors.border,
  },
  tabActive: {
    backgroundColor: mainColors.primary500,
    borderColor: mainColors.primary500,
  },
  tabIcon: {
    fontSize: 14,
  },
  tabText: {
    fontSize: 11,
    fontWeight: "600",
    color: mainColors.textSecondary,
  },
  tabTextActive: {
    color: mainColors.textOnPrimary,
  },
  chartContainer: {
    alignItems: "center",
  },
  legend: {
    width: "100%",
    marginTop: 16,
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: mainColors.textSecondary,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: "700",
    color: mainColors.textPrimary,
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
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: mainColors.backgroundInput,
  },
});

export default BreakdownCard;
