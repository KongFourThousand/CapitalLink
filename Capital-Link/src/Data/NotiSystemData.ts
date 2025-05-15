export interface NotiCategory {
  key: NotiCategoryKey;
  title: string;
  description: string;
  enabled: boolean;
}
export type NotiCategoryKey =
  | "notifications_system_enabled"
  | "notifications_account_enabled"
  | "notifications_news_enabled";
export const defaultCategories: NotiCategory[] = [
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
