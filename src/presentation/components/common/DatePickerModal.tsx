import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { mainColors } from "../../../shared/constants/colors";

/**
 * DatePickerModal - Styled date picker modal for the app
 *
 * Wraps react-native-modal-datetime-picker with custom UI
 * Follows Cognitive Clarity dark theme design
 */

interface DatePickerModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  icon?: string;
  onDateSelected: (date: Date) => void;
  onCancel: () => void;
  maximumDate?: Date;
  minimumDate?: Date;
}

function DatePickerModal({
  visible,
  title = "Select Date",
  message = "Choose the end date for your habit analysis period",
  icon = "📅",
  onDateSelected,
  onCancel,
  maximumDate,
  minimumDate,
}: DatePickerModalProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [internalModalVisible, setInternalModalVisible] = useState(visible);

  // Sync internal visibility with prop
  React.useEffect(() => {
    setInternalModalVisible(visible);
  }, [visible]);

  const handleOpenPicker = () => {
    // Hide the custom modal first, then show the native picker
    setInternalModalVisible(false);
    // Small delay to ensure modal is dismissed before showing picker
    setTimeout(() => {
      setShowPicker(true);
    }, 100);
  };

  const handleDateConfirm = (date: Date) => {
    setShowPicker(false);
    onDateSelected(date);
  };

  const handleDateCancel = () => {
    setShowPicker(false);
    // Show the custom modal again if user cancels
    setInternalModalVisible(true);
  };

  const handleModalCancel = () => {
    setInternalModalVisible(false);
    onCancel();
  };

  return (
    <>
      <Modal
        visible={internalModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleModalCancel}
      >
        <Pressable style={styles.overlay} onPress={handleModalCancel}>
          <Pressable
            style={styles.container}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{icon}</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{title}</Text>

            {/* Message */}
            <Text style={styles.message}>{message}</Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleModalCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.selectButton]}
                onPress={handleOpenPicker}
                activeOpacity={0.7}
              >
                <Text style={styles.selectButtonText}>Select Date</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Native Date Picker */}
      <DateTimePickerModal
        isVisible={showPicker}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: mainColors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: mainColors.backgroundCard,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    borderWidth: 1,
    borderColor: mainColors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: mainColors.textPrimary,
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: mainColors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: mainColors.backgroundInput,
    borderWidth: 1,
    borderColor: mainColors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: mainColors.textSecondary,
  },
  selectButton: {
    backgroundColor: mainColors.primary500,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: mainColors.textOnPrimary,
  },
});

export default DatePickerModal;
