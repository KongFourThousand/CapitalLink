// mockApi.ts
// ไฟล์นี้เอาไว้รวมฟังก์ชัน mock ที่เลียนแบบการเรียก API จริง
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // Add this property
    shouldShowList: true, // Add this property
  }),
});
export async function mockRequestOtp(phoneNumber: string): Promise<string> {
  console.log("Mock: กำลังขอ OTP ไปยังเบอร์:", phoneNumber);
  // หน่วง 1.5 วินาที
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // สมมติว่าระบบหลังบ้านส่ง OTP “123456” ให้
  // (คุณอาจส่งกลับอย่างอื่นก็ได้ตามต้องการ)
  return "123456";
}

/**
 * mockVerifyOtp:
 *  - จำลองการตรวจสอบ OTP ว่าถูกต้องหรือไม่
 *  - คุณอาจใส่เงื่อนไขเช็ค otpCode หรือจะกำหนดว่าผ่านทุกครั้งก็ได้
 */
export async function mockVerifyOtp(
  phoneNumber: string,
  otpCode: string
): Promise<boolean> {
  console.log("Mock: กำลังตรวจสอบ OTP:", otpCode, "ของเบอร์:", phoneNumber);
  // หน่วง 1 วินาที
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // ตัวอย่าง: ให้ผ่านก็ต่อเมื่อ otpCode === "123456"
  return otpCode === "123456";
}
export async function mockSendOtpNotification(
  phoneNumber: string
): Promise<void> {
  // ดึง OTP จาก mock API
  const otp = await mockRequestOtp(phoneNumber);
  await Notifications.requestPermissionsAsync({
    ios: { allowSound: true },
    // Android จะยินยอมเล่นเสียงโดยดีฟอลต์ถ้าผู้ใช้อนุญาต Notifications ทั้งหมด
  });
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("otp-channel", {
      name: "OTP Notifications",
      importance: Notifications.AndroidImportance.MAX, // heads-up
      sound: "default", // ใช้เสียงดีฟอลต์
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  // ยิง notification ทันที
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "รหัส OTP ของคุณ",
      body: `รหัส OTP คือ ${otp}`,
      data: { screen: "OtpVerification", phoneNumber },
      sound: "default",
    },
    trigger: {
      seconds: 1, // หน่วงสักหน่อยเพื่อให้ channelId ทำงาน
      channelId: "otp-channel", // ← channelId ต้องอยู่ตรงนี้เท่านั้น
    },
  });
}
