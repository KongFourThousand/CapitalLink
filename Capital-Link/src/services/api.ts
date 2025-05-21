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
  // if (__DEV__) {
  //   await new Promise((r) => setTimeout(r, 300)); // ดีเลย์จำลอง
  //   return (
  //     DataUsers.find(
  //       (u) =>
  //         u.userType === "individual" &&
  //         u.personalIdCard === payload.personalIdCard &&
  //         u.birthDate === payload.birthDate &&
  //         u.phone === payload.phone
  //     ) || null
  //   );
  // }
  // // production: เรียกเรียล API
  // const res = await fetch("https://api.capitallink.com/verify-member", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // const json = await res.json();
  // return json.exists;
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

// ฟังก์ชันสมัครจริง
export async function verifyJuristic(
  payload: JuristicPayload
): Promise<DataUserType | null> {
  // if (__DEV__) {
  //   await new Promise((r) => setTimeout(r, 300));
  //   return (
  //     DataUsers.find(
  //       (u) =>
  //         u.userType === "juristic" &&
  //         u.companyRegisterNumber === payload.companyRegisterNumber &&
  //         u.contactIdCard === payload.contactIdCard &&
  //         u.phone === payload.phone
  //     ) || null
  //   );
  // }
  // const res = await fetch("https://api.capitallink.com/register", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // return res.json();
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
export const mockVerifyIndividual = async ({
  personalIdCard,
  birthDate,
  phone,
}) => {
  const clean = (s) => (s || "").replace(/\D/g, "").trim();

  const candidates = DataUsers.filter(
    (u) =>
      u.userType === "individual" &&
      clean(u.personalIdCard) === clean(personalIdCard) &&
      u.birthDate?.trim() === birthDate.trim()
  );

  if (candidates.length === 0) {
    return null;
  }

  const matched = candidates.find((u) => clean(u.phone) === clean(phone));

  if (!matched) {
    return { status: "incorrect" }; // เบอร์ไม่ตรงกับชุดข้อมูลนั้น
  }

  return { status: "match", user: matched };
};

export const mockVerifyJuristic = async ({
  companyRegisterNumber,
  contactIdCard,
  phone,
}) => {
  const clean = (s) => (s || "").replace(/\D/g, "").trim();

  const candidates = DataUsers.filter(
    (u) =>
      u.userType === "juristic" &&
      clean(u.companyRegisterNumber) === clean(companyRegisterNumber) &&
      clean(u.contactIdCard) === clean(contactIdCard)
  );

  if (candidates.length === 0) {
    return null; // ไม่พบเลย
  }

  const matched = candidates.find((u) => clean(u.phone) === clean(phone));

  if (!matched) {
    return { status: "incorrect" }; // เบอร์ไม่ตรงกับข้อมูลที่มี
  }

  return { status: "match", user: matched };
};
