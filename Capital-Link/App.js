import React, { useRef } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  const navigationRef = useRef(null); // ไม่ต้องระบุ generic
  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        const currentRoute = navigationRef.current?.getCurrentRoute();
        console.log("📍 Current screen:", currentRoute?.name);
      }}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}
