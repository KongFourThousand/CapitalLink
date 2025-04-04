import React, { useState, useCallback } from "react";
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
import { RootStackParamList } from "../../navigation/RootNavigator";
import CustomNumpad from "../../components/common/CustomNumpad";
import PinDotRow from "../../components/common/PinDotRow";

const { width } = Dimensions.get("window");

type PinKeyboardNavProp = NativeStackNavigationProp<RootStackParamList, "PinEntry">;

const PinEntryKeyboardScreen: React.FC = () => {
  const navigation = useNavigation<PinKeyboardNavProp>();
  const [pin, setPin] = useState("");

  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman.ttf"),
  });


  const handleNumberPress = useCallback((num: string) => {
    // ใช้ setPin แบบ callback เพื่ออัปเดตค่า state โดยไม่ต้องพึ่งพา dependency pin
    setPin((prev) => {
      if (prev.length < 6) {
        return prev + num;
      }
      return prev;
    });
  }, []);

  const handleBackspace = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const handleForgotPin = useCallback(() => {
    navigation.replace("Login");
  }, [navigation]);

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
          // showForgotPin={true}
          customStyles={{ container: { width: "80%",marginTop: 15  } }}
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
