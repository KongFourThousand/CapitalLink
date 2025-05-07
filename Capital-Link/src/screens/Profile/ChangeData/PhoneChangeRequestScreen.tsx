import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../../../navigation/RootNavigator";
import { formatPhoneNumber } from "../../../utils/formatPhoneAndID";
import { useData } from "../../../Provide/Auth/UserDataProvide";
import { formatPhoneNumberText } from "../../../utils/formatPhoneAndID";

type PhoneChangeRequestScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PhoneChange"
>;

const PhoneChangeRequestScreen: React.FC = () => {
  const { UserData } = useData();
  const navigation = useNavigation<PhoneChangeRequestScreenNavProp>();

  const [newPhone, setNewPhone] = useState("");

  const handleBack = () => navigation.goBack();

  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/\D/g, "").substring(0, 10);
    setNewPhone(digits);
  };

  const handleSendOtp = () => {
    if (newPhone.length !== 10) {
      Alert.alert("ข้อมูลไม่ถูกต้อง", "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก");
      return;
    }

    navigation.navigate("OtpVerification", {
      from: "PhoneChange",
      phoneNumber: newPhone,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* ปุ่มย้อนกลับ */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={26} color="#CFA459" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>ขอเปลี่ยนเบอร์โทรศัพท์</Text>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* เบอร์โทรปัจจุบัน */}
          <View style={styles.infoCard}>
            <Text style={styles.label}>เบอร์โทรศัพท์ปัจจุบัน</Text>
            <Text style={styles.currentPhone}>
              {formatPhoneNumberText(UserData.phone)}
            </Text>
          </View>

          {/* กรอกเบอร์ใหม่ */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>เบอร์โทรศัพท์ใหม่</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              placeholder="0XX-XXX-XXXX"
              placeholderTextColor="#AAAAAA"
              value={formatPhoneNumber(newPhone)}
              onChangeText={handlePhoneChange}
            />
            <Text style={styles.hintText}>
              เบอร์โทรศัพท์นี้จะถูกใช้ในการติดต่อและยืนยันตัวตน
            </Text>
          </View>

          {/* ปุ่มส่ง OTP */}
          <LinearGradient
            colors={["#c49a45", "#d4af71", "#e0c080"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={handleSendOtp}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>ส่ง OTP</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* หมายเหตุ */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteTitle}>หมายเหตุ:</Text>
            <Text style={styles.noteText}>
              - เบอร์โทรใหม่จะใช้สำหรับติดต่อและรับ OTP
            </Text>
            <Text style={styles.noteText}>
              - หากไม่ได้รับรหัสใน 3 นาที กรุณากดส่งรหัสอีกครั้ง
            </Text>
            <Text style={styles.noteText}>
              - หากมีปัญหา ติดต่อ Call Center: 02-xxx-xxxx
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PhoneChangeRequestScreen;

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
    fontSize: 22,
    fontWeight: "bold",
    color: "#a2754c",
    marginTop: 35,
    marginBottom: 20,
    textAlign: "center",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    marginTop: 10,
  },
  infoCard: {
    backgroundColor: "#FFF9EF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#CFA459",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  currentPhone: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  formGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  hintText: {
    fontSize: 12,
    color: "#777",
    marginTop: 8,
    fontStyle: "italic",
  },
  buttonGradient: {
    borderRadius: 12,
    marginBottom: 24,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  buttonText: {
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
