// src/components/common/formatPhoneNumber.tsx
export function formatPhoneNumber(rawPhone: string): string {
    const digits = rawPhone.replace(/\D/g, "").substring(0,10);
    const digitLength = digits.length;
    if (digitLength < 4) return digits;
    if (digitLength < 7) return digits.replace(/(\d{3})(\d+)/, "$1-$2");
    return digits.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3");
  }
  