import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { useRoute, RouteProp } from "@react-navigation/native";
import OtpVerification from "../../components/common/OtpVerification";

// ปรับปรุง type ให้ถูกต้อง
type OtpRouteProp = RouteProp<
  {
    OtpVerification: {
      from: "Login" | "Register";
      phoneNumber: string;
    }
  },
  "OtpVerification"
>;

const { width } = Dimensions.get("window");

const OtpVerificationScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<OtpRouteProp>();
  
  // ใช้ optional chaining และ default value ในกรณีที่ไม่มี property นี้
  const from = route.params?.from || "login";
  const phoneNumber = route.params?.phoneNumber || "0XX-XXX-XXXX";

  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman.ttf"),
  });

  const handleVerifyOtp = (otpCode: string) => {
    console.log(`Verifying OTP: ${otpCode}`);
    if (otpCode === "123456") {
      navigation.replace("PinSetup");
    } else {
      Alert.alert("OTP ไม่ถูกต้อง", "กรุณากรอกรหัสอีกครั้ง");
    }
  };

  // ฟังก์ชันขอ OTP ใหม่
  const handleResendOtp = async () => {
    // สมมติว่าส่งคำขอไปยัง API ผ่านไปแล้ว
    console.log("Resending OTP to:", phoneNumber);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button*/}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={26} color="#CFA459" />
      </TouchableOpacity>

      <Text style={styles.title}>ยืนยัน OTP</Text>

      <Image
        source={require("../../../assets/CapitalLink.png")}
        style={styles.logo}
      />

      <OtpVerification
        phoneNumber={phoneNumber}
        onVerify={handleVerifyOtp}
        onResendOtp={handleResendOtp}
        initialTimerSeconds={60}
      />

      <Text style={styles.supportText}>
        หากต้องการความช่วยเหลือกรุณาติดต่อ{"\n"}ศูนย์บริการลูกค้า
      </Text>
    </SafeAreaView>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 60,
    marginBottom: 20,
    color: "#333",
  },
  logo: {
    width: width * 0.7,
    height: width * 0.35,
    marginVertical: 10,
  },
  supportText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,     
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999, 
  },
});