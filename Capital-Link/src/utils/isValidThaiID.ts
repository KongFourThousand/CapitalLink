// src/utils/validation.ts
export function isValidThaiID(id: string): boolean {
  
    const digits = id.replace(/\D/g, "");

    if (digits.length !== 13) return false;
    if (/^(\d)\1{12}$/.test(digits)) return false; // เช่น 1111111111111
  
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(digits[i]) * (13 - i);
    }
  
    const checkDigit = (11 - (sum % 11)) % 10;
    return checkDigit === parseInt(digits[12]);
  }
  