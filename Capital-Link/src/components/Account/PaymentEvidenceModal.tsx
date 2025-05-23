import type React from "react";
import { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
const { width, height } = Dimensions.get("window");
const modalWidth = Math.min(width * 0.9, 400); // ไม่เกิน 400
const imageSize = modalWidth * 0.75;
interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (imageUri: string | null) => void;
}

const PaymentEvidenceModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  const handleSubmit = () => {
    if (!imageUri) {
      return alert("กรุณาอัปโหลดสลิปการชำระเงิน");
    }
    onSubmit(imageUri);
    setImageUri(null);
  };
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1 }}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => null}>
              <View style={styles.container}>
                <TouchableOpacity
                  onPress={pickImage}
                  style={[
                    styles.uploadBox,
                    imageUri && { borderColor: "#CFA459" },
                  ]}
                >
                  {imageUri ? (
                    <View style={styles.imageWrapper}>
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.imagePreview}
                      />
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => setImageUri(null)}
                      >
                        <Text style={styles.removeButtonText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <Ionicons
                        name="cloud-upload-outline"
                        size={30}
                        color="#CFA459"
                      />
                      <Text style={styles.uploadText}>
                        กรุณาอัปโหลดสลิปการชำระเงิน
                      </Text>
                      <Text style={styles.uploadText}>
                        (เฉพาะไฟล์ .jpg, .jpeg, .png)
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => {
                      handleSubmit();
                    }}
                    style={[styles.button, { backgroundColor: "#CFA459" }]}
                  >
                    <Text style={styles.buttonText}>
                      ยืนยันการส่งหลักฐานการชำระ
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PaymentEvidenceModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: modalWidth,
    height: modalWidth,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    // borderWidth: 2, // ทดสอบ
    // borderColor: "red", // ทดสอบ
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: "#C79B55",
    borderRadius: 10,
    padding: 16,
    justifyContent: "center",
    borderStyle: "dashed", // <-- เพิ่มบรรทัดนี้
    alignItems: "center",
    width: imageSize,
    height: imageSize,
  },
  uploadText: {
    fontSize: 13,
    color: "#666",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 60,
    // paddingVertical: 10,
    // paddingHorizontal: 24,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  imageWrapper: {
    position: "relative",
    width: imageSize,
    height: imageSize,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#CFA459",
    borderRadius: 14,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
