import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { mainColors } from "../../../shared/constants/colors";
import {
  TimeRange,
  TrendDataPoint,
} from "../../../application/useCases/badHabitStatsUseCases";

interface TrendsCardProps {
  data: TrendDataPoint[];
  timeRange: TimeRange;
  loading?: boolean;
}

function TrendsCard({ data, timeRange, loading = false }: TrendsCardProps) {
  const chartWidth = Dimensions.get("window").width - 65;
  const chartHeight = 220;

  const hasData = data.length > 0 && data.some((d) => d.value > 0);

  // Limit data points for better readability
  const getLimitedData = (): TrendDataPoint[] => {
    switch (timeRange) {
      case "This Month":
        // Show last 7 days
        return data.slice(-7);
      case "This Year":
        // Show last 6 months
        return data.slice(-6);
      case "All Time":
        // Show last 12 months/years
        return data.slice(-6);
      default:
        // Today and This Week show all data
        return data;
    }
  };

  const displayData = getLimitedData();

  // Get appropriate axis label based on time range
  const getXAxisLabel = (): string => {
    switch (timeRange) {
      case "Today":
        return "Hour of Day";
      case "This Week":
        return "Day of Week";
      case "This Month":
        return "Last 14 Days";
      case "This Year":
        return "Last 6 Months";
      case "All Time":
        return "Last 12 Periods";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trends</Text>
      <Text style={styles.subtitle}>{getXAxisLabel()}</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingPlaceholder} />
        </View>
      ) : hasData ? (
        <View style={styles.chartContainer}>
          <View style={styles.chartWrapper}>
            <BarChart
              data={{
                labels: displayData.map((d) => d.label),
                datasets: [
                  {
                    data: displayData.map((d) => d.value),
                  },
                ],
              }}
              width={chartWidth}
              height={chartHeight}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: mainColors.backgroundCard,
                backgroundGradientFrom: mainColors.backgroundCard,
                backgroundGradientTo: mainColors.backgroundCard,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(107, 95, 204, ${opacity})`,
                labelColor: (opacity = 1) => mainColors.textSecondary,
                style: {
                  borderRadius: 12,
                },
                propsForLabels: {
                  fontSize: timeRange === "Today" ? 8 : 10,
                },
              }}
              style={{
                borderRadius: 12,
                marginLeft: -40,
              }}
              fromZero
              showValuesOnTopOfBars={false}
            />
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>No trend data available</Text>
          <Text style={styles.emptySubtext}>
            Track more habits to see patterns
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
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: mainColors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: mainColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: mainColors.textSecondary,
    marginBottom: 16,
  },
  loadingContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: mainColors.background,
    borderRadius: 12,
    opacity: 0.5,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  chartWrapper: {
    overflow: "hidden",
    borderRadius: 12,
  },
  emptyState: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: mainColors.textSecondary,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 13,
    color: mainColors.textSecondary,
    opacity: 0.7,
    textAlign: "center",
  },
});

export default TrendsCard;
