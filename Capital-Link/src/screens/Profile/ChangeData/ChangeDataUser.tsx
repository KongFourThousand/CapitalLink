import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import { RootStackParamList } from "../../../navigation/RootNavigator";
import LogoutConfirmationModal from "../../../components/LogoutConfirmationModa";
const { width } = Dimensions.get("window");

type ProfileScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

const ChangeDataUser: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavProp>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // ฟังก์ชันกดปุ่ม Back → กลับหน้าเดิม
  const handleBack = () => {
    navigation.goBack();
  };

  // ฟังก์ชันสำหรับเมนูตั้งค่าต่าง ๆ
  const handleChangePin = () => {
    navigation.navigate("OldPin");
  };
  const handleRequestNameChange = () => {
    navigation.navigate("NameChange");
  };
  const handleRequestPhoneChange = () => {
    navigation.navigate("PhoneChange");
  };
  const handleRequestEmailChange = () => {
    navigation.navigate("EmailChange");
  };
  const handleRequestAddressChange = () => {
    navigation.navigate("AddressChange");
  };
  // เมื่อกดออกจากระบบ ให้เปิด modal
  const handleLogoutPress = () => {
    setModalVisible(true);
  };

  // เมื่อยืนยันออกจากระบบ
  const confirmLogout = async () => {
    setModalVisible(false);
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("userPin");
    navigation.replace("InitialEntry");
    // navigation.navigate("PinEntry");
  };

  // เมื่อยกเลิกออกจากระบบ
  const cancelLogout = () => {
    setModalVisible(false);
  };
  const SettingRow = ({ handle, header, detail, iconName }) => {
    return (
      <TouchableOpacity style={styles.menuItem} onPress={handle}>
        <View style={styles.menuIconContainer}>
          <Ionicons name={iconName} size={22} color="#CFA459" />
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuText}>{header}</Text>
          <Text style={styles.menuDescription}>{detail}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#CFA459" />
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ปุ่ม Back */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="chevron-back" size={26} color="#CFA459" />
      </TouchableOpacity>

      {/* Header Title */}
      <Text style={styles.headerTitle}>บัญชีผู้ใช้</Text>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* ข้อมูลส่วนตัว */}
        {/* <LinearGradient
          colors={["#E9D9B5", "#D4B976"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileHeader}
        >
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>ผู้ใช้งาน</Text>
            <Text style={styles.profilePhone}>XXX-XXX-XXXX</Text>
          </View>
        </LinearGradient> */}

        {/* เมนูตั้งค่า */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>การเปลี่ยนแปลงข้อมูล</Text>
        </View>

        <View style={styles.menuCard}>
          {/* แก้ไข E-mail */}
          <SettingRow
            handle={handleRequestEmailChange}
            header={"แก้ไขอีเมลล์"}
            detail={"ยื่นคำขอแก้ไขอีเมลล์ของผู้ใช้งาน"}
            iconName={"key-outline"}
          />
          {/* ขอเปลี่ยนชื่อ-นามสกุล */}
          <SettingRow
            handle={handleRequestNameChange}
            header={"ขอเปลี่ยนชื่อหรือนามสกุล"}
            detail={"ยื่นคำขอเปลี่ยนแปลงข้อมูลต่างๆ"}
            iconName={"person-outline"}
          />
          {/* ขอเปลี่ยนเบอร์โทรศัพท์ */}
          <SettingRow
            handle={handleRequestPhoneChange}
            header={"ขอเปลี่ยนเบอร์โทรศัพท์"}
            detail={"แก้ไขเบอร์โทรศัพท์ที่ใช้ในการติดต่อ"}
            iconName={"call-outline"}
          />
          {/* ตั้งค่าการแจ้งเตือน */}
          <SettingRow
            handle={handleRequestAddressChange}
            header={"แก้ไขที่อยู่"}
            detail={"แก้ไขที่อยู่ของผู้ใช้งาน"}
            iconName={"notifications-outline"}
          />
        </View>

        {/* ปุ่มออกจากระบบ ด้วย Gradient */}
        {/* <LinearGradient
          colors={["#c49a45", "#d4af71", "#e0c080"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.logoutGradient}
        >
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogoutPress}
            activeOpacity={0.8}
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              color="#FFF"
              style={styles.logoutIcon}
            />
            <Text style={styles.logoutText}>ออกจากระบบ</Text>
          </TouchableOpacity>
        </LinearGradient> */}

        {/* Spacer */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        visible={modalVisible}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </SafeAreaView>
  );
};

export default ChangeDataUser;

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
    paddingBottom: 80,
  },
  /* Profile Header with Gradient */
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 14,
    color: "#000",
    opacity: 0.7,
  },
  /* Section Header */
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  /* Menu Card */
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 5,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF9EF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    color: "#888",
  },
  /* Logout Button */
  logoutGradient: {
    borderRadius: 12,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
