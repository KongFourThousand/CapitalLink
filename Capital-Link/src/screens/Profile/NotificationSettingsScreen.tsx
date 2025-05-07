// NotificationSettingsScreen.tsx
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";

type NavProp = NativeStackNavigationProp<RootStackParamList, "NotiSettings">;

interface NotiCategory {
  key: string;
  title: string;
  description: string;
  enabled: boolean;
}

const defaultCategories: NotiCategory[] = [
  {
    key: "notifications_system_enabled",
    title: "แจ้งเตือนระบบ",
    description: "ข้อความแจ้งเตือนจากระบบ เมื่อมีอัปเดตต่างๆ",
    enabled: true,
  },
  {
    key: "notifications_account_enabled",
    title: "แจ้งเตือนบัญชี",
    description: "เกี่ยวกับรายการบัญชี ฝาก–ถอน ยอดเงิน",
    enabled: true,
  },
  {
    key: "notifications_news_enabled",
    title: "แจ้งข่าวสาร",
    description: "ข่าวสาร โปรโมชั่น และอีเวนต์สำคัญ",
    enabled: true,
  },
];

const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [categories, setCategories] =
    useState<NotiCategory[]>(defaultCategories);

  // โหลดค่าจาก AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const keys = defaultCategories.map((c) => c.key);
        const stores = await AsyncStorage.multiGet(keys);
        const updated = categories.map((cat) => {
          const found = stores.find(([k]) => k === cat.key);
          if (found && found[1] != null) {
            return { ...cat, enabled: JSON.parse(found[1]!) };
          }
          return cat;
        });
        setCategories(updated);
      } catch (err) {
        console.error("Error loading notification settings:", err);
      }
    })();
  }, []);

  // Toggle แต่ละประเภท
  const handleToggleCategory = async (key: string, value: boolean) => {
    const updated = categories.map((cat) =>
      cat.key === key ? { ...cat, enabled: value } : cat
    );
    setCategories(updated);
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("Error saving notification setting:", err);
    }
  };

  // สวิตช์ reuse
  const SwitchNoti = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: "#D1D1D6", true: "#CFA45980" }}
      thumbColor={value ? "#CFA459" : "#F4F4F4"}
      ios_backgroundColor="#D1D1D6"
      style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Back */}
      <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <Ionicons name="chevron-back" size={26} color="#CFA459" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>ตั้งค่าการแจ้งเตือน</Text>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {categories.map((cat) => (
          <View key={cat.key} style={styles.settingCard}>
            <View style={styles.settingContent}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{cat.title}</Text>
                <Text style={styles.description}>{cat.description}</Text>
              </View>
              <SwitchNoti
                value={cat.enabled}
                onChange={(v) => handleToggleCategory(cat.key, v)}
              />
            </View>
          </View>
        ))}

        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>หมายเหตุ:</Text>
          <Text style={styles.noteText}>
            - คุณอาจต้องเปิดการแจ้งเตือนใน Settings ของอุปกรณ์ด้วย
          </Text>
          <Text style={styles.noteText}>
            - ถ้าปิด ระบบจะไม่ส่งข้อมูลสำคัญให้คุณทราบ
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationSettingsScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  backButton: { position: "absolute", top: 40, left: 18, zIndex: 1 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#a2754c",
    marginTop: 40,
    textAlign: "center",
  },
  contentContainer: { padding: 16, paddingBottom: 30 },
  settingCard: {
    backgroundColor: "#FFF9EF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#CFA459",
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 4 },
  description: { fontSize: 14, color: "#666", flexWrap: "wrap" },
  noteContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  noteText: { fontSize: 13, color: "#666", lineHeight: 18, marginBottom: 4 },
});
