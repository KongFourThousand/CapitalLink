import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { mockNotifications } from "../Data/NotiData";
import { useData } from "../Provide/Auth/UserDataProvide";

const PUSH_TOKEN_KEY = "expoPushToken";

export async function syncPushToken(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log("Must use physical device for push notifications");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Permission not granted for notifications");
    return null;
  }

  // 👉 ดึง token ล่าสุด
  const newTokenData = await Notifications.getExpoPushTokenAsync();
  const newToken = newTokenData.data;

  // 👉 ดึง token เดิมจาก AsyncStorage
  const savedToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
  console.log("Saved token:", savedToken);

  if (savedToken !== newToken) {
    console.log("New token detected. Saving new token...");
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, newToken);
  } else {
    console.log("Token has not changed");
  }

  return newToken;
}
const TYPE_KEY_MAP = {
  system: "notifications_system_enabled",
  account: "notifications_account_enabled",
  news: "notifications_news_enabled",
};

export async function handleIncomingNotification(noti: {
  id: string;
  key: string;
  title: string;
  message: string;
  date: string;
}) {
  console.log("🧩 Incoming noti.key:", noti.key);

  const enabledKey = TYPE_KEY_MAP[noti.key];
  console.log("🔑 Enabled key resolved:", enabledKey);

  if (!enabledKey) {
    console.warn("❌ Unknown noti type:", noti.key);
    return;
  }

  const isEnabled = await AsyncStorage.getItem(enabledKey);
  console.log("🔒 isEnabled =", isEnabled);

  if (isEnabled !== "true") {
    console.log("🔕 Noti type disabled:", noti.key);
    // return;
  }

  const stored = await AsyncStorage.getItem("readNotifications");
  const list = stored ? JSON.parse(stored) : [];
  const clean = Array.isArray(list)
    ? list.filter((n) => n && typeof n === "object")
    : [];

  const exists = clean.some((n) => n.id === noti.id);
  if (exists) {
    console.log("🟡 Noti already exists:", noti.id);
    return;
  }

  const newEntry = { ...noti, read: false };
  const updatedList = [newEntry, ...clean];

  await AsyncStorage.setItem("readNotifications", JSON.stringify(updatedList));
  console.log("✅ Notification saved:", newEntry);
}
async function logAllAsyncStorage() {
  const keys = await AsyncStorage.getAllKeys();
  const stores = await AsyncStorage.multiGet(keys);

  console.log("📦 AsyncStorage Contents:");
  // biome-ignore lint/complexity/noForEach: <explanation>
  stores.forEach(([key, value]) => {
    console.log(`🗝️ ${key} =`, value);
  });
}
export const isCategoryEnabled = async (key: string): Promise<boolean> => {
  const settingKey = `notifications_${key}_enabled`;
  const value = await AsyncStorage.getItem(settingKey);
  return value === null ? true : value === "true"; // default: true
};
