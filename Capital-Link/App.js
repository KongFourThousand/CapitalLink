import React, { useRef, useEffect } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import RootNavigator from "./src/navigation/RootNavigator";
import { Provider as PaperProvider } from "react-native-paper";
import { registerTranslation, th } from "react-native-paper-dates";
import { DataProvider } from "./src/Provide/Auth/UserDataProvide";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
export default function App() {
  const navigationRef = useRef(null); // ไม่ต้องระบุ generic
  registerTranslation("th", th);
  // ขอ Permission สำหรับ Local Notifications
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission for notifications not granted!");
      }
    })();
  }, []);
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
