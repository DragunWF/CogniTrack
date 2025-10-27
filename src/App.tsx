import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import NavigationWrapper from "./presentation/navigation/NavigationWrapper";
import Toast from "react-native-toast-message";

export default function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  useEffect(() => {
    const initializeDb = async () => {
      // Initializes the database once the app loads
      setIsDbInitialized(true);
    };
    initializeDb();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <NavigationWrapper />
      <Toast />
    </>
  );
}
