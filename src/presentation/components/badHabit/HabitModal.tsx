import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { mainColors } from "../../../shared/constants/colors";
import { CreateBadHabitUseCase } from "../../../application/useCases/badHabitUseCases";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";
import BadHabit from "../../../domain/entities/badHabit";
import {
  NAME_CONSTRAINTS,
  DESCRIPTION_CONSTRAINTS,
  NOTES_CONSTRAINTS,
} from "../../../application/validators/badHabitValidator";

/**
 * HabitModal Component
 *
 * A modal for adding or editing bad habits.
 * Includes form validation and handles both create and edit modes.
 *
 * Features:
 * - Create new habit with name, description, and optional notes
 * - Edit existing habit (pre-fills form)
 * - Form validation with error messages
 * - Keyboard-aware scrolling
 * - Smooth animations
 *
 * @param visible - Whether modal is visible
 * @param mode - 'add' or 'edit'
 * @param habitData - Pre-filled data for edit mode
 * @param onClose - Callback when modal is closed
 * @param onSubmit - Callback when form is submitted
 */

// This determines the type of the habit modal's mode
export const enum HabitModalModeEnum {
  ADD = "add",
  EDIT = "edit",
}

interface HabitModalProps {
  visible: boolean;
  mode: HabitModalModeEnum;
  habitData?: BadHabit;
  onClose: () => void;
  onSubmit: (data: BadHabit) => Promise<void>;
}

function HabitModal({
  visible,
  mode,
  habitData,
  onClose,
  onSubmit,
}: HabitModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {}
  );

  // Pre-fill form when editing
  useEffect(() => {
    if (mode === HabitModalModeEnum.EDIT && habitData) {
      setName(habitData.name || "");
      setDescription(habitData.description || "");
      setNotes(habitData.notes || "");
    } else {
      // Reset form when switching to add mode
      setName("");
      setDescription("");
      setNotes("");
    }
    setErrors({});
  }, [mode, habitData, visible]);

  /**
   * Validates the form fields
   * Returns true if all validations pass, false otherwise
   * Sets error messages for invalid fields
   */
  const validateForm = (): boolean => {
    const newErrors: { name?: string; description?: string } = {};

    // Validate name field
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Validate description field
    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   * Validates form and calls onSubmit callback with cleaned data
   * Only closes modal if submission succeeds
   */
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await onSubmit({
          id: habitData?.id,
          name: name.trim(),
          description: description.trim(),
          datetime: habitData?.datetime || Date.now(),
          notes: notes.trim() || undefined,
        });
        handleClose();
      } catch (error) {
        // Don't close modal on error - let user try again
        console.error("Modal submission error:", error);
      }
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setNotes("");
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {mode === HabitModalModeEnum.ADD
                  ? "Add Bad Habit"
                  : "Edit Bad Habit"}
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="close"
                  size={28}
                  color={mainColors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.form}>
                <TextInput
                  label="Habit Name *"
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g., Social Media Scrolling"
                  error={errors.name}
                  autoFocus={mode === HabitModalModeEnum.ADD}
                  maxLength={50}
                />

                <TextInput
                  label="Description *"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe this habit..."
                  error={errors.description}
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                />

                <TextInput
                  label="Notes (Optional)"
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Any additional context or triggers..."
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                />

                <Text style={styles.helperText}>* Required fields</Text>
              </View>
            </ScrollView>

            {/* Actions */}
            <View style={styles.actions}>
              <Button
                title="Cancel"
                onPress={handleClose}
                variant="secondary"
                style={styles.actionButton}
              />
              <Button
                title={
                  mode === HabitModalModeEnum.ADD ? "Add Habit" : "Save Changes"
                }
                onPress={handleSubmit}
                variant="primary"
                style={styles.actionButton}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: mainColors.overlay,
    justifyContent: "flex-end",
  },
  keyboardView: {
    width: "100%",
  },
  modalContainer: {
    backgroundColor: mainColors.backgroundElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: mainColors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: mainColors.textPrimary,
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  scrollView: {
    maxHeight: 400,
  },
  form: {
    padding: 20,
  },
  helperText: {
    fontSize: 12,
    color: mainColors.textMuted,
    marginTop: 8,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: mainColors.border,
  },
  actionButton: {
    flex: 1,
  },
});

export default HabitModal;
