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

const DepositScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();

  // กดปุ่ม Back → กลับหน้า "บัญชี" (หรือ goBack())
  const handleBack = () => {
    // ถ้าต้องการไปหน้าบัญชีโดยเฉพาะ: navigation.navigate("Account");
    // หรือถ้าจะกลับหน้าเดิม:
    // navigation.goBack();
    navigation.navigate("Account");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Back Button ที่ตำแหน่งเดียวกับใน PinSetupScreen */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="chevron-back" size={26} color="#CFA459" />
      </TouchableOpacity>

      {/* Header Title */}
      <Text style={styles.headerTitle}>เงินฝาก</Text>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* กล่องข้อมูลบัญชี ส่วนแรก */}
        <View style={styles.infoCard}>
          {/* แถบสีทองด้านข้างซ้าย */}
          <View style={styles.sideBar}></View>

          <View style={styles.cardContent}>
            <View style={styles.headerRow}>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>บัญชีสะสมทรัพย์</Text>
                <Text style={styles.accountNumber}>580-4-xxx571</Text>
                <Text style={styles.accountOwner}>นาย ก</Text>
              </View>
              <View style={styles.balanceContainer}>
                <Text style={styles.accountBalance}>1,000,000.00</Text>
                <Text style={styles.currency}>THB</Text>
              </View>
            </View>

            <View style={styles.divider}></View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>อัตราดอกเบี้ย:</Text>
              <Text style={styles.value}>3.25%</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>ระยะเวลาฝาก:</Text>
              <Text style={styles.value}>1 ปี</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>ดอกเบี้ย ณ วันสิ้นสุดสัญญา:</Text>
              <Text style={styles.value}>32,500 บาท</Text>
            </View>
          </View>
        </View>

        {/* กล่องข้อมูลวันที่ ส่วนที่สอง */}
        <View style={styles.dateCard}>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>วันที่ฝาก:</Text>
            <Text style={styles.dateValue}>21/03/2024</Text>
          </View>

          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>วันสิ้นสุดสัญญา:</Text>
            <Text style={styles.dateValue}>21/03/2025</Text>
          </View>

          {/* ปุ่มกดดูรายละเอียดเพิ่มเติม */}
          <LinearGradient
            colors={["#c49a45", "#d4af71", "#e0c080"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.moreButton}
          >
            <TouchableOpacity
              style={styles.moreButtonContainer}
              activeOpacity={0.9}
            >
              <Text style={styles.moreButtonText}>
                กดเพื่อดูรายละเอียดเพิ่มเติม
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
      <CustomTabBar activeTab="account" />
    </SafeAreaView>
  );
};

export default DepositScreen;

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
    paddingBottom: 100, // เพิ่มส่วนนี้เพื่อให้เนื้อหาไม่ถูกซ่อนโดย tabBar
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 15,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  sideBar: {
    width: 5,
    //height:50,
    backgroundColor: "#CFA459",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
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
  divider: {
    height: 1,
    backgroundColor: "#666",
    marginBottom: 15,
  },
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
  dateCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
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
  moreButton: {
    borderRadius: 30,
    marginTop: 10,
  },
  moreButtonContainer: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  moreButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  tabBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    color: "#888",
  },
  activeTab: {
    color: "#CFA459",
    fontWeight: "600",
  },
});
