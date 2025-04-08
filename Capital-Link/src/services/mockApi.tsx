// mockApi.ts
// ไฟล์นี้เอาไว้รวมฟังก์ชัน mock ที่เลียนแบบการเรียก API จริง

/**
 * mockRequestOtp:
 *  - จำลองการขอ OTP ไปยังเบอร์โทรศัพท์
 *  - หน่วงเวลาเล็กน้อย (setTimeout) เพื่อให้เหมือนการเรียก API จริง
 *  - คืนค่ารหัส OTP สมมุติกลับมา (ในที่นี้ใช้ "123456")
 */
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
  export async function mockVerifyOtp(phoneNumber: string, otpCode: string): Promise<boolean> {
    console.log("Mock: กำลังตรวจสอบ OTP:", otpCode, "ของเบอร์:", phoneNumber);
    // หน่วง 1 วินาที
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    // ตัวอย่าง: ให้ผ่านก็ต่อเมื่อ otpCode === "123456"
    return otpCode === "123456";
  }
  