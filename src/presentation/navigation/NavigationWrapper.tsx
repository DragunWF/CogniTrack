import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./AppNavigator";

function NavigationWrapper() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default NavigationWrapper;
