import type React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import CustomTabBar from "../../components/common/CustomTabBar";
import { mockNotifications, type Notification } from "../../Data/NotiData";
import { useData } from "../../Provide/Auth/UserDataProvide";

type NotificationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Notification"
>;

const READ_NOTIFICATIONS_KEY = "readNotifications";

const NotificationScreen: React.FC = () => {
  const { notifications, setNotifications } = useData();
  const [unreadCount, setUnreadCount] = useState<number>(
    mockNotifications.filter((n) => !n.read).length
  );
  // โหลดรายการ ID ที่อ่านแล้วจาก AsyncStorage เมื่อ component mount

  // useEffect(() => {
  //   const loadReadNotifications = async () => {
  //     try {
  //       const stored = await AsyncStorage.getItem(READ_NOTIFICATIONS_KEY);
  //       const readList: string[] = stored ? JSON.parse(stored) : [];

  //       setNotifications((prev) =>
  //         prev.map((notif) =>
  //           readList.includes(notif.id) ? { ...notif, read: true } : notif
  //         )
  //       );

  //       // อัปเดต unreadCount หลังโหลดเสร็จ
  //       const unread = mockNotifications.filter(
  //         (notif) => !readList.includes(notif.id)
  //       ).length;
  //       setUnreadCount(unread);
  //     } catch (error) {
  //       console.error("Error loading read notifications", error);
  //     }
  //   };

  //   loadReadNotifications();
  // }, []);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // AsyncStorage.removeItem("readNotifications");
    const loadNotification = async () => {
      const savedDate = await AsyncStorage.getItem("readNotifications");
      console.log("🔑 Loaded savedDate:", savedDate);
      if (savedDate) {
        const parsed = JSON.parse(savedDate);
        const clean = Array.isArray(parsed)
          ? parsed.filter((n) => n && typeof n === "object" && n.id)
          : [];

        setNotifications(clean);
      }
    };
    loadNotification();
  }, []);
  // เมื่อกดแจ้งเตือน ให้เปลี่ยนสถานะเป็นอ่าน (read) และบันทึกลง AsyncStorage
  // const handleNotificationPress = async (id: string) => {
  //   const updated = notifications.map((notif) =>
  //     notif.id === id ? { ...notif, read: true } : notif
  //   );
  //   setNotifications(updated);

  //   // อัปเดต unreadCount ทันที
  //   setUnreadCount(updated.filter((n) => !n.read).length);

  //   const readIds = updated.filter((n) => n.read).map((n) => n.id);
  //   try {
  //     await AsyncStorage.setItem(
  //       READ_NOTIFICATIONS_KEY,
  //       JSON.stringify(readIds)
  //     );
  //   } catch (error) {
  //     console.error("Error saving read notifications", error);
  //   }
  // };
  const handleNotificationPress = async (id: string) => {
    // 1. อัปเดตใน context
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.read).length);

    // 2. อัปเดตใน AsyncStorage
    await AsyncStorage.setItem("readNotifications", JSON.stringify(updated));
    console.log("✅ Updated read status and saved to storage");
  };
  const renderItem = ({ item }: { item: Notification }) => {
    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          item.read && styles.notificationCardRead, // เปลี่ยนพื้นหลังถ้าอ่านแล้ว
        ]}
        onPress={() => handleNotificationPress(item.id)}
      >
        <View style={styles.notificationHeader}>
          <Text
            style={[
              styles.notificationTitle,
              item.read && styles.notificationTitleRead, // เปลี่ยนสีตัวหนังสือถ้าอ่านแล้ว
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.notificationDate,
              item.read && styles.notificationDateRead,
            ]}
          >
            {item.date}
          </Text>
        </View>
        <Text
          style={[
            styles.notificationMessage,
            item.read && styles.notificationMessageRead,
          ]}
        >
          {item.message}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={26} color="#CFA459" />
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>แจ้งเตือน</Text>
      </View>
      <FlatList
        data={notifications}
        // keyExtractor={(item) => item.id}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      <CustomTabBar activeTab="notification" unreadCount={unreadCount} />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    alignItems: "center", // ทำให้ headerTitle อยู่ตรงกลาง
    justifyContent: "center",
    // position: "relative",
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
    marginTop: 20,
    marginBottom: 20,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  notificationCardRead: {
    backgroundColor: "#f0f0f0", // เปลี่ยนพื้นหลังเมื่ออ่านแล้ว
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  notificationTitleRead: {
    color: "#999", // เปลี่ยนสีตัวหนังสือเมื่ออ่านแล้ว
  },
  notificationDate: {
    fontSize: 12,
    color: "#666",
  },
  notificationDateRead: {
    color: "#999", // เปลี่ยนสีวันที่เมื่ออ่านแล้ว
  },
  notificationMessage: {
    fontSize: 14,
    color: "#333",
  },
  notificationMessageRead: {
    color: "#666", // เปลี่ยนสีข้อความเมื่ออ่านแล้ว
  },
});
