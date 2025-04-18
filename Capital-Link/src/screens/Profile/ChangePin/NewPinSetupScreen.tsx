// NewPinSetupScreen.tsx
import React, { useState } from "react";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootNavigator";
import PinScreen from "../../../components/common/PinScreen";
import { validatePin } from "../../../components/common/PinValidator";
import PinErrorModal from "../../../components/common/PinErrorModal";


type NewPinSetupNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "NewPinSetup"
>;

type NewPinSetupRouteProp = RouteProp<RootStackParamList, "NewPinSetup">; // ✅ เพิ่มบรรทัดนี้

const NewPinSetupScreen: React.FC = () => {
  const navigation = useNavigation<NewPinSetupNavProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pinInputKey, setPinInputKey] = useState(0);
  const route = useRoute<NewPinSetupRouteProp>();
  const oldPin = route.params?.oldPin;

  const handlePinComplete = (pin: string) => {
    const result = validatePin(pin, oldPin);

    if (!result.valid) {
      setErrorMessage(result.message || "รหัสไม่ถูกต้อง");
      setModalVisible(true);
      setPinInputKey((prev) => prev + 1); // รีเซ็ตช่องกรอก
      return;
    }
    navigation.navigate("NewPinConfirm", { firstPin: pin });
  };

  return (
    <>
      <PinScreen
        key={pinInputKey} // 💡 รีเซ็ตเมื่อ PIN ไม่ผ่าน
        title="ตั้งรหัส PIN ใหม่"
        subtitle="กรุณากรอกรหัส PIN 6 หลัก"
        description="รหัส PIN ใหม่สำหรับเข้าใช้งานในครั้งถัดไป"
        onPinComplete={handlePinComplete}
        onBackPress={() => navigation.goBack()}
      />
      <PinErrorModal
        visible={modalVisible}
        message={errorMessage}
        onDismiss={() => setModalVisible(false)}
      />
    </>
  );
};

export default NewPinSetupScreen;
