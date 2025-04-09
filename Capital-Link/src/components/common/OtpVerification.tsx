// OtpVerificationComponent.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  NativeSyntheticEvent,
  TextInputKeyPressEventData
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { formatPhoneNumber } from "./formatPhoneAndID"; 

const { width } = Dimensions.get("window");


// // ฟังก์ชัน formatPhoneNumber => เอาเฉพาะตัวเลข + แปลงเป็น xxx-xxx-xxxx ถ้าได้ 10 หลัก
// function formatPhoneNumber(rawPhone: string): string {
//   // เอาเฉพาะตัวเลข
//   const digits = rawPhone.replace(/\D/g, "");

//   // ถ้าได้ครบ 10 หลัก => xxx-xxx-xxxx
//   if (digits.length === 10) {
//     return digits.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
//   }

//   // กรณีไม่ครบ 10 ก็คืนค่าตาม rawPhone เดิม หรือจะคืน digits เฉย ๆ ก็ได้
//   return rawPhone;
// }

interface OtpVerificationComponentProps {
  phoneNumber: string;
  onVerify: (otpCode: string) => void;
  onResendOtp?: () => Promise<void>;
  initialTimerSeconds?: number;
  buttonText?: string;
  showPhoneNumberInfo?: boolean;
}

const OtpVerificationComponent: React.FC<OtpVerificationComponentProps> = ({
  phoneNumber,
  onVerify,
  onResendOtp,
  initialTimerSeconds = 60,
  buttonText = "ยืนยัน",
  showPhoneNumberInfo = true
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(initialTimerSeconds);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);


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
      
      if (onResendOtp) {
        await onResendOtp();
      } else {
        // Default mock behavior
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      
      setTimer(initialTimerSeconds);
    } catch (error) {
      console.log("error requesting new OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเมื่อกดปุ่มยืนยัน
  const handleConfirmOTP = () => {
      const otpCode = otp.join("");
    onVerify(otpCode);
  };

  const formattedPhone = formatPhoneNumber(phoneNumber);

  return (
    <View style={styles.container}>
      {showPhoneNumberInfo && (
        <>
          <Text style={styles.text}>กรุณากรอกรหัส OTP ที่ส่งไปยังเบอร์</Text>
           <Text style={styles.phoneNumber}>{formattedPhone}</Text>
          <Text style={styles.subText}>รหัสนี้จะถูกยกเลิกภายใน 3 นาที</Text>
        </>
      )}

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

      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={handleConfirmOTP}
        disabled={otp.join("").length !== 6}
      >
        <LinearGradient
          colors={["#e6c170", "#d4af71", "#c19346"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            styles.confirmButton,
            otp.join("").length !== 6 && styles.confirmButtonDisabled
          ]}
        >
          <Text style={styles.confirmButtonText}>{buttonText}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default OtpVerificationComponent;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
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
    width: 120,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  }
});