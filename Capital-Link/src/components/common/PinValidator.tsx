// PinValidator.ts

/**
 * ตรวจว่า PIN มีตัวเลขเหมือนกันทั้งหมดหรือไม่ (เช่น 111111)
 */
export const hasSameDigits = (pin: string): boolean => {
    return pin.split("").every(d => d === pin[0]);
  };
  
  /**
   * ตรวจว่า PIN มีเลขเรียงต่อกันหรือไม่ (ขึ้นหรือลง เช่น 123456 / 654321)
   */
  export const hasSequentialDigits = (pin: string): boolean => {
    let ascending = true;
    let descending = true;
  
    for (let i = 1; i < pin.length; i++) {
      const curr = parseInt(pin[i]);
      const prev = parseInt(pin[i - 1]);
  
      if (curr !== prev + 1) ascending = false;
      if (curr !== prev - 1) descending = false;
  
      if (!ascending && !descending) break;
    }
  
    return ascending || descending;
  };
  
  /**
   * ตรวจว่า PIN มีรูปแบบซ้ำกันครึ่งหลัง (เช่น 123123)
   */
  export const hasRepeatingPattern = (pin: string): boolean => {
    if (pin.length % 2 !== 0) return false;
    const half = pin.length / 2;
    return pin.substring(0, half) === pin.substring(half);
  };
  
  /**
   * ตรวจว่า PIN มีเลขไหนซ้ำเกิน N ครั้ง
   */
  export const hasExcessiveRepeats = (
    pin: string,
    maxRepeats: number = 5
  ): boolean => {
    const counts: Record<string, number> = {};
    for (const digit of pin) {
      counts[digit] = (counts[digit] || 0) + 1;
      if (counts[digit] >= maxRepeats) return true;
    }
    return false;
  };
  
  /**
   * ตรวจว่ารหัส PIN ตรงกับลวดลายของแป้นพิมพ์ (keypad) หรือไม่ เช่น 147258
   */
  export const hasKeypadPattern = (pin: string): boolean => {
    const patterns = [
      "147258", "258369", "159357", "357159", "123789", "789456"
    ];
  
    return patterns.some(pattern => pin.includes(pattern));
  };
  
  /**
   * ตรวจว่า PIN ซ้ำกับ PIN เก่าหรือไม่
   */
  export const isSameAsPreviousPin = (
    pin: string,
    previousPin?: string
  ): boolean => {
    return previousPin ? pin === previousPin : false;
  };
  
  /**
   * ตรวจว่า PIN เป็น PIN ยอดนิยม (common) ที่พบเห็นบ่อย
   */
  export const isCommonPin = (pin: string): boolean => {
    const commonPins = [
      "000123", "123000", "123321", "101101", "696969"
    ];
    return commonPins.includes(pin);
  };
  
  /**
   * ตรวจสอบว่า PIN ถูกต้องหรือไม่ พร้อมเหตุผล
   */
  export const validatePin = (
    pin: string,
    previousPin?: string
  ): { valid: boolean; message?: string } => {
    if (pin.length !== 6) {
      return { valid: false, message: "รหัส PIN ต้องมี 6 หลัก" };
    }
  
    if (hasSameDigits(pin)) {
      return { valid: false, message: "รหัส PIN ไม่ควรใช้เลขเดียวกันทั้งหมด" };
    }
  
    if (hasSequentialDigits(pin)) {
      return { valid: false, message: "รหัส PIN ไม่ควรเป็นเลขเรียงต่อกัน" };
    }
  
    if (hasRepeatingPattern(pin)) {
      return { valid: false, message: "รหัส PIN ไม่ควรเป็นรูปแบบที่ซ้ำกัน" };
    }
  
    if (hasKeypadPattern(pin)) {
      return { valid: false, message: "รหัส PIN มีรูปแบบที่เดาง่ายจากแป้นพิมพ์" };
    }
  
    if (isCommonPin(pin)) {
      return { valid: false, message: "รหัส PIN นี้นิยมใช้กันมากเกินไป" };
    }
  
    if (isSameAsPreviousPin(pin, previousPin)) {
      return { valid: false, message: "รหัส PIN ไม่ควรซ้ำกับรหัสเดิม" };
    }
  
    if (hasExcessiveRepeats(pin, 5)) {
      return { valid: false, message: "รหัส PIN ไม่ควรมีเลขซ้ำกันเกิน 5 ตัว" };
    }
  
    return { valid: true };
  };

  