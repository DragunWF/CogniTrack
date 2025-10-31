import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import Markdown from "react-native-markdown-display";
import { mainColors, utilityColors } from "../../shared/constants/colors";
import { formatDate } from "../../shared/helpers/utils";
import InsightReport from "../../domain/entities/insightReport";
import {
  GetInsightReportByIdUseCase,
  UpdateInsightNotesUseCase,
} from "../../application/useCases/insightReportUseCases";
import ErrorModal from "../components/common/ErrorModal";
import SuccessModal from "../components/common/SuccessModal";

/**
 * InsightDetailScreen - Detailed view of a single AI-generated insight report
 *
 * Features:
 * - Display report title and creation date
 * - Render AI-generated markdown content with custom dark theme styling
 * - Editable notes section for user personal reflections
 * - Save notes functionality with success/error feedback
 *
 * Navigation:
 * - Receives reportId via route params
 * - Fetches full report from database on mount
 * - Displays error and navigates back if report not found
 *
 * Architecture Layer: Presentation (Screen Component)
 */

type RootStackParamList = {
  InsightDetail: { reportId: number };
};

type InsightDetailRouteProp = RouteProp<RootStackParamList, "InsightDetail">;

function InsightDetailScreen() {
  const route = useRoute<InsightDetailRouteProp>();
  const navigation = useNavigation();
  const { reportId } = route.params;

  const [report, setReport] = useState<InsightReport | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Load report data on mount
   */
  useEffect(() => {
    loadReport();
  }, [reportId]);

  /**
   * Fetch report from database
   */
  const loadReport = async () => {
    setLoading(true);
    try {
      console.log("🔍 Loading report with ID:", reportId);
      const useCase = new GetInsightReportByIdUseCase();
      const fetchedReport = await useCase.execute(reportId);

      if (!fetchedReport) {
        console.log("❌ Report not found in database");
        setErrorMessage("Report not found. It may have been deleted.");
        setShowErrorModal(true);
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
        return;
      }

      console.log("✅ Report loaded successfully:", {
        title: fetchedReport.title,
        contentLength: fetchedReport.content?.length || 0,
        hasNotes: !!fetchedReport.notes,
      });

      setReport(fetchedReport);
      setNotes(fetchedReport.notes || "");
    } catch (error) {
      console.error("❌ Error loading report:", error);
      setErrorMessage("Failed to load insight report. Please try again.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save user notes to database
   */
  const saveNotes = async () => {
    if (!report) return;

    setSaving(true);
    try {
      const useCase = new UpdateInsightNotesUseCase();
      await useCase.execute(reportId, notes);

      // Update local report state
      setReport({ ...report, notes });

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error saving notes:", error);
      setErrorMessage("Failed to save notes. Please try again.");
      setShowErrorModal(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={mainColors.primary500} />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Report not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>{report.title}</Text>
          <Text style={styles.date}>
            Generated: {formatDate(report.createdAt)}
          </Text>
        </View>
        {/* AI-Generated Content */}
        <View style={styles.contentCard}>
          <Markdown style={markdownStyles}>{report.content}</Markdown>
        </View>
        {/* User Notes Section */}
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>📝 My Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add your personal thoughts and reflections..."
            placeholderTextColor={mainColors.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={saveNotes}
            disabled={saving}
            activeOpacity={0.7}
          >
            {saving ? (
              <ActivityIndicator
                size="small"
                color={mainColors.textOnPrimary}
              />
            ) : (
              <Text style={styles.saveButtonText}>Save Notes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        message="Your notes have been saved successfully!"
        onDismiss={() => setShowSuccessModal(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={showErrorModal}
        message={errorMessage}
        onDismiss={() => setShowErrorModal(false)}
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
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: mainColors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: mainColors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: mainColors.textSecondary,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: mainColors.textPrimary,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: mainColors.textSecondary,
  },
  contentCard: {
    backgroundColor: mainColors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: mainColors.border,
  },
  notesSection: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: mainColors.textPrimary,
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: mainColors.backgroundInput,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: mainColors.textPrimary,
    borderWidth: 1,
    borderColor: mainColors.border,
    minHeight: 120,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: mainColors.primary500,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: mainColors.textOnPrimary,
  },
});

/**
 * Markdown styling to match dark theme
 */
const markdownStyles = {
  body: {
    color: mainColors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
  },
  heading1: {
    color: mainColors.textPrimary,
    fontSize: 22,
    fontWeight: "700" as const,
    marginTop: 16,
    marginBottom: 8,
  },
  heading2: {
    color: mainColors.textPrimary,
    fontSize: 18,
    fontWeight: "700" as const,
    marginTop: 12,
    marginBottom: 6,
  },
  heading3: {
    color: mainColors.textPrimary,
    fontSize: 16,
    fontWeight: "600" as const,
    marginTop: 10,
    marginBottom: 4,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 12,
    color: mainColors.textPrimary,
  },
  strong: {
    fontWeight: "700" as const,
    color: mainColors.primary300,
  },
  em: {
    fontStyle: "italic" as const,
    color: mainColors.accent300,
  },
  bullet_list: {
    marginBottom: 12,
  },
  ordered_list: {
    marginBottom: 12,
  },
  list_item: {
    marginBottom: 6,
    color: mainColors.textPrimary,
  },
  code_inline: {
    backgroundColor: mainColors.backgroundInput,
    color: mainColors.accent300,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: "monospace" as const,
  },
  code_block: {
    backgroundColor: mainColors.backgroundInput,
    color: mainColors.textPrimary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontFamily: "monospace" as const,
  },
  hr: {
    backgroundColor: mainColors.border,
    height: 1,
    marginVertical: 16,
  },
  link: {
    color: mainColors.accent500,
    textDecorationLine: "underline" as const,
  },
};

export default InsightDetailScreen;
