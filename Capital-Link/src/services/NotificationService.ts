// NotificationService.ts
import * as Notifications from "expo-notifications";
import { mockNotifications, type Notification } from "../Data/NotiData";

// สั่งเด้งทุกรายการ (ที่ยังไม่อ่าน) ทันที
export async function fireMockNotifications() {
  for (const notif of mockNotifications) {
    if (!notif.read) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notif.title,
          body: notif.message,
          data: { id: notif.id, key: notif.key }, // ส่งข้อมูลไปกับ notification ได้
        },
        trigger: null, // null = เด้งทันที
      });
    }
  }
}
