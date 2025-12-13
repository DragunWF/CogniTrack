/**
 * Reflection Chat Components - Barrel Export
 *
 * Exports all components used in the reflection chatbot screen.
 * This allows for cleaner imports throughout the application.
 *
 * Example:
 * import { ChatBubble, MessageInputBox, ReflectionChatContainer } from "@/presentation/components/reflectionChat";
 */

export { default as ChatBubble } from "./ChatBubble";
export { default as MessageInputBox } from "./MessageInputBox";
export { default as ChatHeader } from "./ChatHeader";
export { default as TypingIndicator } from "./TypingIndicator";
export {
  default as ReflectionChatContainer,
  type ChatMessage,
} from "./ReflectionChatContainer";
