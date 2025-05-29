import type React from "react";
import { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import type { RootStackParamList } from "../../../navigation/RootNavigator";
import { useData } from "../../../Provide/Auth/UserDataProvide";
import { api } from "../../../../API/route";

type NameChangeRequestScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "EmailChange"
>;

const EmailChangeRequest: React.FC = () => {
  const navigation = useNavigation<NameChangeRequestScreenNavProp>();
  const { UserData, setUserData, setLoading } = useData();
  // สถานะสำหรับกรอกชื่อใหม่ / นามสกุลใหม่
  const [StoreEmail, setStoreEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // สถานะการโหลด
  const [isLoading, setIsLoading] = useState(false);

  // Refs สำหรับ TextInput
  const lastNameInputRef = useRef<TextInput>(null);

  // ฟังก์ชันกดปุ่ม Back → กลับหน้าเดิม
  const handleBack = () => {
    navigation.goBack();
  };
  const SaveNewEmail = async () => {
    const updatedData = {
      ...UserData,
      email: newEmail,
    };
    setUserData(updatedData);
    await SecureStore.setItemAsync("userData", JSON.stringify(updatedData));
  };
  // ฟังก์ชันยื่นคำขอ
  const handleSubmitRequest = async () => {
    // ถ้าไม่ได้แนบอีเมลล์เดิม
    if (!StoreEmail) {
      Alert.alert("ข้อมูลไม่ครบถ้วน", "กรุณากรอกอีเมลล์เดิม");
      return;
    }
    // ถ้าไม่ได้แนบอีเมลล์เดิม
    if (StoreEmail !== UserData.email) {
      Alert.alert("ข้อมูลไม่ถูกต้อง", "กรุณากรอกอีเมลล์เดิมให้ถูกต้อง");
      return;
    }
    if (newEmail === StoreEmail) {
      Alert.alert(
        "ข้อมูลไม่ถูกต้อง",
        "กรุณากรอกอีเมลล์ใหม่ให้แตกต่างจากอีเมลล์เดิม"
      );
      return;
    }
    // ถ้าอีเมลล์ใหม่ว่าง
    if (!newEmail.trim()) {
      Alert.alert("ข้อมูลไม่ครบถ้วน", "กรุณากรอกอีเมลล์");
      return;
    }

    setIsLoading(true);
    setLoading(true);
    // SaveNewEmail();
    const data = {
      type: UserData.userType,
      personalIdCard: UserData.personalIdCard,
      birthDate: UserData.birthDate,
      email: newEmail,
    };
    try {
      const res = await api("changeRequest/Email", data, "json", "POST");
      console.log("res:", res);
      console.log("getChangeEmail res:", res.user);
      if (res.status === "ok") {
        setIsLoading(false);
        setLoading(false);
        setUserData(res.user);
        await SecureStore.setItemAsync("userData", JSON.stringify(res.user));
      } else {
        Alert.alert("Error", "ส่งไม่สำเร็จ");
        setLoading(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error getLoanInfo:", error);
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* ปุ่ม Back */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={26} color="#CFA459" />
        </TouchableOpacity>

        {/* Header Title */}
        <Text style={styles.headerTitle}>ขอเปลี่ยนอีเมลล์</Text>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.formContainer}>
            {/* กรอกชื่อใหม่ */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>อีเมลล์เดิม</Text>
              <TextInput
                style={styles.textInput}
                value={StoreEmail}
                onChangeText={setStoreEmail}
                placeholder="กรอกอีเมลล์เดิม"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => lastNameInputRef.current?.focus()}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>อีเมลล์ใหม่</Text>
              <TextInput
                style={styles.textInput}
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="กรอกอีเมลล์ใหม่"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => lastNameInputRef.current?.focus()}
              />
            </View>
          </View>

          {/* ปุ่มยื่นคำขอ */}
          <LinearGradient
            colors={["#c49a45", "#d4af71", "#e0c080"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
          >
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitRequest}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>ยื่นคำขอ</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>

          {/* คำอธิบายเพิ่มเติม */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteTitle}>หมายเหตุ:</Text>
            <Text style={styles.noteText}>
              -ระบบจะทำการตรวจสอบอีเมลล์เดิม และเปลี่ยนแปลงอีเมลล์ใหม่ทันที
              กรุณาตรวจสอบอีเมลล์ให้ถูกต้อง
            </Text>
            <Text style={styles.noteText}>
              -
              กรณีอีเมลล์เดิมที่กรอกมาไม่ถูกต้องจะไม่สามารถเปลี่ยนแปลงอีเมลล์ได้
            </Text>

            <Text style={styles.noteText}>
              - หากมีข้อสงสัย กรุณาติดต่อ Call Center: 02-xxx-xxxx
            </Text>
          </View>

          {/* Spacer สำหรับ ScrollView */}
          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EmailChangeRequest;

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
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    marginTop: 5,
  },
  formContainer: {
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  formNote: {
    fontSize: 13,
    color: "#666",
    marginBottom: 24,
    lineHeight: 18,
  },
  documentContainer: {
    marginBottom: 24,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
  },
  documentHint: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  documentPreview: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  documentImage: {
    width: "100%",
    height: 200,
  },
  removeDocumentButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: 4,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CFA459",
    borderRadius: 8,
    borderStyle: "dashed",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  uploadButtonText: {
    fontSize: 16,
    color: "#CFA459",
    marginLeft: 8,
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
