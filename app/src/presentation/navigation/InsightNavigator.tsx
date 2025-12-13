import { createStackNavigator } from "@react-navigation/stack";

import { INSIGHT_NAVIGATION_ROUTES } from "../../shared/constants/navigation";
import InsightDetailScreen from "../screens/InsightDetailScreen";
import ReflectionChatScreen from "../screens/ReflectionChatScreen";

/**
 * Type definitions for the Insight stack navigator
 */
export type InsightStackParamList = {
  [INSIGHT_NAVIGATION_ROUTES.INSIGHT_DETAIL]: { reportId: number };
  [INSIGHT_NAVIGATION_ROUTES.REFLECTION_CHATBOT]: { reportId: number };
};

const Stack = createStackNavigator<InsightStackParamList>();

/**
 * InsightNavigator
 *
 * Stack navigator for insight report related screens.
 * Currently includes:
 * - InsightDetailScreen: Detailed view of a single insight report
 */
function InsightNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={INSIGHT_NAVIGATION_ROUTES.INSIGHT_DETAIL}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name={INSIGHT_NAVIGATION_ROUTES.INSIGHT_DETAIL}
        component={InsightDetailScreen}
        options={{
          headerShown: false,
          title: "Insight Report",
          headerBackTitle: "Insights",
        }}
      />
      <Stack.Screen
        name={INSIGHT_NAVIGATION_ROUTES.REFLECTION_CHATBOT}
        component={ReflectionChatScreen}
        options={{
          headerShown: false,
          title: "Reflection Chatbot",
          headerBackTitle: "Back",
        }}
      />
    </Stack.Navigator>
  );
}

export default InsightNavigator;
