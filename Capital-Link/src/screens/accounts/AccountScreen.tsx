import React from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { LinearGradient } from "expo-linear-gradient";
import CustomTabBar from "../../components/common/CustomTabBar";

// ชื่อ Route สมมติว่าคุณใส่ใน MainTabNavigator ว่า "AccountsTab"
type AccountNavProp = NativeStackNavigationProp<RootStackParamList, "Account">;

const { width } = Dimensions.get("window");

const AccountScreen: React.FC = () => {
  const navigation = useNavigation<AccountNavProp>();


  // กดดูรายละเอียด "เงินฝาก"
  const handlePressDeposit = () => {
    // navigation.navigate("DepositDashboard") เป็นต้น
    console.log("Navigate to Deposit Details");
  };

  // กดดูรายละเอียด "สินเชื่อ"
  const handlePressLoan = () => {
    // navigation.navigate("LoanDashboard") เป็นต้น
    console.log("Navigate to Loan Details");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header ไล่สีทอง */}
      {/* <LinearGradient
        colors={["#E9D9B5", "#D4B976"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      > */}
        <Text style={styles.headerTitle}>บัญชี</Text>
      {/* </LinearGradient> */}

      {/* เนื้อหาเลื่อนสกอล */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          {/* Card: เงินฝาก */}
          <TouchableOpacity style={styles.accountCard} onPress={handlePressDeposit}>
            <Image
              source={require("../../../assets/account.png")}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <Text style={styles.cardTitle}>เงินฝาก</Text>
              <Text style={styles.cardSubtitle}>ดูรายละเอียดเงินฝาก</Text>
            </View>
          </TouchableOpacity>

          {/* Card: สินเชื่อ */}
          <TouchableOpacity style={styles.accountCard} onPress={handlePressLoan}>
            <Image
              source={require("../../../assets/Credit.png")}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <Text style={styles.cardTitle}>สินเชื่อ</Text>
              <Text style={styles.cardSubtitle}>ดูรายละเอียดสินเชื่อ</Text>
            </View>
          </TouchableOpacity>

          {/* เว้นระยะด้านล่าง (กัน Tab Bar บัง) */}
          <View style={{ height: 50 }} />
        </View>
      </ScrollView>
      <CustomTabBar activeTab="account" />
    </SafeAreaView>
  );
};

export default AccountScreen;

/** --- Styles --- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#a2754c",
    textAlign: "center", 
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  accountCard: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 30,
    backgroundColor: "#FFF",
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  cardTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#fff",
  },
});
