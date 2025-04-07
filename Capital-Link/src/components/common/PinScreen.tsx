// PinScreen.tsx
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
import { useFonts } from "expo-font";
import CustomNumpad from "./CustomNumpad";
import PinDotsDisplay from "./PinDotsDisplay";

const { width } = Dimensions.get("window");

interface PinScreenProps {
  title: string;
  subtitle: string;
  description: string;
  onPinComplete: (pin: string) => void;
  onBackPress: () => void;
  maxLength?: number;
}

const PinScreen: React.FC<PinScreenProps> = ({
  title,
  subtitle,
  description,
  onPinComplete,
  onBackPress,
  maxLength = 6,
}) => {
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman bold.ttf"),
  });
  
  const [pin, setPin] = useState("");
  const [showLast, setShowLast] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // เมื่อกดตัวเลข ให้เพิ่ม PIN แล้วแสดงตัวเลขล่าสุดก่อนเปลี่ยนเป็น dot
  const handleNumberPress = (num: string) => {
    if (pin.length < maxLength) {
      const newPin = pin + num;
      setPin(newPin);
      setShowLast(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowLast(false);
      }, 300);
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

  // เมื่อ PIN ครบตามกำหนด
  useEffect(() => {
    if (pin.length === maxLength) {
      setTimeout(() => {
        onPinComplete(pin);
      }, 300);
    }
  }, [pin, maxLength, onPinComplete]);

  // ถ้าไฟล์ฟอนต์ยังไม่โหลดเสร็จ ให้คืนค่า null
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ปุ่มย้อนกลับ */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
        >
          <Ionicons name="chevron-back" size={26} color="#CFA459" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.mainContent}>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.description}>{description}</Text>

          <PinDotsDisplay pin={pin} showLast={showLast} maxLength={maxLength} />
          <Text style={styles.brandText}>Capital Link</Text>
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

export default PinScreen;

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