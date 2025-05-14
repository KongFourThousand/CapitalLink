// import { DataUserType, DataUser } from "./UserDataStorage";
export type RegisterPayload = {
  personalId: string;
  phone: string;
};

// กำหนด mock users
const MOCK_USERS = [
  { personalId: "1234567890123", phone: "0812345678", name: "ทดสอบ User" },
  // เพิ่มรายการอื่นตามต้องการ
];

// ฟังก์ชันตรวจสอบสมาชิก
export async function verifyMember(payload: RegisterPayload): Promise<boolean> {
  if (__DEV__) {
    // เลียนแบบดีเลย์เครือข่าย
    await new Promise((r) => setTimeout(r, 500));
    // ตรวจสอบใน mock list
    return MOCK_USERS.some(
      (u) => u.personalId === payload.personalId && u.phone === payload.phone
    );
  }
  // production: เรียกเรียล API
  const res = await fetch("https://api.capitallink.com/verify-member", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.exists;
}

// ฟังก์ชันสมัครจริง
export async function registerMember(payload: RegisterPayload) {
  if (__DEV__) {
    // เลียนแบบสำเร็จ
    return { success: true, message: "Mock สมัครเรียบร้อย" };
  }
  const res = await fetch("https://api.capitallink.com/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
