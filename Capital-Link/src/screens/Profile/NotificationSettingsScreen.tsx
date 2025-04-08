import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import AsyncStorage from '@react-native-async-storage/async-storage';


type NotificationSettingsScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "NotiSettings"
>;

const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation<NotificationSettingsScreenNavProp>();

  // สถานะหลักของการแจ้งเตือน (เปิด/ปิด)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await AsyncStorage.getItem('notifications_enabled');
        if (result !== null) {
          setNotificationsEnabled(JSON.parse(result)); // true/false
        }
      } catch (err) {
        console.error('Error loading notification setting:', err);
      }
    };
  
    loadSettings();
  }, []);
  
  // ปุ่ม Back → กลับหน้าเดิม
  const handleBack = () => {
    navigation.goBack();
  };

  // Toggle เปิด/ปิด การแจ้งเตือน
  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
  
    try {
      await AsyncStorage.setItem('notifications_enabled', JSON.stringify(value));
    } catch (err) {
      console.error('Error saving notification setting:', err);
    }
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ปุ่ม Back */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={26} color="#CFA459" />
      </TouchableOpacity>

      {/* หัวข้อ */}
      <Text style={styles.headerTitle}>ตั้งค่าการแจ้งเตือน</Text>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* กล่องขาวสำหรับเปิด/ปิดการแจ้งเตือน */}
        <View style={styles.mainSettingCard}>
          <View style={styles.mainSettingContent}>
            <View>
              <Text style={styles.mainSettingTitle}>เปิดการแจ้งเตือน</Text>
              <Text style={styles.mainSettingDescription}>
                รับข้อความแจ้งเตือนจากระบบ เมื่อมีการอัปเดตต่างๆ
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: "#D1D1D6", true: "#CFA45980" }}
              thumbColor={notificationsEnabled ? "#CFA459" : "#F4F4F4"}
              ios_backgroundColor="#D1D1D6"
              style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
            />
          </View>
        </View>

        {/* หมายเหตุ */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>หมายเหตุ:</Text>
          <Text style={styles.noteText}>
            - คุณอาจต้องเปิดการแจ้งเตือนในหน้าตั้งค่า (Settings) ของอุปกรณ์ด้วย
          </Text>
          <Text style={styles.noteText}>
            - หากปิดการแจ้งเตือน แอปจะไม่สามารถส่งข้อมูลหรือข้อความสำคัญให้คุณทราบได้
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationSettingsScreen;

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
    marginTop: 40,
    marginBottom: 20,
    textAlign: "center",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  mainSettingCard: {
    backgroundColor: "#FFF9EF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#CFA459",
  },
  mainSettingContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainSettingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  mainSettingDescription: {
    fontSize: 14,
    color: "#666",
    maxWidth: "90%",
  },
  noteContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  noteText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
    lineHeight: 18,
  },
});
