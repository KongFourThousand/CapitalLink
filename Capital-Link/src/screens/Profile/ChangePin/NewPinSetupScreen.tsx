// NewPinSetupScreen.tsx
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootNavigator";
import PinScreen from "../../../components/common/PinScreen";

type NewPinSetupNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "NewPinSetup"
>;

const NewPinSetupScreen: React.FC = () => {
  const navigation = useNavigation<NewPinSetupNavProp>();

  const handlePinComplete = (pin: string) => {
    navigation.navigate("NewPinConfirm", { firstPin: pin });
  };

  return (
    <PinScreen
      title="ตั้งรหัส PIN ใหม่"
      subtitle="กรุณากรอกรหัส PIN 6 หลัก"
      description="รหัส PIN ใหม่สำหรับเข้าใช้งานในครั้งถัดไป"
      onPinComplete={handlePinComplete}
      onBackPress={() => navigation.goBack()}
    />
  );
};

export default NewPinSetupScreen;