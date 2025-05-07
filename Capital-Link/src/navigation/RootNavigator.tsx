import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
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
import OldPin from "../screens/Profile/ChangePin/OldPinVerifyScreen";
import NameChange from "../../src/screens/Profile/ChangeData/NameChangeRequestScreen";
import PhoneChange from "../screens/Profile/ChangeData/PhoneChangeRequestScreen";
import NotiSettings from "../screens/Profile/NotificationSettingsScreen";
import NewPinSetup from "../screens/Profile/ChangePin/NewPinSetupScreen";
import NewPinConfirm from "../screens/Profile/ChangePin/NewPinConfirmScreen";
import PinLocked from "../screens/pin/PinLockedScreen";
import ChangeDataUser from "../screens/Profile/ChangeData/ChangeDataUser";
import EmailChangeRequest from "../screens/Profile/ChangeData/EmailChangeRequest";
import AddressChangeRequest from "../screens/Profile/ChangeData/AddressChangeRequest";
import VerifyPinLock from "../screens/VerifyAccount/VerifyPinLock";

// 🧠 ประกาศ Type ของ Route ทั้งหมด
export type RootStackParamList = {
  InitialEntry: undefined;
  Login: undefined;
  Register: undefined;
  OtpVerification: {
    from: "Login" | "Register" | "PhoneChange";
    phoneNumber: string;
  };
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
  NotiSettings: undefined;
  NewPinSetup: { oldPin?: string };
  NewPinConfirm: { firstPin: string };
  PinLocked: undefined;
  ChangeData: undefined;
  EmailChange: undefined;
  AddressChange: undefined;
  VerifyPinLock: undefined;
};

// ✅ ใส่ generic ชัดเจน
const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);
  useEffect(() => {
    const determineInitialRoute = async () => {
      // อ่าน auth token และ flag PIN จาก SecureStore
      const token = await SecureStore.getItemAsync("userData");
      const pinDone = await SecureStore.getItemAsync("userPin");

      if (!token) {
        // ยังไม่ล็อกอิน/สมัคร
        setInitialRoute("InitialEntry");
      } else if (!pinDone) {
        // ล็อกอินแล้ว แต่ยังไม่ได้ตั้ง PIN
        setInitialRoute("PinSetup");
      } else {
        // ล็อกอินและตั้ง PIN แล้ว
        setInitialRoute("PinEntry");
      }
    };

    determineInitialRoute();
  }, []);

  if (!initialRoute) {
    // รอโหลดค่าสถานะ (อาจแสดง Splash)
    return null;
  }
  return (
    <Stack.Navigator
      // 🔧 ป้องกัน TypeScript error โดยระบุ id ให้ชัดเจน
      id={undefined}
      // initialRouteName="Register"
      // initialRouteName="InitialEntry"
      initialRouteName={initialRoute}
      //initialRouteName=""
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
      <Stack.Screen name="NotiSettings" component={NotiSettings} />
      <Stack.Screen name="NewPinSetup" component={NewPinSetup} />
      <Stack.Screen name="NewPinConfirm" component={NewPinConfirm} />
      <Stack.Screen name="ChangeData" component={ChangeDataUser} />
      <Stack.Screen name="EmailChange" component={EmailChangeRequest} />
      <Stack.Screen name="AddressChange" component={AddressChangeRequest} />
      <Stack.Screen name="VerifyPinLock" component={VerifyPinLock} />
      <Stack.Screen
        name="PinLocked"
        component={PinLocked}
        options={{
          headerShown: false,
          gestureEnabled: false, // ป้องกันการย้อนกลับ
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
