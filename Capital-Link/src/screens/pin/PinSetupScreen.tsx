import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { useFonts } from "expo-font";

const { width } = Dimensions.get("window");

type PinSetupScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PinSetup"
>;

const PinSetupScreen: React.FC = () => {
  const navigation = useNavigation<PinSetupScreenNavProp>();
  const [pin, setPin] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman bold.ttf"),
  });

  useEffect(() => {
    // ให้ TextInput เป็น focus เมื่อหน้าโหลดเสร็จ
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    // เพิ่ม keyboard event listener เพื่อเช็คว่า keyboard เปิดอยู่หรือไม่
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsFocused(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsFocused(false);
      }
    );

    // Clear event listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // อัพเดท PIN
  const handleChangePin = (text: string) => {
    // อนุญาตเฉพาะตัวเลข และความยาวไม่เกิน 6 หลัก
    const newPin = text.replace(/[^0-9]/g, '').slice(0, 6);
    setPin(newPin);
    
    // ถ้ากรอกครบ 6 หลัก ให้ไปหน้าถัดไป
    if (newPin.length === 6) {
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };

  // ไปหน้าถัดไป
  const handleNext = () => {
    // ส่งไปหน้าถัดไปพร้อม PIN
    navigation.navigate("PinConfirm", { firstPin: pin });
  };

  // ช่วยให้แตะที่ PIN boxes เพื่อเปิด keyboard
  const handlePinBoxPress = () => {
    inputRef.current?.focus();
  };

  if (!fontsLoaded) return null;

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

        <Text style={styles.title}>ตั้งรหัส PIN</Text>

        <View style={styles.mainContent}>
          <Text style={styles.subtitle}>กรุณากรอกรหัส PIN 6 หลัก</Text>
          <Text style={styles.description}>รหัส PIN สำหรับเข้าใช้งานในครั้งถัดไป</Text>

          {/* PIN Input Boxes */}
          <TouchableOpacity 
            activeOpacity={0.9}
            style={styles.pinContainer} 
            onPress={handlePinBoxPress}
          >
            {[0, 1, 2, 3, 4, 5].map(index => (
              <View 
                key={index} 
                style={[
                  styles.pinBox,
                  // เน้นช่องที่จะรับข้อมูลถัดไป
                  pin.length === index && isFocused ? styles.pinBoxActive : {}
                ]}
              >
                {pin.length > index && (
                  <View style={styles.pinDot} />
                )}
              </View>
            ))}
          </TouchableOpacity>

          {/* Text Input ที่ซ่อนไว้ (รับ input จริง) */}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={pin}
            onChangeText={handleChangePin}
            keyboardType="number-pad"
            maxLength={6}
            caretHidden={true}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {/* Capital Link text */}
          <Text style={styles.brandText}>Capital Link</Text>
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
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,     
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999, 
  },
  
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 60,
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
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0,
  },
  brandText: {
    color: "#CFA459",
    fontSize: 16,
    marginVertical: 20,
    fontFamily: "TimesNewRoman",
  },
});