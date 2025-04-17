// PinValidator.ts - ไฟล์สำหรับฟังก์ชันตรวจสอบ PIN

/**
 * ตรวจสอบว่า PIN มีตัวเลขซ้ำกันทั้งหมดหรือไม่
 * เช่น 111111, 222222
 */
export const hasSameDigits = (pin: string): boolean => {
  const firstDigit = pin[0];
  return pin.split("").every((digit) => digit === firstDigit);
};

/**
 * ตรวจสอบว่า PIN มีตัวเลขเรียงกันหรือไม่ (เพิ่มขึ้นหรือลดลง)
 * เช่น 123456, 654321, 012345
 */
export const hasSequentialDigits = (pin: string): boolean => {
  // ตรวจสอบเลขเรียงเพิ่มขึ้น (เช่น 123456, 012345)
  let isAscending = true;
  // ตรวจสอบเลขเรียงลดลง (เช่น 654321, 987654)
  let isDescending = true;

  for (let i = 1; i < pin.length; i++) {
    const currentDigit = parseInt(pin[i], 10);
    const prevDigit = parseInt(pin[i - 1], 10);

    // ถ้าตัวเลขปัจจุบันไม่ได้มากกว่าตัวก่อนหน้า 1 หน่วย
    if (currentDigit !== prevDigit + 1) {
      isAscending = false;
    }

    // ถ้าตัวเลขปัจจุบันไม่ได้น้อยกว่าตัวก่อนหน้า 1 หน่วย
    if (currentDigit !== prevDigit - 1) {
      isDescending = false;
    }

    // ถ้าทั้งสองเงื่อนไขไม่เป็นจริง ไม่จำเป็นต้องตรวจสอบต่อ
    if (!isAscending && !isDescending) {
      break;
    }
  }

  return isAscending || isDescending;
};

/**
 * ตรวจสอบว่า PIN มีรูปแบบการซ้ำกลุ่มตัวเลขหรือไม่
 * เช่น 123123, 456456, 789789
 */
export const hasRepeatingPattern = (pin: string): boolean => {
  if (pin.length % 2 !== 0) return false; // ต้องมีจำนวนหลักเป็นเลขคู่

  const halfLength = pin.length / 2;
  const firstHalf = pin.substring(0, halfLength);
  const secondHalf = pin.substring(halfLength);

  return firstHalf === secondHalf;
};

/**
 * ตรวจสอบว่า PIN อ่อนแอหรือไม่
 * - เป็น PIN ที่ใช้บ่อยหรือมีรูปแบบเดาง่าย
 * - หรือซ้ำกับ PIN เก่า
 */
export const isWeakPin = (pin: string): boolean => {
  // รวม PIN ที่ใช้บ่อย + PIN ที่เป็น pattern keypad
  const weakPins = [
   // PIN ซ้ำๆ หรือง่ายเกินไป

    "121212", "987654", "000123", "012345",
   "543210", "101010", "202020", "123000", "123321",
   "101101", "696969", "888999",

   // PIN ที่เป็น pattern keypad
    "456789", "147258", "258369", "369258", "123789", "147369", "369147", 
    "789456", "258147"
 ];

  // ถ้าอยู่ในลิสต์นี้ ถือว่าอ่อนแอ
  const isListedWeak = weakPins.includes(pin);

  return isListedWeak ;
};

//ตรวจสอบว่า PIN ซ้ำกับ PIN เก่าหรือไม่
export const isSameAsPreviousPin = (
  pin: string,
  previousPin?: string
): boolean => {
  if (!previousPin) return false;
  return pin === previousPin;
};

// ตรวจสอบว่า PIN มีเลขซ้ำกันเกิน N ตัวหรือไม่

export const hasExcessiveRepeats = (
  pin: string,
  maxRepeats: number = 5
): boolean => {
  // นับจำนวนการปรากฏของแต่ละตัวเลข
  const digitCounts: Record<string, number> = {};

  for (const digit of pin.split("")) {
    digitCounts[digit] = (digitCounts[digit] || 0) + 1;

    // ถ้ามีตัวเลขใดตัวเลขหนึ่งซ้ำเกินกว่าจำนวนที่กำหนด
    if (digitCounts[digit] >= maxRepeats) {
      return true;
    }
  }

  return false;
};

/**
 * ตรวจสอบ PIN ว่าถูกต้องตามเงื่อนไขทั้งหมดหรือไม่
 *
 * @param pin PIN ที่ต้องการตรวจสอบ
 * @param previousPin PIN เก่า (ถ้ามี) เพื่อตรวจสอบว่าไม่ซ้ำกับ PIN เดิม
 * @returns ผลการตรวจสอบ {valid: boolean, message?: string}
 */
export const validatePin = (
  pin: string,
  previousPin?: string
): { valid: boolean; message?: string } => {
  // 1. ตรวจสอบว่าเป็นเลขซ้ำกันทั้งหมดหรือไม่ (เช่น 111111)
  if (hasSameDigits(pin)) {
    return {
      valid: false,
      message: "รหัส PIN ไม่สามารถใช้ตัวเลขเดียวกันทั้งหมดได้",
    };
  }

  // 2. ตรวจสอบว่าเป็นเลขเรียงกันหรือไม่ (เช่น 123456, 654321)
  if (hasSequentialDigits(pin)) {
    return {
      valid: false,
      message: "รหัส PIN ไม่สามารถใช้ตัวเลขเรียงกันได้",
    };
  }

  // 3. ตรวจสอบว่ามีรูปแบบการซ้ำกลุ่มตัวเลขหรือไม่ (เช่น 123123)
  if (hasRepeatingPattern(pin)) {
    return {
      valid: false,
      message: "รหัส PIN ไม่สามารถใช้รูปแบบตัวเลขซ้ำกันได้",
    };
  }

  // 4. ตรวจสอบว่ามีรูปแบบการเรียงกันบนแป้นพิมพ์หรือไม่ (เช่น 147258)
  if (isWeakPin(pin)) {
    return {
      valid: false,
      message: "รูปแบบ PIN นี้ง่ายเกินไป อาจไม่ปลอดภัยในการใช้งาน",
    };
  }

  // 6. ตรวจสอบว่าซ้ำกับ PIN เก่าหรือไม่
  if (isSameAsPreviousPin(pin, previousPin)) {
    return {
      valid: false,
      message: "รหัส PIN ไม่สามารถซ้ำกับรหัสเดิมได้",
    };
  }

  // 7. ตรวจสอบว่ามีเลขซ้ำกันเกิน 3 ตัวหรือไม่
  if (hasExcessiveRepeats(pin, 5)) {
    return {
      valid: false,
      message: "รหัส PIN ไม่สามารถมีตัวเลขซ้ำกันเกิน 5 ตัว",
    };
  }

  // PIN ผ่านเงื่อนไขทั้งหมด
  return {
    valid: true,
  };
};

