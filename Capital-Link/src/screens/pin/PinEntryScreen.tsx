//PinEntryKeyboardScreen.tsx
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomNumpad from "../../components/common/CustomNumpad";
import PinDotRow from "../../components/common/PinDotRow";
import * as SecureStore from "expo-secure-store";
import { RootStackParamList } from "../../navigation/RootNavigator";
import PinErrorModal from "../../components/common/PinErrorModal";

const { width } = Dimensions.get("window");

type PinKeyboardNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PinEntry"
>;

const PinEntryKeyboardScreen: React.FC = () => {
  const navigation = useNavigation<PinKeyboardNavProp>();
  const [pin, setPin] = useState("");
  const [failCount, setFailCount] = useState(0);
  const [storedPin, setStoredPin] = useState<string | null>(null);
  // สร้าง state สำหรับ modal แทนการใช้ errorMessage
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman.ttf"),
  });

  // โหลด PIN จาก SecureStore
  useEffect(() => {
    const loadStoredPin = async () => {
      try {
        const pinFromDevice = await SecureStore.getItemAsync("userPin");
        const failCountFromStore = await SecureStore.getItemAsync("failCount");
        console.log("failCountFromStore", failCountFromStore);
        if (pinFromDevice) {
          setStoredPin(pinFromDevice);
          if (failCountFromStore) setFailCount(Number(failCountFromStore));
        } else {
          console.log("ยังไม่มี PIN เก็บไว้ (userPin is null)");
        }
      } catch (error) {
        console.error("Error loading stored PIN:", error);
      }
    };
    loadStoredPin();
  }, []);

  useEffect(() => {
    const checkLocked = async () => {
      const failCountFromStore = await SecureStore.getItemAsync("failCount");
      if (failCountFromStore && Number(failCountFromStore) >= 5) {
        navigation.replace("PinLocked", { returnTo: "PinEntry" });
      }
    };
    checkLocked();
  }, []);

  // เมื่อกดตัวเลข
  const handleNumberPress = useCallback((num: string) => {
    setPin((prev) => {
      if (prev.length < 6) {
        return prev + num;
      }
      return prev;
    });
  }, []);

  // เมื่อกด Backspace
  const handleBackspace = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  // เมื่อกด "ลืมรหัส PIN?"
  const handleForgotPin = useCallback(() => {
    navigation.navigate("VerifyPinLock", { returnTo: "PinEntry" });
  }, [navigation]);

  // เมื่อปิด Error Modal
  const handleDismissError = useCallback(() => {
    setIsErrorModalVisible(false);
    setPin(""); // เคลียร์ PIN เมื่อปิด modal
  }, []);

  // ตรวจสอบ PIN เมื่อกรอกครบ 6 ตัว
  useEffect(() => {
    if (!fontsLoaded || pin.length !== 6) return;

    const validatePin = async () => {
      if (storedPin === null) {
        setErrorMessage("ยังไม่เคยตั้ง PIN ไว้ในเครื่อง");
        setIsErrorModalVisible(true);
        return;
      }

      if (pin === storedPin) {
        await SecureStore.deleteItemAsync("failCount");
        navigation.replace("Home");
      } else {
        const newFailCount = failCount + 1;
        setFailCount(newFailCount);
        await SecureStore.setItemAsync("failCount", String(newFailCount));

        if (newFailCount >= 5) {
          navigation.replace("PinLocked");
          return;
        }

        setErrorMessage("PIN รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
        setIsErrorModalVisible(true);
      }
    };

    validatePin();
  }, [pin, storedPin, navigation, fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Back Button */}
        {/* <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color="#CFA459" />
        </TouchableOpacity> */}

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

        {/* ลืมรหัส PIN? */}
        <TouchableOpacity
          onPress={handleForgotPin}
          style={styles.forgotPinContainer}
        >
          <Text style={styles.forgotPinTextLarge}>ลืมรหัส PIN?</Text>
        </TouchableOpacity>

        {/* Error Modal */}
        <PinErrorModal
          visible={isErrorModalVisible}
          onDismiss={handleDismissError}
          message={errorMessage}
        />
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
    marginBottom: 15,
  },
  forgotPinContainer: {
    marginTop: 20,
  },
  forgotPinTextLarge: {
    fontSize: 14,
    color: "#CFA459",
    textDecorationLine: "underline",
  },
});
