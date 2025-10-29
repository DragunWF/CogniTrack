import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import BadHabitScreen from "../screens/BadHabitScreen";
import BadHabitsOverviewScreen from "../screens/BadHabitsOverviewScreen";
import StatsScreen from "../screens/StatsScreen";
import InsightReportScreen from "../screens/InsightReportScreen";

import {
  NAVIGATOR_NAMES,
  APP_NAVIGATION_ROUTES,
} from "../../shared/constants/navigation";
import { mainColors } from "../../shared/constants/colors";
import SettingsScreen from "../screens/SettingsScreen";

const BottomTab = createBottomTabNavigator();

/**
 * AppNavigator
 *
 * Main bottom tab navigator for the CogniTrack app.
 * Features dark theme styling with psychology-based color palette
 * and intuitive icons for each screen.
 */
function AppNavigator() {
  return (
    <BottomTab.Navigator
      id={NAVIGATOR_NAMES.APP_NAVIGATOR as any}
      initialRouteName={APP_NAVIGATION_ROUTES.BAD_HABIT}
      screenOptions={{
        // Tab bar styling
        tabBarStyle: {
          backgroundColor: mainColors.backgroundElevated,
          borderTopColor: mainColors.border,
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: mainColors.shadowStrong,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 1,
          shadowRadius: 8,
        },
        // Active tab styling
        tabBarActiveTintColor: mainColors.primary500,
        tabBarInactiveTintColor: mainColors.textMuted,
        // Label styling
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.3,
        },
        // Icon styling
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <BottomTab.Screen
        name={APP_NAVIGATION_ROUTES.BAD_HABIT}
        component={BadHabitScreen}
        options={{
          tabBarLabel: "Tracker",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "checkbox" : "checkbox-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name={APP_NAVIGATION_ROUTES.BAD_HABITS_OVERVIEW}
        component={BadHabitsOverviewScreen}
        options={{
          tabBarLabel: "Overview",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name={APP_NAVIGATION_ROUTES.STATS}
        component={StatsScreen}
        options={{
          tabBarLabel: "Stats",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "bar-chart" : "bar-chart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name={APP_NAVIGATION_ROUTES.INSIGHT_REPORT}
        component={InsightReportScreen}
        options={{
          tabBarLabel: "Insights",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "bulb" : "bulb-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name={APP_NAVIGATION_ROUTES.SETTINGS}
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

export default AppNavigator;
