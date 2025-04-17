import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface PinErrorModalProps {
  visible: boolean;
  onDismiss: () => void;
  message?: string;
}

const PinErrorModal: React.FC<PinErrorModalProps> = ({
  visible,
  onDismiss,
  message,
}) => {
  // แบบที่ 2: ใช้ Text เดียวแต่ force ให้ขึ้นบรรทัดใหม่ด้วย attribute ของ Text
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="alert-circle" size={50} color="#a2754c" />
              </View>

              <Text style={styles.modalTitle}>ขออภัย</Text>

              {/* แบบที่ 2: ใช้ property ของ Text component */}
              {/* <Text 
                style={styles.modalMessage}
                allowFontScaling={false}
                numberOfLines={2} // กำหนดจำนวนบรรทัดสูงสุด
              >
                {'PIN รหัสผ่านไม่ถูกต้อง\nกรุณาลองใหม่อีกครั้ง'}
              </Text> */}
              
              <Text style={styles.modalMessage}
                allowFontScaling={false}
                numberOfLines={2} // กำหนดจำนวนบรรทัดสูงสุด
                >
                {message || "PIN รหัสผ่านไม่ถูกต้อง\nกรุณาลองใหม่อีกครั้ง"}
              </Text>

              <LinearGradient
                colors={["#c49a45", "#d4af71", "#e0c080"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmGradient}
              >
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={onDismiss}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>ตกลง</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PinErrorModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.79)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#a2754c",
    marginBottom: 10,
    fontFamily: "TimesNewRoman",
  },
  modalMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "TimesNewRoman",
    lineHeight: 24,
    // เพิ่ม property สำหรับการจัดการข้อความในบาง platform
    ...Platform.select({
      ios: {
        letterSpacing: 0.5,
      },
      android: {
        includeFontPadding: false,
      },
    }),
  },
  confirmGradient: {
    width: "100%",
    borderRadius: 12,
  },
  confirmButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
});
