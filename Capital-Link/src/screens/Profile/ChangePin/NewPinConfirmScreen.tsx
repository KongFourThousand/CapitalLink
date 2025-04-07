// NewPinConfirmScreen.tsx
import React, { useEffect } from "react";
import { Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootNavigator";
import PinScreen from "../../../components/common/PinScreen";

type NewPinConfirmNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "NewPinConfirm"
>;

const NewPinConfirmScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NewPinConfirmNavProp>();

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
        Alert.alert(
          "สำเร็จ", 
          "เปลี่ยนรหัส PIN เรียบร้อยแล้ว", 
          [
            { 
              text: "ตกลง", 
              onPress: () => navigation.navigate("Home") 
            }
          ]
        );
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึก PIN:", error);
        Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกรหัส PIN ได้ กรุณาลองใหม่");
      }
    } else {
      Alert.alert("แจ้งเตือน", "PIN ไม่ตรงกัน กรุณาลองใหม่");
    }
  };

  return (
    <PinScreen
      title="ยืนยันรหัส PIN ใหม่"
      subtitle="กรุณากรอกรหัส PIN ใหม่อีกครั้ง"
      description="เพื่อยืนยันการตั้งรหัส PIN ใหม่"
      onPinComplete={handlePinComplete}
      onBackPress={() => navigation.goBack()}
    />
  );
};

export default NewPinConfirmScreen;