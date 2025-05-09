import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useData } from "../../Provide/Auth/UserDataProvide";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { Ionicons } from "@expo/vector-icons";

// type NavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   "VerifyPinLock"
// >;
type VerifyNav = NativeStackNavigationProp<RootStackParamList, "VerifyPinLock">;
type VerifyRoute = RouteProp<RootStackParamList, "VerifyPinLock">;
const PinLockedScreen: React.FC = () => {
  // const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VerifyRoute>();
  const navigation = useNavigation<VerifyNav>();
  const { returnTo } = route.params;
  const { UserData } = useData();
  const [idInput, setIdInput] = useState("");
  const [error, setError] = useState("");

  // ฟังก์ชันจัดรูปแบบเลขบัตรประชาชน x-xx-x-xxx-xxxxx-x
  const formatId = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const parts: string[] = [];
    if (digits.length > 0) parts.push(digits.substr(0, 1));
    if (digits.length > 1) parts.push(digits.substr(1, 2));
    if (digits.length > 3) parts.push(digits.substr(3, 1));
    if (digits.length > 4) parts.push(digits.substr(4, 3));
    if (digits.length > 7) parts.push(digits.substr(7, 5));
    if (digits.length > 12) parts.push(digits.substr(12, 1));
    return parts.join("-");
  };

  const handleChange = (text: string) => {
    const formatted = formatId(text);
    setIdInput(formatted);
    if (error) setError("");
  };

  // ตรวจสอบและนำทางถ้าเลขถูกต้อง
  const handleConfirm = () => {
    const rawInput = idInput.replace(/-/g, "");
    if (rawInput === UserData.personalIdCard) {
      navigation.replace("NewPinSetup", { returnTo });
    } else {
      setError("เลขบัตรประชาชนไม่ถูกต้อง");
    }
  };

  // ปุ่มเปิดใช้งานเมื่อกรอกครบ 13 หลัก
  const isValid = idInput.replace(/-/g, "").length === 13;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
        {returnTo === "PinEntry" && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={26} color="#CFA459" />
          </TouchableOpacity>
        )}

        <View
          style={{
            flex: 1,
            alignItems: "center",
            position: "absolute",
            left: 0,
            right: 0,
          }}
        >
          <Text style={styles.title}>ยืนยันตัวตน</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          กรุณากรอกเลขบัตรประชาชนของคุณเพื่อปลดล็อค PIN
        </Text>
        <TextInput
          style={styles.input}
          placeholder="x-xx-x-xxx-xxxxx-x"
          keyboardType="number-pad"
          value={idInput}
          onChangeText={handleChange}
          maxLength={18}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleConfirm}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>ยืนยัน</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 60,
    flexDirection: "row", // 🔴 สำคัญ
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: StatusBar.currentHeight || 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  title: {
    // position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#2A2867",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 24,
  },
  error: {
    color: "#FF3333",
    marginTop: 8,
    textAlign: "center",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#2A2867",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  backButton: {
    position: "absolute",
    top: 55,
    zIndex: 99,
  },
});

export default PinLockedScreen;
