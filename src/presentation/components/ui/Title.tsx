import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { mainColors } from "../../../shared/constants/colors";

/**
 * Title Component
 *
 * A reusable title component for screen headers.
 * Provides consistent typography and theming across the app.
 *
 * @param children - The title text content
 * @param textStyles - Optional additional text styles to override defaults
 */

interface TitleProps {
  children: React.ReactNode;
  textStyles?: object;
}

function Title({ children, textStyles }: TitleProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, textStyles]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: mainColors.textPrimary,
  },
});

export default Title;
