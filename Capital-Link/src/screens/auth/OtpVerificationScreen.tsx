import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  ActivityIndicator,
  NativeSyntheticEvent,
  TextInputKeyPressEventData
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { useRoute, RouteProp } from "@react-navigation/native";

type OtpRouteProp = RouteProp<RootStackParamList, "OtpVerification">;
const { width } = Dimensions.get("window");

const OtpVerificationScreen: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(10); // หรือ 60
  const [loading, setLoading] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<OtpRouteProp>();
  const from = route.params.from;

  // เพิ่ม useRef สำหรับ TextInput แต่ละตัว
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman.ttf"),
  });

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // ผู้ใช้กรอก OTP (ปรับ focus ช่องถัดไปถ้าใส่ 1 ตัวแล้ว)
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      // ถ้าช่องปัจจุบันยังไม่มีตัวอักษร => ข้ามไปช่องก่อนหน้า
      if (!otp[index] && index > 0) {
        // โฟกัสช่องก่อนหน้า
        inputRefs.current[index - 1]?.focus();

        // ลบค่าช่องก่อนหน้า (เผื่อผู้ใช้ต้องการลบต่อเนื่อง)
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  // mock ขอ OTP ใหม่
  const requestNewOtp = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTimer(60);
    } catch (error) {
      console.log("error requesting new OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเมื่อกดปุ่มยืนยัน
  const handleConfirmOTP = () => {
    // สมมติว่าเช็ก OTP แล้วผ่าน → ไปหน้า PinSetupScreen
    navigation.replace("PinSetup");
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

      <Text style={styles.text}>กรุณากรอกรหัส OTP ที่ส่งไปยังเบอร์</Text>
      <Text style={styles.phoneNumber}>0XX-XXX-XXXX</Text>
      <Text style={styles.subText}>รหัสนี้จะถูกยกเลิกภายใน 3 นาที</Text>

      <View style={styles.otpRow}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)} // ผูก ref
            style={styles.otpBox}
            keyboardType="number-pad"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      {timer > 0 ? (
        <Text style={styles.timerText}>ขอรหัส OTP ใหม่อีก {timer} วินาที</Text>
      ) : (
        <TouchableOpacity
          style={styles.resendContainer}
          onPress={requestNewOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#CFA459" />
          ) : (
            <Text style={styles.resendText}>ขอรหัส OTP อีกครั้ง</Text>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity activeOpacity={0.9} onPress={handleConfirmOTP}>
        <LinearGradient
          colors={["#e6c170", "#d4af71", "#c19346"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.confirmButton}
        >
          <Text style={styles.confirmButtonText}>ยืนยัน</Text>
        </LinearGradient>
      </TouchableOpacity>

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
    // ถ้าอยาก content อยู่กลางแนวตั้ง => justifyContent: 'center'
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
  text: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    marginTop: 30,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 5,
    textAlign: "center",
  },
  subText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    marginBottom: 20,
    textAlign: "center",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
  },
  otpBox: {
    width: 42,
    height: 48,
    marginHorizontal: 6,  
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
  },
  timerText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
  },
  resendContainer: {
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    color: "#CFA459",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  confirmButton: {
    borderRadius: 8,
    width: 80,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  supportText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
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
});
