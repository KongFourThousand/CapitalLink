import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import PinScreen from "../../components/common/PinScreen";
import { validatePin } from "../../components/common/PinValidator";
import PinErrorModal from "../../components/common/PinErrorModal";
import CustomAlertModal from "../../components/common/CustomAlertModal";

type PinSetupScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PinSetup"
>;

const PinSetupScreen: React.FC = () => {
  const navigation = useNavigation<PinSetupScreenNavProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pinInputKey, setPinInputKey] = useState(0);
  const [alert, setAlert] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });
  useEffect(() => {
    const checkPinSetup = async () => {
      const pinDone = await SecureStore.getItemAsync("userPin");
      if (!pinDone) {
        setAlert({
          visible: true,
          message: "คุณไม่ได้ตั้งค่า PIN กรุณาตั้งค่า PIN",
        });
      }
    };
    checkPinSetup();
  }, []);

  const handlePinComplete = (pin: string) => {
    const result = validatePin(pin);

    if (!result.valid) {
      console.log(result.valid);
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
      <CustomAlertModal
        visible={alert.visible}
        message={alert.message}
        onlyConfirm={true}
        onConfirm={() => setAlert({ visible: false, message: "" })}
        onCancel={() => setAlert({ visible: false, message: "" })}
      />
    </>
  );
};

export default PinSetupScreen;
