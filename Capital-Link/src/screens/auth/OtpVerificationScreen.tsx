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

type OtpRouteProp = RouteProp<
  RootStackParamList,
  "OtpVerification"
>;

const { width } = Dimensions.get("window");

const OtpVerificationScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<OtpRouteProp>();

  const from = route.params?.from || "Login";
  const phoneNumber = route.params?.phoneNumber || "";

  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman.ttf"),
  });

  const handleVerifyOtp = (otpCode: string) => {
    if (otpCode === "123456") {
      if (from === "PhoneChange") {
        Alert.alert("เปลี่ยนเบอร์สำเร็จ", `เบอร์ของคุณคือ ${phoneNumber}`, [
          { text: "ตกลง", onPress: () => navigation.navigate("Profile") },
        ]);
      } else if (from === "Register") {
        navigation.replace("PinSetup");
      } else if (from === "Login") {
        navigation.replace("PinSetup"); // หรือใส่ค่าจริง
      }
    } else {
      Alert.alert("OTP ไม่ถูกต้อง", "กรุณากรอกใหม่อีกครั้ง");
    }
  };

  const handleResendOtp = async () => {
    console.log("Resend OTP to:", phoneNumber);
    await new Promise((res) => setTimeout(res, 1000));
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
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
      />

      <Text style={styles.supportText}>
        หากต้องการความช่วยเหลือ กรุณาติดต่อศูนย์บริการลูกค้า
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
    position: "absolute",
    top: 40,
    left: 18,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 999,
  },
});
