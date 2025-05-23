import type React from "react";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { mockNotifications } from "../../Data/NotiData";
import { useData } from "../../Provide/Auth/UserDataProvide";
// แบบง่าย ไม่ต้องเชื่อมกับ RootStackParamList ที่อาจจะมีปัญหา
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AnyNavigation = NativeStackNavigationProp<any>;

// ประเภทของแท็บ
export type TabName = "home" | "account" | "notification" | "profile";

interface CustomTabBarProps {
  activeTab: TabName;
  onTabPress?: (tabName: TabName) => void;
  unreadCount?: number;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  activeTab,
  onTabPress,
  unreadCount: propUnreadCount,
}) => {
  const { notifications, setNotifications } = useData();
  const navigation = useNavigation<AnyNavigation>();
  const READ_NOTIFICATIONS_KEY = "readNotifications";
  // const [localUnreadCount, setLocalUnreadCount] = useState<number>(0);
  useEffect(() => {
    if (propUnreadCount === undefined) {
      const loadUnreadCount = async () => {
        try {
          const stored = await AsyncStorage.getItem("readNotifications");
          const parsed = stored ? JSON.parse(stored) : [];

          const clean = Array.isArray(parsed)
            ? parsed.filter((n) => n && typeof n === "object")
            : [];

          const unread = clean.filter((n) => !n.read).length;
          // setLocalUnreadCount(unread);
        } catch (error) {
          console.error("Error loading unread count", error);
        }
      };

      loadUnreadCount();
      const unsubscribe = navigation.addListener("focus", loadUnreadCount);
      return unsubscribe;
    }
  }, [navigation, propUnreadCount]);
  const displayCount = notifications.filter((n) => !n.read).length;

  // ฟังก์ชันสำหรับจัดการเมื่อกดแท็บ
  const handleTabPress = (tabName: TabName) => {
    // ถ้ามีการส่ง onTabPress มาให้ใช้ฟังก์ชันนั้น
    if (onTabPress) {
      onTabPress(tabName);
      return;
    }

    // ใช้การนำทางแบบตรงๆ ไปยังหน้าที่ต้องการ
    switch (tabName) {
      case "home":
        navigation.navigate("Home");
        break;
      case "account":
        navigation.navigate("Account");
        break;
      case "notification":
        navigation.navigate("Notification");

        break;
      case "profile":
        navigation.navigate("Profile");
        break;
    }
  };

  return (
    <View style={styles.tabBar}>
      {/* หน้าหลัก */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleTabPress("home")}
      >
        <Ionicons
          name={activeTab === "home" ? "home" : "home-outline"}
          size={22}
          color={activeTab === "home" ? "#CFA459" : "#616a76"}
        />
        <Text
          style={[styles.tabLabel, activeTab === "home" && styles.activeTab]}
        >
          หน้าหลัก
        </Text>
      </TouchableOpacity>

      {/* บัญชี */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleTabPress("account")}
      >
        <Ionicons
          name={activeTab === "account" ? "card" : "card-outline"}
          size={22}
          color={activeTab === "account" ? "#CFA459" : "#616a76"}
        />
        <Text
          style={[styles.tabLabel, activeTab === "account" && styles.activeTab]}
        >
          บัญชี
        </Text>
      </TouchableOpacity>

      {/* การแจ้งเตือน */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleTabPress("notification")}
      >
        <View style={{ position: "relative" }}>
          <Ionicons
            name={
              activeTab === "notification"
                ? "notifications"
                : "notifications-outline"
            }
            size={22}
            color={activeTab === "notification" ? "#CFA459" : "#616a76"}
          />
          {displayCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{displayCount}</Text>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.tabLabel,
            activeTab === "notification" && styles.activeTab,
          ]}
        >
          การแจ้งเตือน
        </Text>
      </TouchableOpacity>

      {/* โปรไฟล์ */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleTabPress("profile")}
      >
        <Ionicons
          name={activeTab === "profile" ? "person" : "person-outline"}
          size={22}
          color={activeTab === "profile" ? "#CFA459" : "#616a76"}
        />
        <Text
          style={[styles.tabLabel, activeTab === "profile" && styles.activeTab]}
        >
          โปรไฟล์
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
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
    fontSize: 15,
    marginTop: 4,
    color: "#616a76",
  },
  activeTab: {
    color: "#CFA459", // เปลี่ยนเป็นสีทองตามธีมของแอป
    fontWeight: "600",
  },
  badgeContainer: {
    position: "absolute",
    top: -3,
    right: -10,
    backgroundColor: "red",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
});

export default CustomTabBar;
