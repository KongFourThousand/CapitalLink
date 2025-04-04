import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView, 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
// สมมติว่า user อยากได้ navigation
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import CustomNumpad from "../../components/common/CustomNumpad";
import PinDotRow from "../../components/common/PinDotRow";

const { width } = Dimensions.get("window");

type PinKeyboardNavProp = NativeStackNavigationProp<RootStackParamList, "PinEntry">;

const PinEntryKeyboardScreen: React.FC = () => {
  const navigation = useNavigation<PinKeyboardNavProp>();
  const [pin, setPin] = useState("");

  // โหลดฟอนต์ TimesNewRoman ถ้าต้องการ
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman.ttf"),
  });
  if (!fontsLoaded) return null;

  // ฟังก์ชันเมื่อลูกค้ากดตัวเลข
  const handleNumberPress = (num: string) => {
    if (pin.length < 6) {
      setPin(pin + num);
    }
  };

  // ฟังก์ชันลบ 1 ตัว
  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  // ถ้า pin ครบ 6 ตัว => ทำ logic ตรวจ
  if (pin.length === 6) {
    // ตัวอย่างเช็ค
    // checkPin(pin);
  }

  // ตัวอย่างปุ่มลืมรหัส PIN
  const handleForgotPin = () => {
    navigation.replace("Login"); 
    // หรือ
    // navigation.navigate("Login");
  };

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

        {/* PIN Dot Row โดยใช้ PinDotRow */}
        <PinDotRow pin={pin} maxLength={6} showLast={false} />

      {/* Numeric Keypad */}
      <CustomNumpad
            onNumberPress={handleNumberPress}
            onBackspace={handleBackspace}
            keySize={80}
            showForgotPin={false}
            customStyles={{ container: { width: "80%" } }}
          />
    </View>
    </SafeAreaView>
  );
  
};

/** ปุ่มแต่ละอัน (ตัวเลข) */
const PinKey: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.keyButton} onPress={onPress}>
    <Text style={styles.keyText}>{label}</Text>
  </TouchableOpacity>

);

export default PinEntryKeyboardScreen;

// ====== styles ======
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
    paddingTop: 60,
    alignItems: "center",
  },
  backButton: {
    position: 'absolute',
    top: 40,     
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999, 
  },
  backButtonText: {
    color: "#CFA459",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 5,
  },
  logo: {

    width: width * 1,
    height: width * 0.5,
    marginVertical: 10,
    marginBottom: 10,

  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#000",
    marginBottom: 20,

  },
  pinDotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginBottom: 30,
  },
  dotContainer: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2, // ปรับให้เป็นวงกลมสมบูรณ์
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  dotFilled: {
    width: DOT_FILLED_SIZE,
    height: DOT_FILLED_SIZE,
    borderRadius: DOT_FILLED_SIZE / 2, // ปรับให้เป็นวงกลมสมบูรณ์
    backgroundColor: "#CFA459",
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
});