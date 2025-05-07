// src/components/common/formatPhoneNumber.tsx
export function formatPhoneNumber(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "").substring(0, 10);
  const digitLength = digits.length;
  if (digitLength < 4) return digits;
  if (digitLength < 7) return digits.replace(/(\d{3})(\d+)/, "$1-$2");
  return digits.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3");
}
// ✅ สำหรับเลขบัตรประชาชน
export function formatThaiID(raw: string): string {
  const digits = raw.replace(/\D/g, "").substring(0, 13);
  return digits
    .replace(/^(\d{1})(\d{0,4})/, "$1-$2")
    .replace(/^(\d{1})-(\d{4})(\d{0,5})/, "$1-$2-$3")
    .replace(/^(\d{1})-(\d{4})-(\d{5})(\d{0,2})/, "$1-$2-$3-$4")
    .replace(/^(\d{1})-(\d{4})-(\d{5})-(\d{2})(\d{0,1})/, "$1-$2-$3-$4-$5");
}
export const formatPhoneNumberText = (value: string) => {
  // ตัดทุกอย่างที่ไม่ใช่ตัวเลขออก
  const cleaned = (value || "").replace(/\D/g, "");
  // พยายามจับกลุ่ม 3-3-4 ตัวเลข
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  // ถ้าจับได้ ให้แทรกขีด ลงไปตามกลุ่ม เท่าที่มี
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  // ถ้าไม่ถึง 10 หลัก ก็จัดฟอร์แมตเบื้องต้น (กรณีโทรไม่ครบ)
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};
