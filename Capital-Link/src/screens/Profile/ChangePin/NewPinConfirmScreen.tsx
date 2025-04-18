// NewPinConfirmScreen.tsx
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootNavigator";
import PinScreen from "../../../components/common/PinScreen";
import PinErrorModal from "../../../components/common/PinErrorModal";
import CustomAlertModal from "../../../components/common/CustomAlertModal";

type NewPinConfirmNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "NewPinConfirm"
>;

const NewPinConfirmScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NewPinConfirmNavProp>();
  const [pinInputKey, setPinInputKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // รับค่า firstPin (6 หลัก) มาจาก NewPinSetupScreen
  const firstPinFromRoute = route.params
    ? (route.params as { firstPin: string }).firstPin
    : "";

  useEffect(() => {
    // ถ้าไม่มีค่า firstPin ให้ย้อนกลับ
    if (!firstPinFromRoute) {
      Alert.alert("ข้อผิดพลาด", "ไม่พบรหัส PIN ที่ตั้งไว้ กรุณาลองใหม่");
      navigation.goBack();
    }
  }, [firstPinFromRoute, navigation]);

  const handlePinComplete = async (pin: string) => {
    // ตรวจสอบว่า PIN ตรงกับที่ตั้งไว้หรือไม่
    if (pin === firstPinFromRoute) {
      try {
        // บันทึก PIN ใหม่
        await SecureStore.setItemAsync("userPin", pin);
        // Alert.alert("สำเร็จ", "เปลี่ยนรหัส PIN เรียบร้อยแล้ว", [
        //   {
        //     text: "ตกลง",
        //     onPress: () => navigation.navigate("Profile"),
        //   },
        // ]);
        setSuccessModalVisible(true);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึก PIN:", error);
        Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกรหัส PIN ได้ กรุณาลองใหม่");
      }
    } else {
      // ❌ PIN ไม่ตรงกัน → แจ้งเตือนผ่าน Modal
      setErrorMessage("PIN ไม่ตรงกัน กรุณาลองใหม่");
      setModalVisible(true);
    }
  };

  return (
    <>
      <PinScreen
        key={pinInputKey}
        title="ยืนยันรหัส PIN ใหม่"
        subtitle="กรุณากรอกรหัส PIN ใหม่อีกครั้ง"
        description="เพื่อยืนยันการตั้งรหัส PIN ใหม่"
        onPinComplete={handlePinComplete}
        onBackPress={() => navigation.goBack()}
      />
      <PinErrorModal
        visible={modalVisible}
        message={errorMessage}
        onDismiss={() => {
          setModalVisible(false); // ปิด modal
          setPinInputKey((prev) => prev + 1); // ล้างช่อง PIN
        }}
      />
      <CustomAlertModal
        visible={successModalVisible}
        message="เปลี่ยนรหัส PIN เรียบร้อยแล้ว"
        confirmText="ตกลง"
        onConfirm={() => {
          setSuccessModalVisible(false); // ปิด modal
          setTimeout(() => {
            navigation.replace("Profile");
          }, 200);
        }}
        onlyConfirm // ✅ ให้มีแค่ปุ่มตกลง
      />
    </>
  );
};

export default NewPinConfirmScreen;
