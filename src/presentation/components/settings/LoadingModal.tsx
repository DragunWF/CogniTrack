import React from "react";
import { StyleSheet, View, Text, Modal, ActivityIndicator } from "react-native";
import { mainColors } from "../../../shared/constants/colors";

/**
 * LoadingModal - Full-screen loading indicator modal
 *
 * Displays a loading spinner with optional message during async operations.
 * Blocks user interaction while processing.
 *
 * Architecture Layer: Presentation (UI Component)
 */

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

function LoadingModal({
  visible,
  message = "Processing...",
}: LoadingModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={mainColors.primary500} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
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
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: mainColors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: mainColors.textPrimary,
    textAlign: "center",
  },
});

export default LoadingModal;
