import React, { useRef } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import { Provider as PaperProvider } from "react-native-paper";
import { registerTranslation, th } from "react-native-paper-dates";
import { DataProvider } from "./src/Provide/Auth/UserDataProvide";

export default function App() {
  const navigationRef = useRef(null); // ไม่ต้องระบุ generic
  registerTranslation("th", th);
  return (
    <PaperProvider>
      <DataProvider>
        <NavigationContainer
          ref={navigationRef}
          onStateChange={() => {
            const currentRoute = navigationRef.current?.getCurrentRoute();
            console.log("📍 Current screen:", currentRoute?.name);
          }}
        >
          <RootNavigator />
        </NavigationContainer>
      </DataProvider>
    </PaperProvider>
  );
}
