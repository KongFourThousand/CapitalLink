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
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

// ไม่ต้องใช้ NativeStackNavigationProp เพื่อลดความซับซ้อน
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../../navigation/RootNavigator";

// นำเข้า CustomTabBar
import CustomTabBar from "../../components/common/CustomTabBar";

const { width } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  // โหลดฟอนต์ TimesNewRoman
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman bold.ttf"),
  });
  
  if (!fontsLoaded) return null;

  // ตัวอย่าง URLs
  const externalLinks = [
    {
      id: "1",
      title: "กลุ่มธุรกิจทางการเงิน แคปปิตอล ลิงค์ Capital Link Financial Group",
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* ส่วนบน: โปรไฟล์ผู้ใช้ ไล่สีทอง */}
        <LinearGradient
          colors={['#E9D9B5', '#D4B976']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileSection}
        >
          <View style={styles.avatarContainer}>
            <FontAwesome5 name="user-circle" size={36} color="#000" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>สวัสดีตอนเย็น</Text>
            <Text style={styles.userName}>MININ</Text>
          </View>
        </LinearGradient>

        <View style={styles.container}>
          {/* แบนเนอร์ 4 อัน (กดแล้วไปเว็บนอก) */}
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

// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Dimensions,
//   Linking,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../../navigation/RootNavigator";
// import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
// import { useFonts } from "expo-font";
// import { LinearGradient } from "expo-linear-gradient";

// type HomeScreenNavProp = NativeStackNavigationProp<RootStackParamList, "HomeScreen">;

// const { width } = Dimensions.get("window");

// const HomeScreen: React.FC = () => {
//   const navigation = useNavigation<HomeScreenNavProp>();

//   // โหลดฟอนต์ TimesNewRoman ถ้าต้องการ
//   const [fontsLoaded] = useFonts({
//     TimesNewRoman: require("../../../assets/fonts/times new roman bold.ttf"),
//   });
  
//   if (!fontsLoaded) return null;

//   // ตัวอย่าง URLs
//   const externalLinks = [
//     {
//       id: "1",
//       title: "กลุ่มธุรกิจทางการเงิน แคปปิตอล ลิงค์ Capital Link Financial Group",
//       image: require("../../../assets/banner1.png"),
//       url: "https://www.capitallink.co.th/",
//     },
//     {
//       id: "2",
//       title: "ทรัพย์สินรอการขาย",
//       image: require("../../../assets/banner2.png"),
//       url: "https://www.capitallink.co.th/clamc",
//     },
//     {
//       id: "3",
//       title: "ข่าวสารต่าง ๆ",
//       image: require("../../../assets/banner3.png"),
//       url: "https://www.capitallink.co.th/clfg-2/clfg-news",
//     },
//     {
//       id: "4",
//       title: "เปิดบัญชีใหม่",
//       image: require("../../../assets/banner4.png"),
//       url: "https://www.capitallink.co.th/clc",
//     },
//   ];

//   // ฟังก์ชันกดเปิดเว็บ
//   const handleOpenLink = (linkUrl: string) => {
//     // ใช้ Linking เพื่อเปิดเว็บภายนอก
//     Linking.openURL(linkUrl);
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
//       <ScrollView 
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* ส่วนบน: โปรไฟล์ผู้ใช้ ไล่สีแบบ LinearGradient ตามรูป */}
//         <LinearGradient
//           colors={['#E9D9B5', '#D4B976']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.profileSection}
//         >
//           <View style={styles.avatarContainer}>
//             <FontAwesome5 name="user-circle" size={36} color="#000" />
//           </View>
//           <View style={styles.userInfo}>
//             <Text style={styles.welcomeText}>สวัสดีตอนเย็น</Text>
//             <Text style={styles.userName}>MININ</Text>
//           </View>
//         </LinearGradient>

//         <View style={styles.container}>
//           {/* ปุ่มสี่เหลี่ยม: เงินฝาก, สินเชื่อ */}
//           <View style={styles.menuRow}>
//             <TouchableOpacity
//               style={styles.menuBox}
//               onPress={() => {
//                 // ตัวอย่างใน-app navigation
//                 // navigation.navigate("DepositDashboard");
//               }}
//             >
//               <Ionicons name="wallet-outline" size={28} color="#CFA459" style={styles.menuIcon} />
//               <Text style={styles.menuBoxTitle}>เงินฝาก</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.menuBox}
//               onPress={() => {
//                 // ตัวอย่าง in-app navigation
//                 // navigation.navigate("LoanDashboard");
//               }}
//             >
//               <Ionicons name="card-outline" size={28} color="#4F7FE3" style={styles.menuIcon} />
//               <Text style={styles.menuBoxTitle}>สินเชื่อ</Text>
//             </TouchableOpacity>
//           </View>

//           {/* แบนเนอร์ 4 อัน (กดแล้วไปเว็บนอก) */}
//           <View style={styles.bannerContainer}>
//             {externalLinks.map((item) => (
//               <TouchableOpacity
//                 key={item.id}
//                 style={styles.bannerCard}
//                 activeOpacity={0.9}
//                 onPress={() => handleOpenLink(item.url)}
//               >
//                 <Image
//                   source={item.image}
//                   style={styles.bannerImage}
//                   resizeMode="cover"
//                 />
//                 <View style={styles.bannerOverlay}>
//                   <Text style={styles.bannerTitle}>{item.title}</Text>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* เว้นระยะด้านล่าง */}
//           <View style={styles.bottomSpacer} />
//         </View>
//       </ScrollView>
      
//       {/* Bottom Tab Bar ตามรูป */}
//       <View style={styles.tabBar}>
//         <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
//           <Ionicons name="home" size={22} color="#000" />
//           <Text style={[styles.tabLabel, styles.activeTab]}>หน้าหลัก</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
//           <Ionicons name="card-outline" size={22} color="#888" />
//           <Text style={styles.tabLabel}>บัญชี</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
//           <Ionicons name="notifications-outline" size={22} color="#888" />
//           <Text style={styles.tabLabel}>การแจ้งเตือน</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
//           <Ionicons name="person-outline" size={22} color="#888" />
//           <Text style={styles.tabLabel}>โปรไฟล์</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 10,
//   },
//   profileSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     paddingVertical: 20,
//     marginBottom: 15,
//     borderBottomLeftRadius: 15,
//     borderBottomRightRadius: 15,
//   },
//   avatarContainer: {
//     marginRight: 10,
//   },
//   userInfo: {
//     flex: 1,
//   },
//   welcomeText: {
//     fontSize: 14,
//     color: "#000",
//     opacity: 0.7,
//   },
//   userName: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   menuRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   menuBox: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     marginHorizontal: 5,
//     padding: 16,
//     paddingVertical: 15,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: "#f0f0f0",
//   },
//   menuIcon: {
//     marginBottom: 10,
//   },
//   menuBoxTitle: {
//     fontSize: 16,
//     color: "#000",
//     fontWeight: "500",
//   },
//   bannerContainer: {
//     marginBottom: 20,
//   },
//   bannerCard: {
//     width: "100%",
//     height: 120,
//     borderRadius: 12,
//     overflow: "hidden",
//     marginBottom: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   bannerImage: {
//     width: "100%",
//     height: "100%",
//   },
//   bannerOverlay: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//   },
//   bannerTitle: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   bottomSpacer: {
//     height: 70, // ให้มีพื้นที่ว่างด้านล่างเพื่อไม่ให้เนื้อหาถูกซ่อนโดย bottom tab
//   },
//   tabBar: {
//     flexDirection: 'row',
//     height: 60,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#EEEEEE',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     paddingTop: 5,
//   },
//   tabItem: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tabLabel: {
//     fontSize: 10,
//     marginTop: 4,
//     color: '#888',
//   },
//   activeTab: {
//     color: '#000',
//     fontWeight: '600',
//   },
// });