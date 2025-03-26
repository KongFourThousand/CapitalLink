import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

type HomeScreenNavProp = NativeStackNavigationProp<RootStackParamList, "HomeScreen">;

const { width } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavProp>();

  // โหลดฟอนต์ TimesNewRoman ถ้าต้องการ
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman bold.ttf"),
  });
  
  if (!fontsLoaded) return null;

  // ตัวอย่าง URLs
  const externalLinks = [
    {
      id: "1",
      title: "กลุ่มธุรกิจทางการเงิน Capital Link Financial Group",
      image: require("../../../assets/banner1.png"),
      url: "https://www.capitallink.co.th/",
    },
    {
      id: "2",
      title: "ทรัพย์สินรอการขาย",
      image: require("../../../assets/banner2.png"),
      url: "https://www.capitallink.co.th/clamc",
    },
    {
      id: "3",
      title: "ข่าวสารต่าง ๆ",
      image: require("../../../assets/banner3.png"),
      url: "https://www.capitallink.co.th/clfg-2/clfg-news",
    },
    {
      id: "4",
      title: "เปิดบัญชีใหม่",
      image: require("../../../assets/banner4.png"),
      url: "https://www.capitallink.co.th/clc",
    },
  ];

  // ฟังก์ชันกดเปิดเว็บ
  const handleOpenLink = (linkUrl: string) => {
    // ใช้ Linking เพื่อเปิดเว็บภายนอก
    Linking.openURL(linkUrl);
  };

  // ฟังก์ชันไปยังหน้าแจ้งเตือน
  const handleNotifications = () => {
    // @ts-ignore - เนื่องจากเป็น Tab Navigator
    navigation.navigate("Notifications");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header พร้อมแจ้งเตือน */}
      <View style={styles.header}>
        <Image 
          source={require("../../../assets/CLlogo+NoBG.png")} 
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={handleNotifications} style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#CFA459" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* ส่วนบน: โปรไฟล์ผู้ใช้ */}
          <View style={styles.profileSection}>
            {/* Avatar (icon) */}
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            {/* ชื่อผู้ใช้งาน */}
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>สวัสดีตอนเย็น</Text>
              <Text style={styles.userName}>คุณมินอิน</Text>
            </View>
          </View>

          {/* ปุ่มสี่เหลี่ยม: เงินฝาก, สินเชื่อ */}
          <View style={styles.menuRow}>
            <TouchableOpacity
              style={styles.menuBox}
              onPress={() => {
                // ตัวอย่างใน-app navigation
                // navigation.navigate("DepositDashboard");
              }}
            >
              <Ionicons name="wallet-outline" size={28} color="#CFA459" style={styles.menuIcon} />
              <Text style={styles.menuBoxTitle}>เงินฝาก</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuBox}
              onPress={() => {
                // ตัวอย่าง in-app navigation
                // navigation.navigate("LoanDashboard");
              }}
            >
              <Ionicons name="cash-outline" size={28} color="#CFA459" style={styles.menuIcon} />
              <Text style={styles.menuBoxTitle}>สินเชื่อ</Text>
            </TouchableOpacity>
          </View>

          {/* หัวข้อบริการของเรา */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>บริการของเรา</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>ดูทั้งหมด</Text>
            </TouchableOpacity>
          </View>

          {/* แบนเนอร์ 4 อัน (กดแล้วไปเว็บนอก) */}
          <View style={styles.bannerContainer}>
            {externalLinks.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.bannerCard}
                activeOpacity={0.8}
                onPress={() => handleOpenLink(item.url)}
              >
                <Image
                  source={item.image}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
                <View style={styles.bannerOverlay}>
                  <Text style={styles.bannerTitle}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* เว้นระยะด้านล่าง */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerLogo: {
    width: 120,
    height: 40,
  },
  notificationButton: {
    position: "relative",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 6,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#CFA459",
  },
  avatarText: {
    fontSize: 30,
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: "#888",
    fontFamily: "TimesNewRoman",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 2,
    fontFamily: "TimesNewRoman",
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  menuBox: {
    flex: 1,
    backgroundColor: "#fff9ee",
    borderRadius: 15,
    marginHorizontal: 6,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#CFA459",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#FFF0D1",
  },
  menuIcon: {
    marginBottom: 8,
  },
  menuBoxTitle: {
    fontSize: 16,
    color: "#CFA459",
    fontWeight: "600",
    fontFamily: "TimesNewRoman",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "TimesNewRoman",
  },
  sectionLink: {
    fontSize: 14,
    color: "#CFA459",
    fontFamily: "TimesNewRoman",
  },
  bannerContainer: {
    marginBottom: 20,
  },
  bannerCard: {
    width: "100%",
    height: 130,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "TimesNewRoman",
  },
  bottomSpacer: {
    height: 80, // ให้มีพื้นที่ว่างด้านล่างเพื่อไม่ให้เนื้อหาถูกซ่อนโดย bottom tab
  },
});