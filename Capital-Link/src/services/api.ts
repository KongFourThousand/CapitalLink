import { DataUsers } from "../Data/UserDataStorage";
import type { DataUserType } from "../Data/UserDataStorage";
type IndividualPayload = {
  personalIdCard: string;
  birthDate: string;
  phone: string;
};

type JuristicPayload = {
  companyRegisterNumber: string;
  contactIdCard: string;
  phone: string;
};

// ฟังก์ชันตรวจสอบสมาชิก
export async function verifyIndividual(
  payload: IndividualPayload
): Promise<DataUserType | null> {
  if (__DEV__) {
    await new Promise((r) => setTimeout(r, 300)); // ดีเลย์จำลอง
    return (
      DataUsers.find(
        (u) =>
          u.userType === "individual" &&
          u.personalIdCard === payload.personalIdCard &&
          u.birthDate === payload.birthDate &&
          u.phone === payload.phone
      ) || null
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
export async function verifyJuristic(
  payload: JuristicPayload
): Promise<DataUserType | null> {
  if (__DEV__) {
    await new Promise((r) => setTimeout(r, 300));
    return (
      DataUsers.find(
        (u) =>
          u.userType === "juristic" &&
          u.companyRegisterNumber === payload.companyRegisterNumber &&
          u.contactIdCard === payload.contactIdCard &&
          u.phone === payload.phone
      ) || null
    );
  }
  const res = await fetch("https://api.capitallink.com/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
