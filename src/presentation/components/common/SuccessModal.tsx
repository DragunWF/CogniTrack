import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { mainColors } from "../../../shared/constants/colors";

/**
 * SuccessModal - Success message display modal
 *
 * Displays success messages to the user with a single dismiss button.
 * Used for confirming successful operations like saving notes, etc.
 *
 * Architecture Layer: Presentation (UI Component)
 */

interface SuccessModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onDismiss: () => void;
}

function SuccessModal({
  visible,
  title = "Success",
  message,
  onDismiss,
}: SuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✅</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Dismiss Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={onDismiss}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
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
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: mainColors.primary500,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: mainColors.textOnPrimary,
  },
});

export default SuccessModal;
