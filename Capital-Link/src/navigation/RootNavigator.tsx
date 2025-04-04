import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import OtpVerificationScreen from "../screens/auth/OtpVerificationScreen";
import InitialEntry from "../screens/auth/InitialEntryScreen";
import PinSetupScreen from "../screens/pin/PinSetupScreen";
import PinConfirmScreen from "../screens/pin/PinConfirmScreen";
import PinEntryScreen from "../screens/pin/PinEntryScreen";
import Home from "../screens/home/HomeScreen";
import Account from "../screens/accounts/AccountScreen";
import Deposit from "../screens/accounts/DepositScreen";
import Loan from "../screens/accounts/LoanScreen";
import Notification from "../screens/notifications/NotificationScreen";
import Profile from "../screens/Profile/ProfileScreen";
import OldPin from "../screens/pin/OldPinVerifyScreen";
import NameChange from "../screens/Profile/NameChangeRequestScreen";
import PhoneChange from "../screens/Profile/PhoneChangeRequestScreen";

// 🧠 ประกาศ Type ของ Route ทั้งหมด
export type RootStackParamList = {
  InitialEntry: undefined;
  Login: undefined;
  Register: undefined;
  OtpVerification: { from: "Login" | "Register" };
  PinSetup: undefined;
  PinConfirm: { firstPin: string };
  PinEntry: undefined;
  Home: undefined;
  Account: undefined;
  Deposit: undefined;
  Loan: undefined;
  Notification: undefined; 
  Profile: undefined; 
  OldPin: undefined;
  NameChange: undefined;
  PhoneChange: undefined;
};

// ✅ ใส่ generic ชัดเจน
const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      // 🔧 ป้องกัน TypeScript error โดยระบุ id ให้ชัดเจน
      id={undefined}
       //initialRouteName="PinSetup"
       initialRouteName="PhoneChange"
      screenOptions={{ headerShown: false, animation: "none" }}
    >
      {/* <Stack.Screen name="Splash" component={SplashScreen} /> */}
      <Stack.Screen name="InitialEntry" component={InitialEntry} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="PinSetup" component={PinSetupScreen} />
      <Stack.Screen name="PinConfirm" component={PinConfirmScreen} />
      <Stack.Screen name="PinEntry" component={PinEntryScreen} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Deposit" component={Deposit} />
      <Stack.Screen name="Loan" component={Loan} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="OldPin" component={OldPin} />
      <Stack.Screen name="NameChange" component={NameChange} />
      <Stack.Screen name="PhoneChange" component={PhoneChange} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
