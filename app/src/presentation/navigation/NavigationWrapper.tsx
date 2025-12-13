import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { mainColors } from "../../shared/constants/colors";
import AppNavigator from "./AppNavigator";
import InsightNavigator from "./InsightNavigator";
import { NAVIGATOR_NAMES } from "../../shared/constants/navigation";

/**
 * Root Stack Navigator for the app
 * Handles both tab navigation and modal/detail screens
 */

const Stack = createStackNavigator();

function NavigationWrapper() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: mainColors.backgroundElevated,
            borderBottomColor: mainColors.border,
            borderBottomWidth: 1,
          },
          headerTintColor: mainColors.textPrimary,
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: mainColors.background,
          },
        }}
      >
        {/* Main App with Bottom Tabs */}
        <Stack.Screen
          name={NAVIGATOR_NAMES.APP_NAVIGATOR as string}
          component={AppNavigator}
          options={{
            headerShown: false,
            headerTitle: "Insights", // This is set for the back button of viewing an insight report
          }}
        />

        {/* Insight Detail Screen */}
        <Stack.Screen
          name={NAVIGATOR_NAMES.INSIGHT_NAVIGATOR as string}
          component={InsightNavigator}
          options={{
            title: "Insight Report",
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NavigationWrapper;
