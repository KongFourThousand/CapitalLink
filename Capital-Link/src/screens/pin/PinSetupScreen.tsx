import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { useFonts } from "expo-font";
import CustomNumpad from "../../components/common/CustomNumpad";
import PinDotsDisplay from "../../components/common/PinDotsDisplay";

const { width } = Dimensions.get("window");

type PinSetupScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PinSetup"
>;

const PinSetupScreen: React.FC = () => {
  // เรียกใช้ Hook ทั้งหมดก่อน มีเงื่อนไขหรือ return
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman bold.ttf"),
  });
  const navigation = useNavigation<PinSetupScreenNavProp>();
  const [pin, setPin] = useState("");
  const [showLast, setShowLast] = useState(false);
  // ใช้ ReturnType<typeof setTimeout> แทน NodeJS.Timeout
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // เมื่อกดตัวเลข ให้เพิ่ม PIN แล้วแสดงตัวเลขล่าสุดก่อนเปลี่ยนเป็น dot
  const handleNumberPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setShowLast(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowLast(false);
      }, 800);
    }
  };

  // ฟังก์ชันลบตัวเลขล่าสุด
  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setShowLast(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  };

  // เมื่อ PIN ครบ 6 หลัก ให้ไปหน้าถัดไป
  useEffect(() => {
    if (pin.length === 6) {
      setTimeout(() => {
        navigation.navigate("PinConfirm", { firstPin: pin });
      }, 300);
    }
  }, [pin, navigation]);

  // ถ้าไฟล์ฟอนต์ยังไม่โหลดเสร็จ ให้คืนค่า null หลังจากประกาศ hooks ทั้งหมดแล้ว
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

        <Text style={styles.title}>ตั้งรหัส PIN</Text>

        <View style={styles.mainContent}>
          <Text style={styles.subtitle}>กรุณากรอกรหัส PIN 6 หลัก</Text>
          <Text style={styles.description}>
            รหัส PIN สำหรับเข้าใช้งานในครั้งถัดไป
          </Text>

          <PinDotsDisplay pin={pin} showLast={showLast} maxLength={6} />
          <Text style={styles.brandText}>Capital Link</Text>
          <CustomNumpad
            onNumberPress={handleNumberPress}
            onBackspace={handleBackspace}
            keySize={80}
            showForgotPin={false}
            customStyles={{ container: { width: "90%" } }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PinSetupScreen;

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
