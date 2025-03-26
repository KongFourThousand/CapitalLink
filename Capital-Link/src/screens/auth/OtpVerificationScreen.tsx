import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  ActivityIndicator 
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
  const [timer, setTimer] = useState(5);
  const [loading, setLoading] = useState(false); // สำหรับแสดง loading ตอนขอ OTP
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<OtpRouteProp>();
  const from = route.params.from; // ได้แล้วว่าเรามาจากหน้าไหน

  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman.ttf"),
  });

 // นับถอยหลัง 60 วิ
 useEffect(() => {
  if (timer > 0) {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }
}, [timer]);

 // เมื่อผู้ใช้กรอก OTP ทีละหลัก
 const handleOtpChange = (text: string, index: number) => {
  const newOtp = [...otp];
  newOtp[index] = text;
  setOtp(newOtp);
  // TODO: focus ถัดไป หรือ check if OTP เต็ม 6 ตัว
};
// ตัวอย่างฟังก์ชันเรียก API ขอ OTP ใหม่ (mock)
const requestNewOtp = async () => {
  try {
    setLoading(true);
    // เรียก API จริงตาม backend ของคุณ
    // ตัวอย่าง mock: รอสัก 1 วิ
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // เมื่อสำเร็จ → รีเซ็ต timer กลับไป 60
    setTimer(60);
  } catch (error) {
    console.log("error requesting new OTP:", error);
  } finally {
    setLoading(false);
  }
};

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={26} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>ยืนยัน OTP</Text>

      <Image
        source={require("../../../assets/CLLogin.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.companyName}>CAPITAL LINK</Text>
      <Text style={styles.text}>กรุณากรอกรหัส OTP ที่ส่งไปยังเบอร์</Text>
      <Text style={styles.phoneNumber}>0XX-XXX-XXXX</Text>
      <Text style={styles.subText}>รหัสนี้จะถูกยกเลิกภายใน 3 นาที</Text>

      <View style={styles.otpRow}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            style={styles.otpBox}
            keyboardType="number-pad"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleOtpChange(text, index)}
          />
        ))}
      </View>

      {/* <Text style={styles.timerText}>ขอรหัส OTP ใหม่อีก {timer} วินาที</Text> */}
      
      {/* ถ้ายังมีเวลานับถอยหลัง => แสดงข้อความ ถ้าเหลือ 0 => แสดงลิงก์กดได้ */}
      {timer > 0 ? (
        // กรณีเหลือเวลา
        <Text style={styles.timerText}>
          ขอรหัส OTP ใหม่อีก {timer} วินาที
        </Text>
      ) : (
        // กรณีหมดเวลาแล้ว → กดขอใหม่ได้
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

      {/* ปุ่มยืนยัน */}

      <TouchableOpacity activeOpacity={0.9}>
        <LinearGradient
          colors={["#c19346", "#d4af71", "#e6c170"]}
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
  },
  backIcon: {
    alignSelf: "flex-start",
    marginTop: 30,
    // backgroundColor: "pink"
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.25,
    marginVertical: 10,
  },
  companyName: {
    fontSize: 16,
    color: "#CFA459",
    fontWeight: "500",
    fontFamily: "TimesNewRoman",
    marginBottom: 30,
  },
  text: {
    fontSize: 13,
    color: "#000",
    textAlign: "center",
  },
  phoneNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginTop: 5,
    textAlign: "center",
  },
  subText: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
    marginBottom: 20,
    textAlign: "center",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  otpBox: {
    width: 42,
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
  },
  timerText: {
    fontSize: 12,
    color: "#333",
    marginBottom: 20,
  },
  confirmButton: {
    width: 55,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  supportText: {
    fontSize: 11,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
  },
  resendContainer: {
    marginBottom: 20,
  },
  resendText: {
    fontSize: 13,
    color: "#CFA459", // สีทอง
    textDecorationLine: "underline", // ทำเป็นลิงก์
    textAlign: "center", // (ถ้าอยากให้อยู่กลาง)
  },
  
});
