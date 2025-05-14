import React, { useState, useRef, useCallback } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { RootStackParamList } from "../../../navigation/RootNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NameChangeRequestScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "AddressChange"
>;

const AddressChangeRequest: React.FC = () => {
  const navigation = useNavigation<NameChangeRequestScreenNavProp>();

  // สถานะสำหรับกรอกชื่อใหม่ / นามสกุลใหม่
  const [newAddress, setNewAddress] = useState("");

  // เอกสารแนบ
  const [document, setDocument] = useState<string | null>(null);

  // สถานะการโหลด
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  // Refs สำหรับ TextInput

  // ฟังก์ชันกดปุ่ม Back → กลับหน้าเดิม
  const handleBack = () => {
    navigation.goBack();
  };
  const submitUrl = "https://api.example.com/profile/name-change";
  const statusUrl = "https://api.example.com/profile/name-change/status";
  // ฟังก์ชันเลือกรูปเอกสาร
  const handlePickDocument = async () => {
    try {
      // ขอสิทธิ์การเข้าถึง
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "การอนุญาต",
          "จำเป็นต้องได้รับอนุญาตเพื่อเข้าถึงคลังรูปภาพ"
        );
        return;
      }

      // เปิดคลังรูปภาพ
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setDocument(result.assets[0].uri);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเลือกเอกสาร:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเลือกเอกสารได้");
    }
  };
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("AddressChangeRequested").then((val) =>
        setIsPending(val === "true")
      );
    }, [])
  );
  // ฟังก์ชันลบรูปเอกสาร
  const handleRemoveDocument = () => {
    setDocument(null);
  };

  // ฟังก์ชันยื่นคำขอ
  const handleSubmitRequest = () => {
    // ถ้าทั้งชื่อใหม่และนามสกุลใหม่ว่าง
    if (!newAddress.trim()) {
      Alert.alert("ข้อมูลไม่ครบถ้วน", "กรุณากรอกที่อยู่");
      return;
    }

    // ถ้าไม่ได้แนบเอกสาร
    if (!document) {
      Alert.alert("ข้อมูลไม่ครบถ้วน", "กรุณาแนบเอกสารการเปลี่ยนที่อยู่");
      return;
    }

    setIsLoading(true);

    // สมมติว่าส่งข้อมูลไปยัง API
    setTimeout(async () => {
      setIsLoading(false);
      setNewAddress("");
      setDocument(null);
      // Alert.alert(
      //   "ส่งคำขอสำเร็จ",
      //   "คำขอเปลี่ยนที่อยู่ของคุณถูกส่งเรียบร้อยแล้ว เจ้าหน้าที่จะดำเนินการตรวจสอบและติดต่อกลับภายใน 3-5 วันทำการ",
      //   [
      //     {
      //       text: "ตกลง",
      //       onPress: () => navigation.goBack(),
      //     },
      //   ]
      // );
      await AsyncStorage.setItem("AddressChangeRequested", "true");
      setIsPending(true);
    }, 2000);
  };
  const checkStatus = async () => {
    setStatusLoading(true);
    try {
      // const res = await fetch(statusUrl);
      // const { status } = await res.json(); // pending/approved/rejected
      // if (status === "approved") {
      //   await AsyncStorage.removeItem("nameChangeRequested");
      //   Alert.alert("อนุมัติแล้ว", "ไปกรอกใหม่ได้เลย");
      //   setIsPending(false);
      // } else if (status === "rejected") {
      //   await AsyncStorage.removeItem("nameChangeRequested");
      //   Alert.alert("ถูกปฏิเสธ", "กรุณาส่งคำขอใหม่");
      //   setIsPending(false);
      // }
      await AsyncStorage.removeItem("AddressChangeRequested");
      navigation.goBack();
    } catch {
      Alert.alert("Error", "เช็คสถานะไม่สำเร็จ");
    } finally {
      setStatusLoading(false);
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
        <Text style={styles.headerTitle}>ขอเปลี่ยนที่อยู่</Text>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.formContainer}>
            {/* กรอกชื่อใหม่ */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ที่อยู่ใหม่</Text>
              <TextInput
                style={styles.textInput}
                value={newAddress}
                onChangeText={setNewAddress}
                placeholder="กรอกที่อยู่ใหม่"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          </View>
          {isPending ? (
            <View style={styles.center}>
              <Text style={styles.title}>คำขอของคุณกำลังรอการตรวจสอบ</Text>
              {statusLoading ? (
                <ActivityIndicator size="large" />
              ) : (
                <TouchableOpacity style={styles.btn} onPress={checkStatus}>
                  <Text style={styles.btnText}>ตรวจสอบสถานะอีกครั้ง</Text>
                </TouchableOpacity>
              )}
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
                      source={{ uri: document }}
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
                    onPress={handlePickDocument}
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
            </>
          )}
          {/* คำอธิบายเพิ่มเติม */}
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
    backgroundColor: "#CFA459",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  title: { fontSize: 18, textAlign: "center", marginBottom: 24 },
});
