import { useState, useEffect } from "react";

/**
 * useTypewriter - Custom hook for typewriter text animation effect
 *
 * Animates text character by character with a configurable delay.
 * Useful for creating engaging UI effects when displaying AI responses.
 *
 * @param text - The full text to animate
 * @param delayMs - Delay between each character in milliseconds (default: 30ms)
 * @param enabled - Whether the animation is enabled (default: true)
 *
 * @returns The animated text (partial or full based on animation progress)
 *
 * Example:
 * const animatedText = useTypewriter("Hello World", 30);
 * // Gradually reveals: "H", "He", "Hel", ..., "Hello World"
 */
export function useTypewriter(
  text: string,
  delayMs: number = 30,
  enabled: boolean = true,
): string {
  const [displayedText, setDisplayedText] = useState<string>("");

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayedText(text);
      return;
    }

    let currentIndex = 0;
    let animationTimeout: NodeJS.Timeout;

    const animateText = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
        animationTimeout = setTimeout(animateText, delayMs);
      } else {
        setDisplayedText(text);
      }
    };

    // Start animation
    animateText();

    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
    };
  }, [text, delayMs, enabled]);

  return displayedText;
}
