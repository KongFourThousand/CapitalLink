import React, { useState, useRef } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";

type NameChangeRequestScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "NameChange"
>;

type ChangeType = "firstname" | "lastname" | "both" | null;

const NameChangeRequestScreen: React.FC = () => {
  const navigation = useNavigation<NameChangeRequestScreenNavProp>();
  
  // สถานะสำหรับเลือกประเภทการเปลี่ยน
  const [changeType, setChangeType] = useState<ChangeType>(null);
  
  // ชื่อ-นามสกุลปัจจุบัน (สมมติว่าดึงมาจาก API หรือ state อื่น)
  const [currentFirstName, setCurrentFirstName] = useState("มินิน");
  const [currentLastName, setCurrentLastName] = useState("ทดสอบ");
  
  // ชื่อ-นามสกุลใหม่
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  
  // เอกสารแนบ
  const [document, setDocument] = useState<string | null>(null);
  
  // สถานะการโหลด
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs สำหรับ TextInput
  const lastNameInputRef = useRef<TextInput>(null);

  // ฟังก์ชันกดปุ่ม Back → กลับหน้าเดิม
  const handleBack = () => {
    navigation.goBack();
  };

  // ฟังก์ชันเลือกประเภทการเปลี่ยน
  const handleSelectChangeType = (type: ChangeType) => {
    setChangeType(type);
    
    // รีเซ็ตค่าตามประเภทที่เลือก
    if (type === "firstname" || type === "both") {
      setNewFirstName("");
    } else {
      setNewFirstName(currentFirstName);
    }
    
    if (type === "lastname" || type === "both") {
      setNewLastName("");
    } else {
      setNewLastName(currentLastName);
    }
  };

  // ฟังก์ชันเลือกรูปเอกสาร
  const handlePickDocument = async () => {
    try {
      // ขอสิทธิ์การเข้าถึง
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert("การอนุญาต", "จำเป็นต้องได้รับอนุญาตเพื่อเข้าถึงคลังรูปภาพ");
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

  // ฟังก์ชันลบรูปเอกสาร
  const handleRemoveDocument = () => {
    setDocument(null);
  };

  // ฟังก์ชันยื่นคำขอ
  const handleSubmitRequest = () => {
    // ตรวจสอบข้อมูล
    if (!changeType) {
      Alert.alert("ข้อมูลไม่ครบถ้วน", "กรุณาเลือกประเภทการเปลี่ยน");
      return;
    }
    
    if ((changeType === "firstname" || changeType === "both") && !newFirstName) {
      Alert.alert("ข้อมูลไม่ครบถ้วน", "กรุณากรอกชื่อใหม่");
      return;
    }
    
    if ((changeType === "lastname" || changeType === "both") && !newLastName) {
      Alert.alert("ข้อมูลไม่ครบถ้วน", "กรุณากรอกนามสกุลใหม่");
      return;
    }
    
    if (!document) {
      Alert.alert("ข้อมูลไม่ครบถ้วน", "กรุณาแนบเอกสารการเปลี่ยนชื่อ-นามสกุล");
      return;
    }
    
    // แสดงการโหลด
    setIsLoading(true);
    
    // สมมติว่าส่งข้อมูลไปยัง API
    setTimeout(() => {
      setIsLoading(false);
      
      // แสดงแจ้งเตือนส่งสำเร็จ
      Alert.alert(
        "ส่งคำขอสำเร็จ",
        "คำขอเปลี่ยนชื่อ-นามสกุลของคุณถูกส่งเรียบร้อยแล้ว เจ้าหน้าที่จะดำเนินการตรวจสอบและติดต่อกลับภายใน 3-5 วันทำการ",
        [
          {
            text: "ตกลง",
            onPress: () => navigation.navigate("Profile"),
          },
        ]
      );
    }, 2000);
  };

  // ฟังก์ชันช่วยในการแสดงชื่อที่กำลังขอเปลี่ยน
  const getNamePreview = () => {
    const firstName = changeType === "firstname" || changeType === "both" 
      ? newFirstName || "(รอกรอกชื่อใหม่)" 
      : currentFirstName;
      
    const lastName = changeType === "lastname" || changeType === "both" 
      ? newLastName || "(รอกรอกนามสกุลใหม่)" 
      : currentLastName;
    
    return `${firstName} ${lastName}`;
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
        <Text style={styles.headerTitle}>ขอเปลี่ยนชื่อ-นามสกุล</Text>

        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* ชื่อ-นามสกุลปัจจุบัน */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>ชื่อ-นามสกุลปัจจุบัน</Text>
            <Text style={styles.currentName}>{currentFirstName} {currentLastName}</Text>
          </View>

          {/* เลือกประเภทการเปลี่ยน */}
          <Text style={styles.sectionLabel}>เลือกประเภทการเปลี่ยน</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                changeType === "firstname" && styles.optionButtonActive
              ]}
              onPress={() => handleSelectChangeType("firstname")}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionText,
                changeType === "firstname" && styles.optionTextActive
              ]}>เปลี่ยนชื่อ</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                changeType === "lastname" && styles.optionButtonActive
              ]}
              onPress={() => handleSelectChangeType("lastname")}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionText,
                changeType === "lastname" && styles.optionTextActive
              ]}>เปลี่ยนนามสกุล</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                changeType === "both" && styles.optionButtonActive
              ]}
              onPress={() => handleSelectChangeType("both")}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionText,
                changeType === "both" && styles.optionTextActive
              ]}>เปลี่ยนทั้งคู่</Text>
            </TouchableOpacity>
          </View>

          {/* กรอกชื่อ-นามสกุลใหม่ */}
          {changeType && (
            <View style={styles.formContainer}>
              {/* กรอกชื่อใหม่ */}
              {(changeType === "firstname" || changeType === "both") && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>ชื่อใหม่</Text>
                  <TextInput 
                    style={styles.textInput}
                    value={newFirstName}
                    onChangeText={setNewFirstName}
                    placeholder="กรอกชื่อใหม่"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      if (changeType === "both") {
                        lastNameInputRef.current?.focus();
                      }
                    }}
                  />
                </View>
              )}
              
              {/* กรอกนามสกุลใหม่ */}
              {(changeType === "lastname" || changeType === "both") && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>นามสกุลใหม่</Text>
                  <TextInput 
                    ref={lastNameInputRef}
                    style={styles.textInput}
                    value={newLastName}
                    onChangeText={setNewLastName}
                    placeholder="กรอกนามสกุลใหม่"
                    autoCapitalize="words"
                  />
                </View>
              )}
              
              {/* แสดงตัวอย่างชื่อ-นามสกุลที่จะเปลี่ยน */}
              <View style={styles.previewContainer}>
                <Text style={styles.previewLabel}>
                  ตัวอย่างชื่อ-นามสกุลที่จะเปลี่ยน:
                </Text>
                <Text style={styles.previewName}>{getNamePreview()}</Text>
              </View>
            </View>
          )}

          {/* แนบเอกสาร */}
          <Text style={styles.sectionLabel}>แนบเอกสาร</Text>
          <View style={styles.documentContainer}>
            <Text style={styles.documentHint}>
              แนบภาพถ่ายเอกสารการเปลี่ยนชื่อ-นามสกุลที่ออกโดยหน่วยงานราชการ
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
                <Ionicons name="cloud-upload-outline" size={24} color="#CFA459" />
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

export default NameChangeRequestScreen;

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
  currentName: {
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
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  optionButtonActive: {
    backgroundColor: "#FFEFD5",
    borderWidth: 1,
    borderColor: "#CFA459",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  optionTextActive: {
    color: "#CFA459",
    fontWeight: "600",
  },
  formContainer: {
    marginBottom: 24,
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
  previewContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEE",
    borderStyle: "dashed",
  },
  previewLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  previewName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
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