import React, { useState, useRef, useEffect } from "react";
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
import { useRoute, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store"; // <-- ใช้ SecureStore
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { useFonts } from "expo-font";
import CustomNumpad from "../../components/common/CustomNumpad";
import PinDotsDisplay from "../../components/common/PinDotsDisplay";

const { width } = Dimensions.get("window");

type PinConfirmNavProp = NativeStackNavigationProp<RootStackParamList, "PinConfirm">;

const PinConfirmScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<PinConfirmNavProp>();

  // รับค่า firstPin (6 หลัก) มาจาก PinEntryScreen
  const firstPinFromRoute = route.params
    ? (route.params as { firstPin: string }).firstPin
    : "";

  const [confirmPin, setConfirmPin] = useState("");
  const [showLast, setShowLast] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // โหลดฟอนต์ (ตัวอย่าง)
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman bold.ttf"),
  });

  useEffect(() => {
    // ถ้าไม่มีค่า firstPin ให้ย้อนกลับ
    if (!firstPinFromRoute) {
      Alert.alert("ข้อผิดพลาด", "ไม่พบรหัส PIN ที่ตั้งไว้ กรุณาลองใหม่");
      navigation.goBack();
    }
  }, [firstPinFromRoute, navigation]);

  // ฟังก์ชันเมื่อกดตัวเลข
  const handleNumberPress = (num: string) => {
    if (confirmPin.length < 6) {
      const newPin = confirmPin + num;
      setConfirmPin(newPin);
      setShowLast(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowLast(false);
      }, 300);

      // ถ้า PIN ครบ 6 หลัก → ตรวจสอบ
      if (newPin.length === 6) {
        setTimeout(() => handleConfirm(newPin), 300);
      }
    }
  };

  // ฟังก์ชันลบตัวเลขล่าสุด
  const handleBackspace = () => {
    if (confirmPin.length > 0) {
      setConfirmPin(confirmPin.slice(0, -1));
      setShowLast(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  };

  // ฟังก์ชันตรวจสอบ PIN
  const handleConfirm = async (pinToCheck: string) => {
    // ถ้าตรงกับ firstPin => เก็บใน SecureStore
    if (pinToCheck === firstPinFromRoute) {
      try {
        await SecureStore.setItemAsync("userPin", pinToCheck);
        // ไปหน้า Home หรือหน้าอื่นตามต้องการ
        navigation.replace("Home");
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึก PIN:", error);
        Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกรหัส PIN ได้ กรุณาลองใหม่");
      }
    } else {
      Alert.alert("แจ้งเตือน", "PIN ไม่ตรงกัน กรุณาลองใหม่");
      setConfirmPin("");
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ปุ่มย้อนกลับ */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color="#CFA459" />
        </TouchableOpacity>

        <Text style={styles.title}>ยืนยันรหัส PIN</Text>

        <View style={styles.mainContent}>
          <Text style={styles.subtitle}>กรุณากรอกรหัส PIN อีกครั้ง</Text>
          <Text style={styles.description}>เพื่อยืนยันการตั้งรหัส PIN</Text>

          <PinDotsDisplay pin={confirmPin} maxLength={6} showLast={showLast} />
          <Text style={styles.brandText}>Capital Link</Text>
          {/* แป้นพิมพ์ตัวเลข */}
          <CustomNumpad
            onNumberPress={handleNumberPress}
            onBackspace={handleBackspace}
            keySize={80}
            customStyles={{ container: { width: "90%" } }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PinConfirmScreen;

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
    top: 60,
    left: 18,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 999,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 80,
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
    textAlign: "center",
    marginTop: 20,
  },
  description: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 30,
  },
  brandText: {
    color: "#a2754c",
    fontSize: 16,
    marginVertical: 20,
    fontFamily: "TimesNewRoman",
  },
});

