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

const { width } = Dimensions.get("window");

type PinConfirmNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PinConfirm"
>;

const PinConfirmScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<PinConfirmNavProp>();
  const { firstPin } = route.params as { firstPin: string };
  const [confirmPin, setConfirmPin] = useState("");
  const [showLast, setShowLast] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman bold.ttf"),
  });

  const handleNumberPress = (num: string) => {
    if (confirmPin.length < 6) {
      const newPin = confirmPin + num;
      setConfirmPin(newPin);
      setShowLast(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowLast(false);
      }, 800);

      if (newPin.length === 6) {
        setTimeout(() => handleConfirm(), 300);
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

  const handleConfirm = async () => {
    if (confirmPin === firstPin) {
      await SecureStore.setItemAsync("userPin", confirmPin);
      // ไปหน้า Home
      navigation.replace("Home");
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
          <View style={styles.pinContainer}>
            {/* ช่องสำหรับแสดง PIN */}
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const filled = index < confirmPin.length;
              return (
                <View
                  key={index}
                  style={[
                    styles.pinBox,
                    confirmPin.length === index ? styles.pinBoxActive : {},
                  ]}
                >
                  {filled ? (
                    index === confirmPin.length - 1 && showLast ? (
                      <Text style={styles.digitText}>{confirmPin[index]}</Text>
                    ) : (
                      <View style={styles.pinDot} />
                    )
                  ) : null}
                </View>
              );
            })}
          </View>
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
            {/* ช่องซ้ายสำหรับ "ลืมรหัส PIN?" ถ้าต้องการ */}
            <View style={styles.forgotPinButton}>
              <Text style={styles.forgotPinText}></Text>
            </View>
            <PinKey label="0" onPress={() => handleNumberPress("0")} />
            <TouchableOpacity
              onPress={handleBackspace}
              style={styles.keyButton}
            >
              <Ionicons name="backspace-outline" size={24} color="#333" />
            </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: "row",
    marginTop: 40,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    // marginTop: 0,
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
    padding: 100,
    backgroundColor: "#000000",
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
    backgroundColor: "red",
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
