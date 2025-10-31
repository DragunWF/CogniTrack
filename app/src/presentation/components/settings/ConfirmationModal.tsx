import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { mainColors, utilityColors } from "../../../shared/constants/colors";

/**
 * ConfirmationModal - Customizable confirmation dialog
 *
 * Displays a two-button confirmation dialog for destructive or important actions.
 * Supports danger mode for critical operations.
 *
 * Architecture Layer: Presentation (UI Component)
 */

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean; // If true, uses red/warning styling
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{isDanger ? "⚠️" : "❓"}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                isDanger && styles.dangerButton,
              ]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
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
  confirmButton: {
    backgroundColor: mainColors.primary500,
  },
  dangerButton: {
    backgroundColor: utilityColors.error500,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: mainColors.textOnPrimary,
  },
});

export default ConfirmationModal;
