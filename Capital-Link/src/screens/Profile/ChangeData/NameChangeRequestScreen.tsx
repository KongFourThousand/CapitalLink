import React from "react";
import { useState, useRef, useCallback } from "react";
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
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { v4 as uuidv4 } from "uuid";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import type { RootStackParamList } from "../../../navigation/RootNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from "expo-secure-store";
import { useData } from "../../../Provide/Auth/UserDataProvide";
import { api } from "../../../../API/route";
import { pickImageRaw } from "../../../Data/picker";

type NameChangeRequestScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "NameChange"
>;

const NameChangeRequestScreen: React.FC = () => {
  const navigation = useNavigation<NameChangeRequestScreenNavProp>();
  const { UserData, setUserData, setLoading } = useData();
  const [selectedPrefix, setSelectedPrefix] = useState("");
  const [customPrefix, setCustomPrefix] = useState<string>(""); // เก็บค่าที่ผู้กรอกเอง

  const isOther = selectedPrefix === "อื่นๆ";

  // สถานะสำหรับกรอกชื่อใหม่ / นามสกุลใหม่
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");

  // เอกสารแนบ
  const [document, setDocument] = useState<{
    uri: string;
    b64: string;
    type: string;
  } | null>(null);
  // สถานะการโหลด
  const [isLoading, setIsLoading] = useState(false);
  // pending state
  const [isPending, setIsPending] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  // Refs สำหรับ TextInput
  const lastNameInputRef = useRef<TextInput>(null);

  // ฟังก์ชันกดปุ่ม Back → กลับหน้าเดิม
  const handleBack = () => {
    navigation.goBack();
  };

  useFocusEffect(
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useCallback(() => {
      const CheckStatus = () => {
        if (UserData.changeRequest.changeName?.status === "Review") {
          setIsPending(true);
        }
      };
      CheckStatus();
    }, [])
  );
  const NoteSection = React.memo(() => (
    <View style={styles.noteContainer}>
      <Text style={styles.noteTitle}>หมายเหตุ:</Text>
      <Text style={styles.noteText}>
        - เจ้าหน้าที่จะตรวจสอบข้อมูลและติดต่อกลับภายใน 3-5 วันทำการ
      </Text>
      <Text style={styles.noteText}>
        - โปรดตรวจสอบเอกสารให้ถูกต้องและชัดเจนก่อนยื่นคำขอ
      </Text>
      <Text style={styles.noteText}>
        - หากมีข้อสงสัยกรุณาติดต่อ Call Center: 02-xxx-xxxx
      </Text>
    </View>
  ));
  // ฟังก์ชันลบรูปเอกสาร
  const handleRemoveDocument = () => {
    setDocument(null);
  };
  const handleSubmit = async () => {
    if (!newFirstName.trim() && !newLastName.trim() && !selectedPrefix) {
      console.log("Check name");
      return Alert.alert(
        "ข้อมูลไม่ครบถ้วน",
        "กรุณากรอกชื่อใหม่หรือนามสกุลใหม่อย่างน้อย 1 อย่าง หรือเลือกคำนำหน้า"
      );
    }
    if (!document) {
      console.log("Check doc");
      return Alert.alert("แนบเอกสารก่อน");
    }
    // const uniqueId = uuidv4();
    // console.log("uniqueId", uniqueId);
    // const reqID = `REQ-${uniqueId}`;
    const reqID = "REQ-123456";
    const prefixToSave =
      selectedPrefix === "อื่นๆ" && customPrefix.trim()
        ? customPrefix.trim()
        : selectedPrefix.trim();
    console.log("✅ prefixToSave", prefixToSave);
    const data = {
      reqID: reqID,
      type: UserData.userType,
      personalIdCard: UserData.personalIdCard,
      birthDate: UserData.birthDate,
      titleName: prefixToSave,
      name: newFirstName,
      lastName: newLastName,
      base64Name: document,
    };
    // console.log("Data", data);
    try {
      setLoading(true);
      const res = await api("changeRequest/Name", data, "json", "POST");
      console.log("ChangeName res", res);
      if (res.status === "ok") {
        setLoading(false);
        setUserData(res.user);
        await SecureStore.setItemAsync("userData", JSON.stringify(res.user));
        setIsPending(true);
      } else {
        Alert.alert("Error", "ส่งไม่สำเร็จ");
        setLoading(false);
      }
    } catch {
      Alert.alert("Error", "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
      setLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const checkStatus = async () => {
    setStatusLoading(true);
    try {
      await AsyncStorage.removeItem("nameChangeRequested");
      navigation.goBack();
    } catch {
      Alert.alert("Error", "เช็คสถานะไม่สำเร็จ");
    } finally {
      setStatusLoading(false);
    }
  };
  const InputData = ({ title, value, setValue, placeholder }) => {
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{title}</Text>
        <TextInput
          style={[
            styles.textInput,
            isPending && styles.textInputDisabled, // optional: เปลี่ยนสไตล์ให้ดูไม่ active
          ]}
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          autoCapitalize="words"
          editable={!isPending}
          returnKeyType="next"
          onSubmitEditing={() => lastNameInputRef.current?.focus()}
        />
      </View>
    );
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
        <Text style={styles.headerTitle}>ขอเปลี่ยนชื่อ-นามสกุล</Text>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.formContainer}>
            <View style={styles.container}>
              <Text style={styles.label}>คำนำหน้า</Text>

              <Picker
                selectedValue={selectedPrefix}
                onValueChange={(value) => {
                  setSelectedPrefix(value);
                  if (value !== "อื่นๆ") setCustomPrefix(""); // ล้างค่าถ้าเปลี่ยนจาก “อื่นๆ” ไปเป็นอย่างอื่น
                }}
                style={styles.picker}
                dropdownIconColor={"#CFA459"}
              >
                <Picker.Item label="เลือกคำนำหน้า" value="" />
                <Picker.Item label="นาย" value="นาย" />
                <Picker.Item label="นาง" value="นาง" />
                <Picker.Item label="นางสาว" value="นางสาว" />
                <Picker.Item label="เด็กชาย" value="เด็กชาย" />
                <Picker.Item label="เด็กหญิง" value="เด็กหญิง" />
                <Picker.Item label="อื่นๆ" value="อื่นๆ" />
              </Picker>

              {isOther && (
                <TextInput
                  style={styles.textInput}
                  placeholder="กรอกคำนำหน้า"
                  value={customPrefix}
                  onChangeText={setCustomPrefix}
                  returnKeyType="done"
                />
              )}
            </View>
            <InputData
              title={"ชื่อใหม่"}
              placeholder={"กรอกชื่อใหม่"}
              value={newFirstName}
              setValue={setNewFirstName}
            />
            <InputData
              title={"นามสกุลใหม่"}
              placeholder={"กรอกนามสกุลใหม่"}
              value={newLastName}
              setValue={setNewLastName}
            />
          </View>

          {/* หมายเหตุใต้ช่องกรอก */}
          <View style={styles.inputGroupRow}>
            <Text style={styles.formNote}>
              หากต้องการเปลี่ยนเพียงส่วนใดส่วนหนึ่ง (ชื่อหรือนามสกุล)
              {"\n"}
              สามารถปล่อยอีกช่องว่างได้
            </Text>
            {/* {isPending && (
              <TouchableOpacity style={styles.btn} onPress={checkStatus}>
                <FontAwesome5 name="redo" size={20} color="#CFA459" />
              </TouchableOpacity>
            )} */}
          </View>

          {isPending ? (
            <View style={styles.center}>
              <Text style={styles.title}>คำขอของคุณกำลังรอการตรวจสอบ</Text>
              {statusLoading && <ActivityIndicator size="large" />}
            </View>
          ) : (
            <>
              {/* แนบเอกสาร */}
              <Text style={styles.sectionLabel}>แนบเอกสาร</Text>
              <View style={styles.documentContainer}>
                <Text style={styles.documentHint}>
                  แนบภาพถ่ายเอกสารการเปลี่ยนชื่อ-นามสกุลที่ออกโดยหน่วยงานราชการ
                </Text>

                {document ? (
                  <View style={styles.documentPreview}>
                    <Image
                      source={{ uri: document.uri }}
                      style={styles.documentImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.removeDocumentButton}
                      onPress={handleRemoveDocument}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={async () => {
                      const img = await pickImageRaw();
                      if (img) {
                        setDocument(img);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="cloud-upload-outline"
                      size={24}
                      color="#CFA459"
                    />
                    <Text style={styles.uploadButtonText}>อัพโหลดเอกสาร</Text>
                  </TouchableOpacity>
                )}
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
                  onPress={handleSubmit}
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
            </>
          )}
          <NoteSection />
          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NameChangeRequestScreen;

/** --- Styles --- */
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
  inputGroupRow: {
    marginBottom: 16,
    // backgroundColor: "pink",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    // marginBottom: 24,
    // lineHeight: 18,
    flex: 1,
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
    resizeMode: "contain",
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  btn: {
    // backgroundColor: "#CFA459",
    // borderRadius: 5,
  },

  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
    color: "#a2754c",
  },
  textInputDisabled: {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
  container: {
    marginVertical: 12,
    // paddingHorizontal: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    color: "#333",
  },
  picker: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    color: "#000",
    marginBottom: 12,
  },
});
