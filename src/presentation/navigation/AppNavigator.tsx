import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import BadHabitScreen from "../screens/BadHabitScreen";
import BadHabitsOverviewScreen from "../screens/BadHabitsOverviewScreen";
import StatsScreen from "../screens/StatsScreen";
import InsightReportScreen from "../screens/InsightReportScreen";

import {
  NAVIGATOR_NAMES,
  APP_NAVIGATION_ROUTES,
} from "../../shared/constants/navigation";

const BottomTab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <BottomTab.Navigator
      id={NAVIGATOR_NAMES.APP_NAVIGATOR as any}
      initialRouteName={APP_NAVIGATION_ROUTES.BAD_HABIT}
    >
      <BottomTab.Screen
        name={APP_NAVIGATION_ROUTES.BAD_HABIT}
        component={BadHabitScreen}
        options={{ tabBarLabel: "Bad Habits" }}
      />
      <BottomTab.Screen
        name={APP_NAVIGATION_ROUTES.BAD_HABITS_OVERVIEW}
        component={BadHabitsOverviewScreen}
        options={{ tabBarLabel: "Overview" }}
      />
      <BottomTab.Screen
        name={APP_NAVIGATION_ROUTES.STATS}
        component={StatsScreen}
        options={{ tabBarLabel: "Stats" }}
      />
      <BottomTab.Screen
        name={APP_NAVIGATION_ROUTES.INSIGHT_REPORT}
        component={InsightReportScreen}
        options={{ tabBarLabel: "Insights" }}
      />
    </BottomTab.Navigator>
  );
}

export default AppNavigator;
