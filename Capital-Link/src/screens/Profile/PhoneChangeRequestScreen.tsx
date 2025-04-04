import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { LinearGradient } from "expo-linear-gradient";

type PhoneChangeRequestScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PhoneChange"
>;

const PhoneChangeRequestScreen: React.FC = () => {
  const navigation = useNavigation<PhoneChangeRequestScreenNavProp>();
  
  // เบอร์โทรศัพท์ปัจจุบัน (สมมติว่าดึงมาจาก API หรือ state อื่น)
  const [currentPhone, setCurrentPhone] = useState("081-234-5678");
  
  // เบอร์โทรศัพท์ใหม่
  const [newPhone, setNewPhone] = useState("");
  
  // สถานะการโหลด
  const [isLoading, setIsLoading] = useState(false);
  
  // สถานะการยืนยัน OTP
  const [isVerifying, setIsVerifying] = useState(false);
  
  // รหัส OTP
  const [otp, setOtp] = useState("");

  // ฟังก์ชันกดปุ่ม Back → กลับหน้าเดิม
  const handleBack = () => {
    navigation.goBack();
  };

  // ฟังก์ชันจัดรูปแบบเบอร์โทรศัพท์
  const formatPhoneNumber = (phone: string) => {
    // ลบทุกอักขระที่ไม่ใช่ตัวเลข
    const numbers = phone.replace(/\D/g, "");
    
    // จัดรูปแบบ XXX-XXX-XXXX
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  // ฟังก์ชันจัดการการเปลี่ยนเบอร์โทรศัพท์
  const handlePhoneChange = (text: string) => {
    const formattedPhone = formatPhoneNumber(text);
    setNewPhone(formattedPhone);
  };

  // ฟังก์ชันส่งรหัส OTP
  const handleSendOTP = () => {
    // ตรวจสอบเบอร์โทรศัพท์
    if (!newPhone) {
      Alert.alert("ข้อมูลไม่ครบถ้วน", "กรุณากรอกเบอร์โทรศัพท์ใหม่");
      return;
    }
    
    // ตรวจสอบรูปแบบเบอร์โทรศัพท์
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    const normalizedPhone = newPhone.replace(/-/g, "");
    
    if (normalizedPhone.length !== 10 || !phonePattern.test(newPhone)) {
      Alert.alert("ข้อมูลไม่ถูกต้อง", "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (XXX-XXX-XXXX)");
      return;
    }
    
    // แสดงการโหลด
    setIsLoading(true);
    
    // สมมติว่าส่งรหัส OTP ไปยังเบอร์โทรศัพท์ใหม่
    setTimeout(() => {
      setIsLoading(false);
      setIsVerifying(true);
      Alert.alert("ส่งรหัส OTP สำเร็จ", `รหัส OTP ถูกส่งไปยังเบอร์ ${newPhone} แล้ว`);
    }, 1500);
  };

  // ฟังก์ชันยืนยันรหัส OTP
  const handleVerifyOTP = () => {
    // ตรวจสอบรหัส OTP
    if (!otp) {
      Alert.alert("ข้อมูลไม่ครบถ้วน", "กรุณากรอกรหัส OTP");
      return;
    }
    
    if (otp.length !== 6) {
      Alert.alert("ข้อมูลไม่ถูกต้อง", "รหัส OTP ต้องมี 6 หลัก");
      return;
    }
    
    // แสดงการโหลด
    setIsLoading(true);
    
    // สมมติว่าตรวจสอบรหัส OTP
    setTimeout(() => {
      setIsLoading(false);
      
      // แสดงแจ้งเตือนส่งสำเร็จ
      Alert.alert(
        "เปลี่ยนเบอร์โทรศัพท์สำเร็จ",
        `เบอร์โทรศัพท์ของคุณถูกเปลี่ยนเป็น ${newPhone} เรียบร้อยแล้ว`,
        [
          {
            text: "ตกลง",
            onPress: () => navigation.navigate("Profile"),
          },
        ]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* ปุ่ม Back */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={26} color="#CFA459" />
        </TouchableOpacity>

        {/* Header Title */}
        <Text style={styles.headerTitle}>ขอเปลี่ยนเบอร์โทรศัพท์</Text>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* เบอร์โทรศัพท์ปัจจุบัน */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>เบอร์โทรศัพท์ปัจจุบัน</Text>
            <Text style={styles.currentPhone}>{currentPhone}</Text>
          </View>

          {/* กรอกเบอร์โทรศัพท์ใหม่ */}
          {!isVerifying ? (
            <View style={styles.formContainer}>
              <Text style={styles.sectionLabel}>กรอกเบอร์โทรศัพท์ใหม่</Text>
              
              <View style={styles.inputContainer}>
                <TextInput 
                  style={styles.phoneInput}
                  value={newPhone}
                  onChangeText={handlePhoneChange}
                  placeholder="XXX-XXX-XXXX"
                  keyboardType="phone-pad"
                  maxLength={12} // รวม - ด้วย
                />
                
                <LinearGradient
                  colors={["#c49a45", "#d4af71", "#e0c080"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sendOtpGradient}
                >
                  <TouchableOpacity
                    style={styles.sendOtpButton}
                    onPress={handleSendOTP}
                    activeOpacity={0.8}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={styles.sendOtpText}>ส่ง OTP</Text>
                    )}
                  </TouchableOpacity>
                </LinearGradient>
              </View>
              
              <Text style={styles.phoneHint}>
                * เบอร์โทรศัพท์จะถูกใช้สำหรับการติดต่อและการยืนยันตัวตน
              </Text>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.sectionLabel}>ยืนยันรหัส OTP</Text>
              
              <View style={styles.otpContainer}>
                <Text style={styles.otpDescription}>
                  กรุณากรอกรหัส OTP 6 หลัก ที่ส่งไปยังเบอร์โทรศัพท์ {newPhone}
                </Text>
                
                <TextInput 
                  style={styles.otpInput}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="XXXXXX"
                  keyboardType="number-pad"
                  maxLength={6}
                />
                
                <View style={styles.otpActions}>
                  <TouchableOpacity 
                    style={styles.resendButton}
                    onPress={handleSendOTP}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.resendText}>ส่งรหัสอีกครั้ง</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.changeNumberButton}
                    onPress={() => setIsVerifying(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.changeNumberText}>เปลี่ยนเบอร์</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* ปุ่มยืนยัน */}
          {isVerifying && (
            <LinearGradient
              colors={["#c49a45", "#d4af71", "#e0c080"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}
            >
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleVerifyOTP}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>ยืนยัน</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
          )}

          {/* คำอธิบายเพิ่มเติม */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteTitle}>หมายเหตุ:</Text>
            <Text style={styles.noteText}>
              - เมื่อเปลี่ยนเบอร์โทรศัพท์แล้ว ระบบจะใช้เบอร์ใหม่ในการติดต่อและแจ้งเตือนทันที
            </Text>
            <Text style={styles.noteText}>
              - เบอร์โทรศัพท์ที่ใช้ต้องเป็นเบอร์ที่สามารถรับ SMS ได้
            </Text>
            <Text style={styles.noteText}>
              - หากไม่ได้รับรหัส OTP ภายใน 3 นาที กรุณากดส่งรหัสอีกครั้ง
            </Text>
            <Text style={styles.noteText}>
              - หากมีข้อสงสัยกรุณาติดต่อ Call Center: 02-xxx-xxxx
            </Text>
          </View>

          {/* Spacer สำหรับ ScrollView */}
          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PhoneChangeRequestScreen;

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 18,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 999,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#CFA459",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  infoCard: {
    backgroundColor: "#FFF9EF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#CFA459",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  currentPhone: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    marginTop: 5,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
  },
  sendOtpGradient: {
    borderRadius: 8,
  },
  sendOtpButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sendOtpText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  phoneHint: {
    fontSize: 12,
    color: "#777",
    marginTop: 8,
    fontStyle: "italic",
  },
  otpContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  otpDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  otpInput: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 8,
    marginBottom: 16,
  },
  otpActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resendButton: {
    paddingVertical: 8,
  },
  resendText: {
    color: "#CFA459",
    fontSize: 14,
    fontWeight: "500",
  },
  changeNumberButton: {
    paddingVertical: 8,
  },
  changeNumberText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  submitGradient: {
    borderRadius: 12,
    marginBottom: 24,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  noteContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  noteText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
    lineHeight: 18,
  },
});