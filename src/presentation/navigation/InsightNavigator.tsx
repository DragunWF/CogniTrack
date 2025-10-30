import { createStackNavigator } from "@react-navigation/stack";

import { INSIGHT_NAVIGATION_ROUTES } from "../../shared/constants/navigation";
import InsightDetailScreen from "../screens/InsightDetailScreen";

const Stack = createStackNavigator();

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
      />
    </Stack.Navigator>
  );
}

export default InsightNavigator;
