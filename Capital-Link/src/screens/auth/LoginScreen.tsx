// LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { formatPhoneNumber } from "../../components/common/formatPhoneNumber";
// mockRequestOtp คือฟังก์ชันที่ mock การขอ OTP
import { mockRequestOtp } from "../../services/mockApi";

const { width } = Dimensions.get("window");

const LoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman.ttf"),
  });
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (!fontsLoaded) return null;

  // ฟังก์ชันที่ใช้กรองเฉพาะตัวเลขและจำกัด 10 หลัก
  const handlePhoneChange = (input: string) => {
    // ตัดอักขระที่ไม่ใช่ตัวเลข
    let digitsOnly = input.replace(/\D/g, "");
    // จำกัดไม่เกิน 10 ตัว
    if (digitsOnly.length > 10) {
      digitsOnly = digitsOnly.substring(0, 10);
    }
    setPhoneNumber(digitsOnly);
  };

  // ฟังก์ชันขอ OTP
  const handleRequestOtp = async () => {
    // เช็คก่อนว่า 10 หลักหรือยัง
    if (phoneNumber.length < 10) {
      Alert.alert("หมายเลขไม่ถูกต้อง", "กรุณากรอกเบอร์โทร 10 หลัก");
      return;
    }

    try {
      setLoading(true);
      // เรียก mockRequestOtp
      await mockRequestOtp(phoneNumber);

      // ถ้าสำเร็จ -> ไปหน้า OtpVerification
      navigation.navigate("OtpVerification", {
        from: "Login",
        phoneNumber: phoneNumber,
      });
    } catch (error) {
      console.log("ขอ OTP ไม่สำเร็จ:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถขอ OTP ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* ปุ่มย้อนกลับ */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.replace("InitialEntry")}
        >
          <Ionicons name="chevron-back" size={24} color="#CFA459" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/CLlogo+NoBG.png")}
            style={styles.logo}
          />
        </View>

        {/* Phone Input */}
        <Text style={styles.inputLabel}>เบอร์โทรศัพท์</Text>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <FontAwesome name="phone" size={20} color="#999999" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="0XX-XXX-XXXX"
            placeholderTextColor="#AAAAAA"
            keyboardType="phone-pad"
            // สำคัญ: maxLength ที่ TextInput ช่วยกันผู้ใช้พิมพ์เกิน
            // แต่หาก copy+paste เกิน ก็ handle เพิ่มใน handlePhoneChange
            maxLength={10}
            // ตอนเปลี่ยนข้อความ -> เรียก handlePhoneChange
            value={phoneNumber}
            onChangeText={handlePhoneChange}
          />
        </View>

        {/* ข้อความแนะนำเล็ก ๆ (Hint) */}
        {phoneNumber.length < 10 && (
          <Text style={styles.hintText}>
            กรุณากรอกเฉพาะตัวเลข 10 หลัก เช่น 0812345678
          </Text>
        )}

        {/* Login Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleRequestOtp}
          // disable ถ้ายังไม่ครบ 10 หลัก
          disabled={phoneNumber.length < 10 || loading}
        >
          <LinearGradient
            colors={["#e6c170", "#d4af71", "#c19346"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            // ถ้า disabled -> style ปุ่มให้จางลง
            style={[
              styles.button,
              (phoneNumber.length < 10 || loading) && { opacity: 0.6 }
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>ขอรหัส OTP</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>หรือ</Text>
          <View style={styles.divider} />
        </View>

        {/* Register Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Register")}
        >
          <LinearGradient
            colors={["#e6c170", "#d4af71", "#c19346"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>ลงทะเบียนใหม่</Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
    alignItems: "center",
    marginTop: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: width * 0.9,
    height: width * 0.5,
    resizeMode: "contain",
    marginBottom: 30,
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 6,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    marginBottom: 6,
    height: 48,
  },
  iconContainer: {
    width: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingRight: 15,
    color: "#333333",
  },
  hintText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
  },
  button: {
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#555555",
    fontSize: 14,
    fontWeight: "600",
  },
});
