import React, { useRef, useEffect } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import RootNavigator from "./src/navigation/RootNavigator";
import { Provider as PaperProvider } from "react-native-paper";
import { registerTranslation, th } from "react-native-paper-dates";
import { DataProvider, useData } from "./src/Provide/Auth/UserDataProvide";
import { isCategoryEnabled } from "./src/services/NotiPush";
Notifications.setNotificationHandler({
  handleNotification: async ({ request }) => {
    const data = request.content.data;
    const notiKey = String(data.key || data.type || "unknown");
    const enabled = await isCategoryEnabled(notiKey);

    return {
      shouldShowAlert: enabled,
      shouldPlaySound: enabled,
      shouldSetBadge: enabled,
      shouldShowBanner: enabled,
      shouldShowList: enabled,
    };
  },
});
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
