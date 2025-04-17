import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import PinScreen from "../../components/common/PinScreen";
import { validatePin } from "../../components/common/PinValidator";
import PinErrorModal from "../../components/common/PinErrorModal";

type PinSetupScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PinSetup"
>;

const PinSetupScreen: React.FC = () => {
  const navigation = useNavigation<PinSetupScreenNavProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pinInputKey, setPinInputKey] = useState(0);

  const handlePinComplete = (pin: string) => {
    const result = validatePin(pin);

    if (!result.valid) {
      setErrorMessage(result.message);
      setModalVisible(true);
      setPinInputKey((prev) => prev + 1);
      return;
    }

    navigation.navigate("PinConfirm", { firstPin: pin });
  };

  return (
    <>
      <PinScreen
        key={pinInputKey}
        title="ตั้งรหัส PIN"
        subtitle="กรุณากรอกรหัส PIN 6 หลัก"
        description="รหัส PIN สำหรับเข้าใช้งานในครั้งถัดไป"
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

export default PinSetupScreen;
