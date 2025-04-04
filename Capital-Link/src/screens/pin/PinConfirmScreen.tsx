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
import * as SecureStore from "expo-secure-store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { useFonts } from "expo-font";
import CustomNumpad from "../../components/common/CustomNumpad";
import PinDotsDisplay from "../../components/common/PinDotsDisplay";

const { width } = Dimensions.get("window");

type PinConfirmNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PinConfirm"
>;

const PinConfirmScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<PinConfirmNavProp>();
  // รับค่า firstPin และแปลงเป็น string เพื่อให้แน่ใจว่าเป็นชนิดข้อมูลเดียวกัน
  const firstPinFromRoute = route.params
    ? (route.params as { firstPin: string }).firstPin
    : "";
  const [firstPin, setFirstPin] = useState<string>(String(firstPinFromRoute));

  const [confirmPin, setConfirmPin] = useState("");
  const [showLast, setShowLast] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman bold.ttf"),
  });

  useEffect(() => {
    // ใส่ console.log ไว้ตรวจสอบค่า firstPin
    console.log("firstPin จาก route:", firstPinFromRoute);
    console.log("ประเภทข้อมูลของ firstPin:", typeof firstPinFromRoute);

    // ถ้าไม่มีค่า firstPin ให้ย้อนกลับ
    if (!firstPinFromRoute) {
      Alert.alert("ข้อผิดพลาด", "ไม่พบรหัส PIN ที่ตั้งไว้ กรุณาลองใหม่");
      navigation.goBack();
    }
  }, [firstPinFromRoute, navigation]);

  const handleNumberPress = (num: string) => {
    if (confirmPin.length < 6) {
      const newPin = confirmPin + num;
      setConfirmPin(newPin);
      setShowLast(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowLast(false);
      }, 300);

      // handleNumberPress:
      if (newPin.length === 6) {
        setTimeout(() => handleConfirm(newPin), 300);
      }
    }
  };
  const handleBackspace = () => {
    if (confirmPin.length > 0) {
      setConfirmPin(confirmPin.slice(0, -1));
      setShowLast(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  };

  const handleConfirm = async (pinToCheck: string) => {
    // เพิ่ม console.log เพื่อตรวจสอบค่าที่กำลังเปรียบเทียบ
    console.log("pinToCheck:", pinToCheck, "ความยาว:", pinToCheck.length);
    console.log("firstPin:", firstPin, "ความยาว:", firstPin.length);

    // แปลง string เป็นค่าเดียวกันก่อนเปรียบเทียบ
    const normalizedFirstPin = String(firstPin).trim();
    const normalizedConfirmPin = String(pinToCheck).trim();

    console.log("หลังจาก normalize - firstPin:", normalizedFirstPin);
    console.log("หลังจาก normalize - confirmPin:", normalizedConfirmPin);

    if (normalizedConfirmPin === normalizedFirstPin) {
      try {
        // บันทึกค่า PIN เป็น string
        await SecureStore.setItemAsync("userPin", normalizedConfirmPin);
        // ไปหน้า Home
        navigation.replace("Home");
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึก PIN:", error);
        Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกรหัส PIN ได้ กรุณาลองใหม่");
      }
    } else {
      console.log("PIN ไม่ตรงกัน!");
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

type PinKeyProps = {
  label: string;
  onPress: () => void;
};

const PinKey: React.FC<PinKeyProps> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.keyButton} onPress={onPress}>
    <Text style={styles.keyText}>{label}</Text>
  </TouchableOpacity>
);

export default PinConfirmScreen;

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
    //backgroundColor: "#000000",
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
    // backgroundColor: "red",
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
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
  },
  keypadContainer: {
    width: "90%",
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
    color: "#CFA459",
    fontSize: 16,
    marginVertical: 20,
    fontFamily: "TimesNewRoman",
  },
  digitText: {
    fontSize: 24,
    color: "#333",
    fontWeight: "600",
  },
});
