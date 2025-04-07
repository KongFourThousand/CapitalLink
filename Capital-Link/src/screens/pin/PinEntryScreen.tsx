import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import CustomNumpad from "../../components/common/CustomNumpad";
import PinDotRow from "../../components/common/PinDotRow";

// 1) **เพิ่มการ import expo-secure-store** เพื่อนำมาใช้โหลด PIN ที่ผู้ใช้ตั้งไว้
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");

type PinKeyboardNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PinEntry"
>;

const PinEntryKeyboardScreen: React.FC = () => {
  const navigation = useNavigation<PinKeyboardNavProp>();
  const [pin, setPin] = useState("");
  
  // 2) **สร้าง state สำหรับเก็บ PIN ที่เคยตั้งในเครื่อง (storedPin) และจำนวนครั้งที่กรอกผิด (attempts)**
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman.ttf"),
  });

  // 3) **โหลด PIN จาก SecureStore เมื่อเปิดหน้านี้ครั้งแรก** (useEffect)
  useEffect(() => {
    const loadStoredPin = async () => {
      try {
        const pinFromDevice = await SecureStore.getItemAsync("userPin");
        if (pinFromDevice) {
          setStoredPin(pinFromDevice);
        } else {
          // ในกรณีที่ยังไม่มี PIN บันทึกไว้
          // อาจแจ้งเตือนหรือปล่อยให้เป็น null เพื่อให้ user กรอกได้
          console.log("ยังไม่มี PIN ในเครื่อง (userPin is null)");
        }
      } catch (error) {
        console.error("Error loading stored PIN:", error);
      }
    };
    loadStoredPin();
  }, []);

  // 4) **handleNumberPress** ใช้ useCallback + setPin แบบ callback
  //   เพื่ออัปเดต state ได้อย่างถูกต้อง
  const handleNumberPress = useCallback((num: string) => {
    setPin((prev) => {
      if (prev.length < 6) {
        return prev + num;
      }
      return prev;
    });
  }, []);

  // 5) **handleBackspace** เพื่อลบตัวเลขตัวสุดท้าย
  const handleBackspace = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  // 6) **เมื่อผู้ใช้กดลืม PIN** อาจให้ navigation.replace("Login") หรือหน้าใดก็ได้
  const handleForgotPin = useCallback(() => {
    navigation.replace("Login");
  }, [navigation]);

  // 7) **useEffect สำหรับตรวจสอบ PIN** เมื่อ pin.length === 6
  useEffect(() => {
    // ถ้ายังไม่โหลดฟอนต์ / ยังไม่โหลด storedPin ก็ให้รอก่อน
    // หรืออาจออกแบบให้ checkPin() ในภายหลังก็ได้
    if (!fontsLoaded) return;
    
    if (pin.length === 6) {
      // ถ้าไม่มี storedPin แปลว่ายังไม่เคยตั้ง PIN บนเครื่อง
      // อาจปล่อยผ่านหรือแจ้งเตือน
      if (storedPin === null) {
        Alert.alert("ยังไม่เคยตั้ง PIN", "กรุณาไปตั้ง PIN ก่อน หรือเคยลบแอป?");
        setPin("");
        return;
      }
      
      // ถ้ามี storedPin -> เปรียบเทียบ
      if (pin === storedPin) {
        // กรอกถูกต้อง
        navigation.replace("Home");
      } else {
        // กรอกไม่ถูกต้อง
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 3) {
          // ถ้าผิดเกิน 3 ครั้ง
          navigation.replace("Login");
        } else {
          Alert.alert("PIN ไม่ถูกต้อง", `เหลือโอกาสอีก ${3 - newAttempts} ครั้ง`);
          setPin("");
        }
      }
    }
  }, [pin, storedPin, attempts, navigation, fontsLoaded]);

  // ถ้าฟอนต์ยังไม่โหลด
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color="#CFA459" />
        </TouchableOpacity>

        {/* Logo */}
        <Image
          source={require("../../../assets/CapitalLink.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>กรุณากรอกรหัส PIN</Text>

        {/* PIN Dot Row */}
        <PinDotRow pin={pin} maxLength={6} showLast={false} />

        {/* Numeric Keypad */}
        <CustomNumpad
          onNumberPress={handleNumberPress}
          onBackspace={handleBackspace}
          keySize={80}
          customStyles={{ container: { width: "80%", marginTop: 15 } }}
        />

        {/* Text ลืมรหัส PIN? ใหญ่ขึ้น + ขีดเส้นใต้ + กดได้ */}
        <TouchableOpacity onPress={handleForgotPin} style={styles.forgotPinContainer}>
          <Text style={styles.forgotPinTextLarge}>ลืมรหัส PIN?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PinEntryKeyboardScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 18,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 999,
  },
  logo: {
    width: width,
    height: width * 0.4,
    marginVertical: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  forgotPinContainer: {
    marginTop: 20, // เว้นระยะจาก Numpad
  },
  forgotPinTextLarge: {
    fontSize: 14,
    color: "#CFA459",
    textDecorationLine: "underline",
  },
});

