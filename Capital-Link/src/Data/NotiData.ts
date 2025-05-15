import { defaultCategories } from "./NotiSystemData";

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  key: NotificationType;
}
export type NotificationType = "news" | "system" | "account";
export const mockNotifications: Notification[] = [
  {
    id: "1",
    key: "news",
    title: "โปรโมชั่นใหม่",
    message: "รับส่วนลดพิเศษ 20% สำหรับการใช้บริการเงินฝากวันนี้เท่านั้น!",
    date: "2025-05-15",
    read: false,
  },
  {
    id: "2",
    key: "account",
    title: "แจ้งเตือนการชำระเงิน",
    message: "คุณมีการชำระเงินที่ค้างอยู่ กรุณาตรวจสอบรายละเอียดในแอป",
    date: "2025-05-14",
    read: false,
  },
  {
    id: "3",
    key: "system",
    title: "อัปเดตระบบ",
    message:
      "ระบบของเราได้มีการอัปเดตแล้ว กรุณารีสตาร์ทแอปเพื่อรับประสบการณ์ใหม่",
    date: "2025-05-15",
    read: false,
  },
];
export const mockToggleNotificationApi = async (
  key: string,
  enable: boolean
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (enable) {
        const cat = defaultCategories.find((c) => c.key === key);
        const newNotif: Notification = {
          id: Date.now().toString(),
          title: `เปิดแจ้งเตือน ${cat?.title ?? key}`,
          message: `คุณได้เปิดการแจ้งเตือนสำหรับ ${cat?.title ?? key}`,
          date: getFormattedDate(), // ใช้ฟังก์ชันที่เราเขียน
          read: false,
          key: key as NotificationType,
        };
        mockNotifications.unshift(newNotif);
      }
      resolve();
    }, 500);
  });
};
const getFormattedDate = (date: Date = new Date()): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
