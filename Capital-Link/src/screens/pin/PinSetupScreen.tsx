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

const { width } = Dimensions.get("window");

type PinSetupScreenNavProp = NativeStackNavigationProp<RootStackParamList, "PinSetup">;

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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#CFA459" />
        </TouchableOpacity>

        <Text style={styles.title}>ตั้งรหัส PIN</Text>

        <View style={styles.mainContent}>
          <Text style={styles.subtitle}>กรุณากรอกรหัส PIN 6 หลัก</Text>
          <Text style={styles.description}>รหัส PIN สำหรับเข้าใช้งานในครั้งถัดไป</Text>

          {/* ช่องสำหรับแสดง PIN */}
          <View style={styles.pinContainer}>
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const filled = index < pin.length;
              return (
                <View
                  key={index}
                  style={[
                    styles.pinBox,
                    pin.length === index ? styles.pinBoxActive : {},
                  ]}
                >
                  {filled ? (
                    index === pin.length - 1 && showLast ? (
                      <Text style={styles.digitText}>{pin[index]}</Text>
                    ) : (
                      <View style={styles.pinDot} />
                    )
                  ) : null}
                </View>
              );
            })}
          </View>
          <Text style={styles.brandText}>Capital Link</Text>
          {/* Custom Numpad */}
          <View style={styles.keypadContainer}>
            <View style={styles.keypadRow}>
              <PinKey label="1" onPress={() => handleNumberPress("1")} />
              <PinKey label="2" onPress={() => handleNumberPress("2")} />
              <PinKey label="3" onPress={() => handleNumberPress("3")} />
            </View>
            <View style={styles.keypadRow}>
              <PinKey label="4" onPress={() => handleNumberPress("4")} />
              <PinKey label="5" onPress={() => handleNumberPress("5")} />
              <PinKey label="6" onPress={() => handleNumberPress("6")} />
            </View>
            <View style={styles.keypadRow}>
              <PinKey label="7" onPress={() => handleNumberPress("7")} />
              <PinKey label="8" onPress={() => handleNumberPress("8")} />
              <PinKey label="9" onPress={() => handleNumberPress("9")} />
            </View>
            <View style={styles.keypadRow}>
              {/* ช่องซ้ายสำหรับ "ลืมรหัส PIN?" (ถ้าต้องการ) */}
              <View style={styles.forgotPinButton}>
                <Text style={styles.forgotPinText}></Text>
              </View>
              <PinKey label="0" onPress={() => handleNumberPress("0")} />
              <TouchableOpacity onPress={handleBackspace} style={styles.keyButton}>
                <Ionicons name="backspace-outline" size={24} color="#333" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

type PinKeyProps = {
  label: string;
  onPress: () => void;
};

const PinKey: React.FC<PinKeyProps> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.keyButton} onPress={onPress}>
    <Text style={styles.keyText}>{label}</Text>
  </TouchableOpacity>
);

export default PinSetupScreen;

const circleSize = 80;
const DOT_SIZE = 20;
const DOT_FILLED_SIZE = 15;

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
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
    padding: 10,
  },
  pinBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 6,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  pinBoxActive: {
    borderColor: "#CFA459",
    borderWidth: 1.5,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#333",
  },
  digitText: {
    fontSize: 24,
    color: "#333",
    fontWeight: "600",
  },
  keypadContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  keypadRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginVertical: 5,
  },
  keyButton: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
  },
  keyText: {
    fontSize: 35,
    color: "#333",
    fontWeight: "600",
  },
  forgotPinButton: {
    width: circleSize,
    height: circleSize,
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPinText: {
    fontSize: 10,
    color: "#CFA459",
    textDecorationLine: "underline",
  },
  brandText: {
    color: "#a2754c",
    fontSize: 16,
    marginVertical: 20,
    fontFamily: "TimesNewRoman",
  },
});