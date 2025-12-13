import { StyleSheet, View, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { mainColors } from "../../../shared/constants/colors";

/**
 * TypingIndicator - Animated loading indicator showing AI is typing
 *
 * Features:
 * - Three animated dots that bounce in sequence
 * - Smooth, continuous animation loop
 * - Matches the theme color scheme
 * - Used when waiting for AI response
 *
 * Architecture: Presentation (Dumb Component)
 */

function TypingIndicator() {
  const dotAnimations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    // Create staggered animation for each dot
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    dotAnimations.forEach((dot, index) => {
      animateDot(dot, index * 200);
    });
  }, []);

  const getDotOpacity = (animatedValue: Animated.Value) => {
    return animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    });
  };

  const getDotScale = (animatedValue: Animated.Value) => {
    return animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1.2],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.bubbleContainer}>
        {dotAnimations.map((dotAnim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                opacity: getDotOpacity(dotAnim),
                transform: [{ scale: getDotScale(dotAnim) }],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
    alignItems: "flex-start",
  },
  bubbleContainer: {
    flexDirection: "row",
    backgroundColor: mainColors.backgroundCard,
    borderWidth: 1,
    borderColor: mainColors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: mainColors.accent500,
  },
});

export default TypingIndicator;
