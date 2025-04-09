// src/components/common/formatPhoneNumber.tsx
export function formatPhoneNumber(rawPhone: string): string {
    const digits = rawPhone.replace(/\D/g, "").substring(0,10);
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