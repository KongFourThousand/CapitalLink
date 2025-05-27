import type React from "react";
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
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import CustomTabBar from "../../components/common/CustomTabBar";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { externalLinks } from "../../Data/bannerLink";
import BannerAdmin from "../../components/Home/Banner/BannerAdmin";
import { useData } from "../../Provide/Auth/UserDataProvide";
const { width } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const { UserData, getDepositInfo, getLoanInfo } = useData();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();
  const GreetingText = () => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        return "สวัสดีตอนเช้า";
      }
      if (hour < 18) {
        return "สวัสดีตอนบ่าย";
      }
      return "สวัสดีตอนเย็น";
    };

    return <Text style={styles.welcomeText}>{getGreeting()}</Text>;
  };

  const Header = () => {
    return (
      <LinearGradient
        colors={["#E9D9B5", "#D4B976"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileSection}
      >
        <View style={styles.avatarContainer}>
          <FontAwesome5 name="user-circle" size={36} color="#000" />
        </View>
        <View style={styles.userInfo}>
          <GreetingText />
          <Text style={styles.userName}>
            {UserData.companyName
              ? UserData.companyName
              : UserData.name
              ? `${UserData.name}${
                  UserData.lastname ? ` ${UserData.lastname}` : ""
                }`
              : "ผู้ใช้งาน"}
          </Text>
        </View>
      </LinearGradient>
    );
  };
  const CapitalMenu = () => {
    // ฟังก์ชันเมื่อกดปุ่มเงินฝาก
    const handleDepositPress = async () => {
      await getDepositInfo();
      navigation.navigate("Deposit");
    };

    // ฟังก์ชันเมื่อกดปุ่มสินเชื่อ
    const handleLoanPress = async () => {
      await getLoanInfo();
      navigation.navigate("Loan");
    };
    return (
      <View style={styles.menuRow}>
        <TouchableOpacity style={styles.menuBox} onPress={handleDepositPress}>
          <Ionicons
            name="wallet-outline"
            size={28}
            color="#CFA459"
            style={styles.menuIcon}
          />
          <Text style={styles.menuBoxTitle}>เงินฝาก</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuBox} onPress={handleLoanPress}>
          <Ionicons
            name="card-outline"
            size={28}
            color="#4F7FE3"
            style={styles.menuIcon}
          />
          <Text style={styles.menuBoxTitle}>สินเชื่อ</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const BannerLink = () => {
    // ตัวอย่าง URLs
    // ฟังก์ชันกดเปิดเว็บ
    const handleOpenLink = (linkUrl: string) => {
      // ใช้ Linking เพื่อเปิดเว็บภายนอก
      Linking.openURL(linkUrl);
    };
    return (
      <View style={styles.bannerContainer}>
        {externalLinks.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.bannerCard}
            activeOpacity={0.9}
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
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* ส่วนบน: โปรไฟล์ผู้ใช้ ไล่สีทอง */}
        <Header />
        <View style={styles.container}>
          {/* เพิ่มปุ่มสี่เหลี่ยม: เงินฝาก, สินเชื่อ ตรงนี้ */}
          <CapitalMenu />
          {/* แบนเนอร์ 4 อัน (กดแล้วไปเว็บนอก) */}
          <BannerAdmin />
          <BannerLink />
          {/* เว้นระยะด้านล่าง */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* ใช้ CustomTabBar ที่แยกออกมา */}
      <CustomTabBar activeTab="home" />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  // styles อื่นๆ เหมือนเดิม
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingVertical: 20,
    marginBottom: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  avatarContainer: {
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: "#000",
    opacity: 0.7,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  menuBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginHorizontal: 5,
    padding: 16,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  menuIcon: {
    marginBottom: 10,
  },
  menuBoxTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  bannerContainer: {
    marginBottom: 20,
  },
  bannerCard: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
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
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 70, // ให้มีพื้นที่ว่างด้านล่างเพื่อไม่ให้เนื้อหาถูกซ่อนโดย bottom tab
  },
});
