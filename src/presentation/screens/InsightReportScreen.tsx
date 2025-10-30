import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { mainColors } from "../../shared/constants/colors";
import { formatDate, getInsightDateRange } from "../../shared/helpers/utils";
import InsightReport from "../../domain/entities/insightReport";
import {
  GetInsightReportsByDateRangeUseCase,
  CreateInsightReportUseCase,
} from "../../application/useCases/insightReportUseCases";
import { StackNavigationProp } from "@react-navigation/stack";
import DatePickerModal from "../components/common/DatePickerModal";

/**
 * InsightReportScreen - List view of AI-generated insight reports
 *
 * Features:
 * - Filter by time range (This Month, This Year, All Time)
 * - Display report cards with title and creation date
 * - FAB to generate new insights (mocked for now)
 * - Navigate to detail view on card tap
 *
 * Mock Flow:
 * 1. Tap FAB → Date picker modal
 * 2. Select end date → Confirmation alert
 * 3. Confirm → 2-second loading → Mock report created
 * 4. Navigate to detail screen with new report
 */

type FilterRange = "This Month" | "This Year" | "All Time";

type RootStackParamList = {
  InsightDetail: { reportId: number };
};

type NavigationProp = StackNavigationProp<RootStackParamList, "InsightDetail">;

function InsightReportScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [filterRange, setFilterRange] = useState<FilterRange>("This Month");
  const [reports, setReports] = useState<InsightReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Load reports based on selected filter
   */
  const loadReports = async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getInsightDateRange(filterRange);
      const useCase = new GetInsightReportsByDateRangeUseCase();
      const fetchedReports = await useCase.execute(startDate, endDate);
      setReports(fetchedReports);
    } catch (error) {
      console.error("Error loading reports:", error);
      setErrorMessage("Failed to load insight reports. Please try again.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reload reports when screen comes into focus
   */
  useFocusEffect(
    React.useCallback(() => {
      loadReports();
    }, [filterRange])
  );

  /**
   * Handle date selection from picker
   */
  const handleDateConfirm = (date: Date) => {
    setDatePickerVisible(false);

    // Calculate 30-day analysis period
    const endDate = date;
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - 30);

    // Start generation immediately
    generateMockReport(startDate, endDate);
  };

  /**
   * Mock AI generation with 2-second delay
   */
  const generateMockReport = async (startDate: Date, endDate: Date) => {
    setIsGenerating(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // Create mock report
      const mockReport: Omit<InsightReport, "id"> = {
        title: `Habit Analysis: ${formatDate(endDate)}`,
        content: `# 30-Day Habit Analysis\n\n## Overview\n\nThis is a **mocked** AI-generated insight report.\n\n### Analysis Period\n- Start: ${formatDate(
          startDate
        )}\n- End: ${formatDate(
          endDate
        )}\n\n### Key Findings\n\n- The real AI analysis will appear here.\n- Patterns and trends will be identified.\n- Actionable recommendations will be provided.\n\n### Next Steps\n\n1. Review your habit patterns\n2. Implement suggested strategies\n3. Track your progress\n\n---\n\n*This report was generated as a placeholder. Real AI insights coming soon!*`,
        createdAt: new Date(),
        notes: "",
      };

      // Save to database
      const createUseCase = new CreateInsightReportUseCase();
      const newReportId = await createUseCase.execute({
        ...mockReport,
        id: 0, // Will be ignored by database
      } as InsightReport);

      setIsGenerating(false);

      // Navigate to detail screen
      navigation.navigate("InsightDetail", { reportId: newReportId });
    } catch (error) {
      setIsGenerating(false);
      console.error("Error creating mock report:", error);
      setErrorMessage("Failed to generate insight report. Please try again.");
      setShowErrorModal(true);
    }
  };

  /**
   * Navigate to detail screen on card tap
   */
  const handleReportPress = (reportId: number) => {
    navigation.navigate("InsightDetail", { reportId });
  };

  /**
   * Render individual report card
   */
  const renderReportCard = ({ item }: { item: InsightReport }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleReportPress(item.id!)}
      activeOpacity={0.7}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Filter Bar */}
      <View style={styles.filterWrapper}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter</Text>
          <View style={styles.filterButtons}>
            {(["This Month", "This Year", "All Time"] as FilterRange[]).map(
              (filter) => {
                const isSelected = filterRange === filter;
                return (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterButton,
                      isSelected && styles.filterButtonSelected,
                    ]}
                    onPress={() => setFilterRange(filter)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        isSelected && styles.filterButtonTextSelected,
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </View>
      </View>

      {/* Report List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={mainColors.primary500} />
        </View>
      ) : reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📊 No insights yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to generate your first insight report
          </Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={renderReportCard}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* FAB - Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setDatePickerVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={isDatePickerVisible}
        title="Generate Insight Report"
        message="Select the end date for your 30-day habit analysis period"
        icon="🔮"
        onDateSelected={handleDateConfirm}
        onCancel={() => setDatePickerVisible(false)}
        maximumDate={new Date()}
      />

      {/* Loading Overlay for Generation */}
      {isGenerating && (
        <View style={styles.generatingOverlay}>
          <View style={styles.generatingCard}>
            <ActivityIndicator size="large" color={mainColors.primary500} />
            <Text style={styles.generatingText}>Generating Insights...</Text>
            <Text style={styles.generatingSubtext}>
              Analyzing your habit patterns
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainColors.background,
  },
  filterWrapper: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  filterContainer: {
    backgroundColor: mainColors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: mainColors.border,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: mainColors.textPrimary,
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: mainColors.backgroundInput,
    borderWidth: 1,
    borderColor: mainColors.border,
  },
  filterButtonSelected: {
    backgroundColor: mainColors.primary500,
    borderColor: mainColors.primary500,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: mainColors.textSecondary,
  },
  filterButtonTextSelected: {
    color: mainColors.textOnPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "700",
    color: mainColors.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: mainColors.textSecondary,
    textAlign: "center",
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    backgroundColor: mainColors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: mainColors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: mainColors.textPrimary,
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 12,
    color: mainColors.textSecondary,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: mainColors.primary500,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 32,
    fontWeight: "300",
    color: mainColors.textOnPrimary,
    marginTop: -2,
  },
  generatingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: mainColors.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  generatingCard: {
    backgroundColor: mainColors.backgroundCard,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: mainColors.border,
  },
  generatingText: {
    fontSize: 18,
    fontWeight: "700",
    color: mainColors.textPrimary,
    marginTop: 16,
  },
  generatingSubtext: {
    fontSize: 14,
    color: mainColors.textSecondary,
    marginTop: 8,
  },
});

export default InsightReportScreen;
