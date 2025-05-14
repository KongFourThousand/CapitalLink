// screens/auth/PendingScreen.tsx
import type React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useData } from "../../Provide/Auth/UserDataProvide";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import * as SecureStore from "expo-secure-store";

const PendingScreen: React.FC = () => {
  const { UserData, setUserData } = useData();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleApprove = async () => {
    const updated = { ...UserData, statusUser: "NewApp" };
    setUserData(updated);
    await SecureStore.setItemAsync("userData", JSON.stringify(updated));
    navigation.replace("PinSetup");
  };
  const handleReject = async () => {
    // กำหนด error ไว้ใน context แทนการส่งผ่านพารามิเตอร์
    const updated = {
      ...UserData,
      statusUser: "docInCom",
      // errors: { personalIdCard: "รูปแบบเลขบัตรผิดต้องตรวจสอบใหม่" },
      errors: { birthDate: "วันเกิดไม่ถูกต้อง" },
    };
    setUserData(updated);
    await SecureStore.setItemAsync("userData", JSON.stringify(updated));
    navigation.replace("Register");
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>กำลังรอการอนุมัติ</Text>
        <Text style={styles.subtitle}>
          เอกสารของคุณอยู่ระหว่างการตรวจสอบ กรุณารอแจ้งเตือนผ่านแอป
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.success]}
            onPress={handleApprove}
          >
            <Text style={styles.buttonText}>เลื่อนขั้นเป็นสำเร็จ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.error]}
            onPress={handleReject}
          >
            <Text style={styles.buttonText}>เอกสารไม่ถูกต้อง</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
    color: "#2A2867",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555555",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  success: {
    backgroundColor: "#2A2867",
  },
  error: {
    backgroundColor: "#DD4A48",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default PendingScreen;
