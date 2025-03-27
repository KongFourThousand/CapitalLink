import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import OtpVerificationScreen from "../screens/auth/OtpVerificationScreen";
import InitialEntry from "../screens/auth/InitialEntryScreen";
import PinSetupScreen from "../screens/pin/PinSetupScreen";
import PinConfirmScreen from "../screens/pin/PinConfirmScreen";
import PinEntryScreen from "../screens/pin/PinEntryScreen";
import HomeScreen from "../screens/home/HomeScreen";
import AccountScreen from "../screens/accounts/AccountScreen";
import MainTab from "../navigation/MainTabNavigator";

// เพิ่มการนำเข้าหน้าจอรายละเอียด
import DepositDetailScreen from "../screens/accounts/DepositDetailScreen";
import LoanDetailScreen from "../screens/accounts/LoanDetailScreen";

// 🧠 ประกาศ Type ของ Route ทั้งหมด
export type RootStackParamList = {
  InitialEntry: undefined;
  Login: undefined;
  Register: undefined;
  OtpVerification: { from: "Login" | "Register" };
  PinSetup: undefined;
  PinConfirm: { firstPin: string }; 
  PinEntry: undefined;
  HomeScreen: undefined; 
  AccountScreen: undefined; 
  MainTab: undefined;
  // เพิ่ม route สำหรับหน้ารายละเอียด
  DepositDetail: { accountId?: string };
  LoanDetail: { loanId?: string };
};

// ✅ ใส่ generic ชัดเจน
const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      // 🔧 ป้องกัน TypeScript error โดยระบุ id ให้ชัดเจน
      id={undefined}
      initialRouteName="HomeScreen"
      //initialRouteName="InitialEntry"
      screenOptions={{ headerShown: false }}
    >
      {/* <Stack.Screen name="Splash" component={SplashScreen} /> */}
      <Stack.Screen name="InitialEntry" component={InitialEntry} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="PinSetup" component={PinSetupScreen} />
      <Stack.Screen name="PinConfirm" component={PinConfirmScreen} />
      <Stack.Screen name="PinEntry" component={PinEntryScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} /> 
      <Stack.Screen name="MainTab" component={MainTab} /> 
      
      {/* เพิ่ม Screen สำหรับหน้ารายละเอียด */}
      <Stack.Screen name="DepositDetail" component={DepositDetailScreen} />
      <Stack.Screen name="LoanDetail" component={LoanDetailScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;