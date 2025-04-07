import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import CustomNumpad from "../../components/common/CustomNumpad";
import PinDotRow from "../../components/common/PinDotRow";
import { RootStackParamList } from "../../navigation/RootNavigator";


const { width } = Dimensions.get("window");

type OldPinVerifyScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "OldPin"
>;

const OldPinVerifyScreen: React.FC = () => {
  const navigation = useNavigation<OldPinVerifyScreenNavProp>();

  // state สำหรับเก็บค่า PIN ที่กรอก
  const [pin, setPin] = useState("");
  // state สำหรับควบคุมการโชว์ตัวเลขหลักสุดท้าย
  const [showLast, setShowLast] = useState(false);

  // ใช้ useRef เก็บ timeout
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // โหลดฟอนต์ (ถ้าจำเป็น)
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman.ttf"),
  });


  // สมมุติว่านี่คือ PIN เก่าที่เก็บไว้ (เช่น อ่านจาก SecureStore)
  const storedPin = "123456";

  // ฟังก์ชันกดตัวเลขใน Numpad
  const handleNumberPress = useCallback((num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setShowLast(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // ตั้งเวลาซัก 300ms ให้ตัวเลขสุดท้ายกลายเป็น dot
      timeoutRef.current = setTimeout(() => {
        setShowLast(false);
      }, 300);
    }
  }, [pin]);

  // ฟังก์ชันกด Backspace
  const handleBackspace = useCallback(() => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setShowLast(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [pin]);

  // ถ้าใส่ PIN ครบ 6 หลัก => ตรวจสอบ
  useEffect(() => {
    if (pin.length === 6) {
      setTimeout(() => {
        verifyOldPin();
      }, 300);
    }
  }, [pin]);

  // ฟังก์ชันตรวจสอบรหัสเก่า
  const verifyOldPin = () => {
    if (pin === storedPin) {
      // ถ้าถูก ให้ไปหน้าถัดไป (เช่นหน้า ChangePinScreen)
      // ตัวอย่าง: navigation.navigate("ChangePin") 
    } else {
      Alert.alert("รหัสไม่ถูกต้อง", "รหัส PIN ปัจจุบันไม่ถูกต้อง กรุณาลองใหม่");
      setPin("");
    }
  };

  // กดปุ่ม Back
  const handleBack = () => {
    navigation.goBack();
  };

  if (!fontsLoaded) return null;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* ปุ่มย้อนกลับ */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={26} color="#CFA459" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>เปลี่ยนรหัส PIN</Text>

        <View style={styles.mainContent}>
          {/* Subtitle */}
          <Text style={styles.subtitle}>กรุณากรอกรหัส PIN ปัจจุบัน</Text>

          {/* แสดง PIN Dot */}
            <PinDotRow pin={pin} maxLength={6} showLast={false} />
          
          <Text style={styles.brandText}>Capital Link</Text>
          {/* Numpad */}
          <CustomNumpad
            onNumberPress={handleNumberPress}
            onBackspace={handleBackspace}
            keySize={80}
            customStyles={{ container: { width: "80%", marginTop: 20 } }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OldPinVerifyScreen;

// ---- Styles ----
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 18,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 999,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 100,
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 30,
  },
  brandText: {
    color: "#CFA459",
    fontSize: 16,
    marginVertical: 20,
    fontFamily: "TimesNewRoman",
  },
});
