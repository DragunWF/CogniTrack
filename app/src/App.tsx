import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";

import NavigationWrapper from "./presentation/navigation/NavigationWrapper";
import {
  initDatabase,
  resetDatabase,
} from "./infrastructure/database/coreStorage";

export default function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        // Initializes the database once the app loads

        // Uncomment this when you want to reset the database during development
        // await resetDatabase();

        await initDatabase();
        setIsDbInitialized(true);
        console.log("✅ Database initialized in App.tsx");
      } catch (error) {
        console.error("❌ Failed to initialize database:", error);
      }
    };

    initializeDb();
  }, []);

  if (!isDbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationWrapper />
      <Toast />
    </>
  );
}
