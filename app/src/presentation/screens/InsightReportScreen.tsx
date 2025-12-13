import { useState, useCallback } from "react";
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
import { GenerateInsightUseCase } from "../../application/useCases/generateInsightUseCase";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  NAVIGATOR_NAMES,
  INSIGHT_NAVIGATION_ROUTES,
} from "../../shared/constants/navigation";
import DatePickerModal from "../components/common/DatePickerModal";
import ErrorModal from "../components/common/ErrorModal";

/**
 * InsightReportScreen - List view of AI-generated insight reports
 *
 * Features:
 * - Filter by time range (This Month, This Year, All Time)
 * - Display report cards with title and creation date
 * - FAB to generate new AI-powered insights
 * - Navigate to detail view on card tap
 *
 * Generation Flow:
 * 1. Tap FAB → Date picker modal
 * 2. Select end date → AI analyzes 30-day period
 * 3. Gemini API generates insights → Report saved
 * 4. Navigate to detail screen with new report
 *
 * Architecture Layer: Presentation (Screen Component)
 */

type FilterRange = "This Month" | "This Year" | "All Time";

type RootStackParamList = {
  [NAVIGATOR_NAMES.INSIGHT_NAVIGATOR]: {
    screen: typeof INSIGHT_NAVIGATION_ROUTES.INSIGHT_DETAIL;
    params: { reportId: number };
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

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
    useCallback(() => {
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
   * Generate AI-powered insight report
   * Fetches bad habit data from the date range and uses Gemini API for analysis
   */
  const generateMockReport = async (startDate: Date, endDate: Date) => {
    setIsGenerating(true);

    try {
      // Generate insights using AI
      const generateUseCase = new GenerateInsightUseCase();
      const { title, content } = await generateUseCase.execute(
        startDate,
        endDate
      );

      // Create and save report
      const report: Omit<InsightReport, "id"> = {
        title,
        content,
        createdAt: new Date(),
        notes: "",
      };

      const createUseCase = new CreateInsightReportUseCase();
      const newReportId = await createUseCase.execute({
        ...report,
        id: 0, // Will be ignored by database
      } as InsightReport);

      setIsGenerating(false);

      // Navigate to detail screen
      navigation.navigate(NAVIGATOR_NAMES.INSIGHT_NAVIGATOR as any, {
        screen: INSIGHT_NAVIGATION_ROUTES.INSIGHT_DETAIL,
        params: { reportId: newReportId },
      });
    } catch (error) {
      setIsGenerating(false);
      console.error("Error generating insight report:", error);
      setErrorMessage(
        "Failed to generate insight report. Please check your internet connection and try again."
      );
      setShowErrorModal(true);
    }
  };

  /**
   * Navigate to detail screen on card tap
   */
  const handleReportPress = (reportId: number) => {
    navigation.navigate(NAVIGATOR_NAMES.INSIGHT_NAVIGATOR as any, {
      screen: INSIGHT_NAVIGATION_ROUTES.INSIGHT_DETAIL,
      params: { reportId },
    });
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

      {/* Error Modal */}
      <ErrorModal
        visible={showErrorModal}
        message={errorMessage}
        onDismiss={() => setShowErrorModal(false)}
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
