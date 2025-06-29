import type React from "react";
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
import { v4 as uuidv4 } from "uuid";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import type { RootStackParamList } from "../../../navigation/RootNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useData } from "../../../Provide/Auth/UserDataProvide";
import { Checkbox } from "react-native-paper";
import type { DataUserType } from "../../../Data/UserDataStorage";
import { api } from "../../../../API/route";
import { pickImageRaw } from "../../../Data/picker";

type NameChangeRequestScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "AddressChange"
>;

const AddressChangeRequest: React.FC = () => {
  const navigation = useNavigation<NameChangeRequestScreenNavProp>();
  const { UserData, setUserData, setLoading } = useData();
  const [addressType, setAddressType] = useState<
    "idCardAddress" | "mailingAddress"
  >("idCardAddress");
  // สถานะสำหรับกรอกชื่อใหม่ / นามสกุลใหม่
  const [newAddress, setNewAddress] = useState("");

  // เอกสารแนบ
  const [document, setDocument] = useState<{
    uri: string;
    b64: string;
    type: string;
  } | null>(null);

  // สถานะการโหลด
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  // Refs สำหรับ TextInput

  // ฟังก์ชันกดปุ่ม Back → กลับหน้าเดิม
  const handleBack = () => {
    navigation.goBack();
  };
  useFocusEffect(
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useCallback(() => {
      if (!UserData) return;

      const statusIDCard = UserData.changeRequest?.changeAddressMailing?.status;
      const statusMailing = UserData.changeRequest?.changeAddressIDCard?.status;

      if (statusIDCard === "Review" || statusMailing === "Review") {
        setIsPending(true);
      } else {
        setIsPending(false);
      }
    }, [])
  );
  // ฟังก์ชันลบรูปเอกสาร
  const handleRemoveDocument = () => {
    setDocument(null);
  };
  const handleSubmit = async () => {
    if (!newAddress.trim()) {
      Alert.alert("ข้อมูลไม่ครบถ้วน", "กรุณากรอกที่อยู่");
      return;
    }
    if (!document) {
      return Alert.alert("แนบเอกสารก่อน");
    }

    const data = {
      reqID: "1",
      type: UserData.userType,
      personalIdCard: UserData.personalIdCard,
      birthDate: UserData.birthDate,
      idCardAddress: addressType === "idCardAddress" ? newAddress.trim() : "",
      mailingAddress: addressType === "mailingAddress" ? newAddress.trim() : "",
      base64Address: document,
    };
    try {
      setLoading(true);
      const res = await api("changeRequest/Address", data, "json", "POST");
      console.log("ChangeAddress res", res);
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
      await AsyncStorage.removeItem("AddressChangeRequested");
      navigation.goBack();
    } catch {
      Alert.alert("Error", "เช็คสถานะไม่สำเร็จ");
    } finally {
      setStatusLoading(false);
    }
  };
  const ChooseAddress = () => {
    return (
      <View style={{ marginBottom: 16 }}>
        {/* <Text style={styles.inputLabel}>ประเภทที่อยู่</Text> */}
        <TouchableOpacity
          onPress={() => setAddressType("idCardAddress")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
          disabled={isPending}
        >
          <Ionicons
            name={
              addressType === "idCardAddress" ? "checkbox" : "square-outline"
            }
            size={20}
            color="#CFA459"
          />
          <Text style={styles.Checkbox}>ที่อยู่ตามบัตรประชาชน</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setAddressType("mailingAddress")}
          style={{ flexDirection: "row", alignItems: "center" }}
          disabled={isPending}
        >
          <Ionicons
            name={
              addressType === "mailingAddress" ? "checkbox" : "square-outline"
            }
            size={20}
            color="#CFA459"
          />
          <Text style={styles.Checkbox}>ที่อยู่สำหรับส่งเอกสาร</Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>ขอเปลี่ยนที่อยู่</Text>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.formContainer}>
            {/* กรอกชื่อใหม่ */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ที่อยู่ใหม่</Text>
              <TextInput
                style={[
                  styles.textInput,
                  isPending && styles.textInputDisabled, // optional: เปลี่ยนสไตล์ให้ดูไม่ active
                ]}
                editable={!isPending}
                value={newAddress}
                onChangeText={setNewAddress}
                placeholder="กรอกที่อยู่ใหม่"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
            <ChooseAddress />
          </View>
          {isPending ? (
            <View style={styles.center}>
              <Text style={styles.title}>คำขอของคุณกำลังรอการตรวจสอบ</Text>
              {statusLoading && <ActivityIndicator size="large" />}
            </View>
          ) : (
            <>
              <Text style={styles.sectionLabel}>แนบเอกสาร</Text>
              <View style={styles.documentContainer}>
                <Text style={styles.documentHint}>
                  แนบภาพถ่ายเอกสารการเปลี่ยนที่อยู่
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
          {/* คำอธิบายเพิ่มเติม */}
          <View style={styles.noteContainer}>
            {/* {isPending && (
              <TouchableOpacity style={styles.btn} onPress={checkStatus}>
                <FontAwesome5 name="redo" size={20} color="#CFA459" />
              </TouchableOpacity>
            )} */}
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

          {/* Spacer สำหรับ ScrollView */}
          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddressChangeRequest;

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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  btn: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  textInputDisabled: {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
    color: "#a2754c",
  },
  Checkbox: {
    marginLeft: 8,
    color: "#C79B55",
  },
});
