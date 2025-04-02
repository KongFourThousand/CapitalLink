import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import CustomTabBar from "../../components/common/CustomTabBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";

const { width } = Dimensions.get("window");

const LoanScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();

  // ปุ่ม Back → กลับหน้า "บัญชี" (หรือหน้าเดิม)
  const handleBack = () => {
    navigation.navigate("Account");
  };

  // ตัวอย่างปุ่ม "ชำระเงิน"
  const handlePay = () => { 
    // ใส่ logic การชำระเงินตามที่ต้องการ
    console.log("ชำระเงิน");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ปุ่ม Back */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="chevron-back" size={26} color="#CFA459" />
      </TouchableOpacity>

      {/* หัวข้อหน้าจอ */}
      <Text style={styles.headerTitle}>สินเชื่อ</Text>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* ====== Card 1: ข้อมูลบัญชีสินเชื่อ ====== */}
        <View style={styles.infoCard}>
          <View style={styles.sideBar} />
          <View style={styles.cardContent}>
            {/* แถวบน: ข้อมูลบัญชี vs ยอดเงิน */}
            <View style={styles.headerRow}>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>บัญชีสินเชื่อ</Text>
                <Text style={styles.accountNumber}>580-4-xxx571</Text>
                <Text style={styles.accountOwner}>นาย ก</Text>
              </View>
              <View style={styles.balanceContainer}>
                <Text style={styles.accountBalance}>1,000,000.00</Text>
                <Text style={styles.currency}>THB</Text>
              </View>
            </View>

            {/* เส้นแบ่ง */}
            <View style={styles.divider} />

            {/* รายละเอียดอื่น ๆ */}
            <View style={styles.detailRow}>
              <Text style={styles.label}>อัตราดอกเบี้ย:</Text>
              <Text style={styles.value}>8.25%</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>วันโอนค่าทำสัญญา:</Text>
              <Text style={styles.value}>30/01/2025</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>ยอดคงเหลือ:</Text>
              <Text style={styles.value}>15,600 บาท</Text>
            </View>
          </View>
        </View>

        {/* ====== Card 2: สถานะการชำระ ====== */}
        <View style={styles.statusCard}>
          <View style={styles.cardContent}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>สถานะการชำระ:</Text>
              <Text style={[styles.value, { color: "#4CAF50" }]}>ปกติ</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>คงเหลือค่าชำระ:</Text>
              <Text style={styles.value}>0.00 บาท</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>จำนวนวันคงเหลือ:</Text>
              <Text style={styles.value}>15 วัน</Text>
            </View>

            {/* ปุ่ม "ชำระเงิน" */}
            <LinearGradient
              colors={["#c49a45", "#d4af71", "#e0c080"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.payButton}
            >
              <TouchableOpacity
                style={styles.payButtonContainer}
                onPress={handlePay}
                activeOpacity={0.9}
              >
                <Text style={styles.payButtonText}>ชำระเงิน</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* ====== Card 3: ตารางกำหนดการ / ประวัติการผ่อนชำระ ====== */}
        <View style={styles.scheduleCard}>
          <View style={styles.cardContent}>
            <Text style={styles.scheduleTitle}>ประวัติการผ่อนชำระ</Text>

            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>28/02/2025</Text>
              <Text style={styles.dateValue}>15,500 บาท</Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>16/03/2025</Text>
              <Text style={styles.dateValue}>16,500 บาท</Text>
            </View>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>17/04/2025</Text>
              <Text style={styles.dateValue}>16,500 บาท</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* แท็บบาร์ (ถ้ามีการใช้งาน) */}
      <CustomTabBar activeTab="account" />
    </SafeAreaView>
  );
};

export default LoanScreen;

/** ========== Styles ========== */
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
    color: "#a2754c",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  /* =========== Card พื้นฐาน =========== */
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 15,
    flexDirection: "row",
    // shadow (iOS + Android)
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  scheduleCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  sideBar: {
    width: 5,
    backgroundColor: "#CFA459",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },

  /* =========== Card ส่วนบน: ข้อมูลบัญชี =========== */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  accountInfo: {
    alignItems: "flex-start",
  },
  accountName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  accountNumber: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    marginBottom: 2,
  },
  accountOwner: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  balanceContainer: {
    alignItems: "flex-end",
  },
  accountBalance: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  currency: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#666",
    marginBottom: 15,
  },

  /* =========== รายละเอียดดอกเบี้ย ฯลฯ =========== */
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },

  /* =========== Card ส่วนกลาง: สถานะการชำระ + ปุ่ม =========== */
  payButton: {
    borderRadius: 30,
    marginTop: 10,
  },
  payButtonContainer: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  /* =========== Card ส่วนล่าง: ประวัติ/กำหนดการผ่อนชำระ =========== */
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#000",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dateLabel: {
    fontSize: 14,
    color: "#666",
  },
  dateValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
});
