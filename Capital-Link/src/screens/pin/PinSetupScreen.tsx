import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import PinScreen from "../../components/common/PinScreen";

type PinSetupScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PinSetup"
>;

const PinSetupScreen: React.FC = () => {
  const navigation = useNavigation<PinSetupScreenNavProp>();

  const handlePinComplete = (pin: string) => {
    navigation.navigate("PinConfirm", { firstPin: pin });
  };

  return (
    <PinScreen
      title="ตั้งรหัส PIN"
      subtitle="กรุณากรอกรหัส PIN 6 หลัก"
      description="รหัส PIN สำหรับเข้าใช้งานในครั้งถัดไป"
      onPinComplete={handlePinComplete}
      onBackPress={() => navigation.goBack()}
    />
  );
};

export default PinSetupScreen;