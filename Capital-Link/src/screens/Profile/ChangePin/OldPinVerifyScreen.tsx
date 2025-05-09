import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useFonts } from "expo-font";
import CustomNumpad from "../../../components/common/CustomNumpad";
import PinDotRow from "../../../components/common/PinDotRow";
import { RootStackParamList } from "../../../navigation/RootNavigator";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");

type OldPinVerifyScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "OldPin"
>;
type OldPinVerifyScreenRouteProp = RouteProp<RootStackParamList, "OldPin">;
const OldPinVerifyScreen: React.FC = () => {
  const navigation = useNavigation<OldPinVerifyScreenNavProp>();
  const route = useRoute<OldPinVerifyScreenRouteProp>();
  const { returnTo } = route.params;
  const [pin, setPin] = useState("");
  const [showLast, setShowLast] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // PIN เก่าที่โหลดจาก SecureStore
  const [storedPin, setStoredPin] = useState<string | null>(null);

  // Error message สีแดง เพื่อแทน subtitle เมื่อมีข้อผิดพลาด
  const [errorMessage, setErrorMessage] = useState("");

  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../../assets/fonts/times new roman.ttf"),
  });

  useEffect(() => {
    const loadOldPin = async () => {
      try {
        const oldPin = await SecureStore.getItemAsync("userPin");
        if (oldPin) {
          setStoredPin(oldPin);
        } else {
          setErrorMessage("ไม่พบ PIN เดิมในเครื่อง");
        }
      } catch (error) {
        console.error("Error loading old PIN:", error);
        setErrorMessage("เกิดข้อผิดพลาดในการโหลด PIN");
      }
    };
    loadOldPin();
  }, []);

  // เมื่อกดตัวเลข
  const handleNumberPress = useCallback(
    (num: string) => {
      // ถ้ามี error เดิมอยู่ ให้เคลียร์ก่อน
      if (errorMessage) {
        setErrorMessage("");
      }
      if (pin.length < 6) {
        const newPin = pin + num;
        setPin(newPin);
        setShowLast(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setShowLast(false);
        }, 300);
      }
    },
    [pin, errorMessage]
  );

  // เมื่อกด Backspace
  const handleBackspace = useCallback(() => {
    if (errorMessage) {
      setErrorMessage("");
    }
    if (pin.length > 0) {
      setPin((prev) => prev.slice(0, -1));
      setShowLast(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [pin, errorMessage]);

  // ตรวจสอบ PIN เมื่อครบ 6 หลัก
  useEffect(() => {
    if (pin.length === 6) {
      setTimeout(() => {
        verifyOldPin();
      }, 300);
    }
  }, [pin]);

  const verifyOldPin = () => {
    if (!storedPin) {
      setErrorMessage("ไม่พบ PIN เดิมในเครื่อง (อาจยังไม่เคยตั้ง PIN)");
      setPin("");
      return;
    }

    if (pin === storedPin) {
      navigation.replace("NewPinSetup", { oldPin: storedPin, returnTo });
    } else {
      setErrorMessage("PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
      setPin("");
    }
  };

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
          {/* 
            (สำคัญ) เลือกแสดง subtitle กับ errorMessage 
            ถ้า errorMessage เป็นค่าว่าง => แสดง subtitle ปกติ
            ถ้า errorMessage มีค่า => แสดงข้อความสีแดงแทน
          */}
          {errorMessage === "" ? (
            <Text style={styles.subtitle}>กรุณากรอกรหัส PIN ปัจจุบัน</Text>
          ) : (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          )}

          <PinDotRow pin={pin} maxLength={6} showLast={false} />

          <Text style={styles.brandText}>Capital Link</Text>

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

  // ข้อความปกติ
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },

  // ถ้า PIN ผิด => แสดงข้อความสีแดงแทน subtitle
  errorMessage: {
    fontSize: 16,
    fontWeight: "600",
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },

  brandText: {
    color: "#CFA459",
    fontSize: 16,
    marginVertical: 20,
    fontFamily: "TimesNewRoman",
  },
});
