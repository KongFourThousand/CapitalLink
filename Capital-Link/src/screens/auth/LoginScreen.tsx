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
import { formatPhoneNumber } from "../../components/common/formatPhoneAndID";
import { mockRequestOtp } from "../../services/mockApi";

const { width } = Dimensions.get("window");

const LoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman.ttf"),
  });

  // รับเฉพาะตัวเลข 10 หลัก
  const handlePhoneChange = (input: string) => {
    const digitsOnly = input.replace(/\D/g, "").substring(0, 10);
    setPhoneNumber(digitsOnly);
  };

  // ขอ OTP
  const handleRequestOtp = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert("หมายเลขไม่ถูกต้อง", "กรุณากรอกเบอร์โทร 10 หลัก");
      return;
    }

    try {
      setLoading(true);
      await mockRequestOtp(phoneNumber);
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

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Back Button */}
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
            maxLength={12} // 10 ตัวเลข + 2 ขีด
            value={formatPhoneNumber(phoneNumber)}
            onChangeText={handlePhoneChange}
          />
        </View>

        {/* Hint */}
        {phoneNumber.length < 10 && phoneNumber.length > 0 && (
          <Text style={styles.hintText}>
            กรุณากรอกเฉพาะตัวเลข 10 หลัก เช่น 0812345678
          </Text>
        )}

        {/* OTP Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleRequestOtp}
          disabled={phoneNumber.length < 10 || loading}
        >
          <LinearGradient
            colors={["#e6c170", "#d4af71", "#c19346"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[
              styles.button,
              (phoneNumber.length < 10 || loading) && { opacity: 0.6 },
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

        {/* Register */}
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
