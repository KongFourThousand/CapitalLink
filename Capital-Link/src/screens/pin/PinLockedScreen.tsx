// PinLockedScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../navigation/RootNavigator";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");

type PinLockedNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PinLocked"
>;

const PinLockedScreen: React.FC = () => {
  const navigation = useNavigation<PinLockedNavProp>();

  const handleUnlockPin = async () => {
    // For now, we'll navigate to Login screen as per requirements
    await SecureStore.deleteItemAsync("failCount");
    navigation.navigate("VerifyPinLock", { returnTo: "PinEntry" });
    // navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Alert Icon */}
        <View style={styles.iconContainer}>
          {/* <Ionicons name="alert-circle" size={70} color="#a2754c" /> */}
          <MaterialCommunityIcons
            name="shield-lock"
            size={72}
            color="#D9534F"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>รหัส PIN ถูกล็อก</Text>

        {/* Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            รหัส PIN ของคุณถูกล็อกการใช้งานชั่วคราว เนื่องจากคุณกรอกรหัส PIN
            เกินจำนวนครั้งที่ระบบกำหนด เพื่อความปลอดภัยของบัญชี
          </Text>
          <Text style={styles.message}>
            คุณจะไม่สามารถเข้าใช้งานได้
            จนกว่าจะดำเนินการยืนยันตัวตนเพื่อปลดล็อกและตั้งรหัส PIN ใหม่
          </Text>
        </View>

        {/* Unlock Button */}
        <View style={styles.buttonContainer}>
          <LinearGradient
            colors={["#c49a45", "#d4af71", "#e0c080"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.unlockGradient}
          >
            <TouchableOpacity
              style={styles.unlockButton}
              onPress={handleUnlockPin}
              activeOpacity={0.8}
            >
              <Text style={styles.unlockButtonText}>ปลดล็อกรหัส PIN</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PinLockedScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: width * 0.6,
    height: width * 0.3,
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  messageContainer: {
    width: "90%",
    marginBottom: 40,
  },
  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 3,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "80%",
    marginTop: 20,
  },
  unlockGradient: {
    borderRadius: 12,
    width: "100%",
  },
  unlockButton: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  unlockButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
});
