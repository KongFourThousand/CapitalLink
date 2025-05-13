import React from "react";
import { Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  configureFonts,
  DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

interface DatePickerProps {
  visible: boolean;
  date: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}
// const pickerTheme = {
//   ...DefaultTheme,
//   roundness: 2,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: "#CFA459",
//     onSurface: "#000000",
//     surfaceVariant: "#FFFFFF",
//   },
// };

const pickerTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#CFA459",
    onPrimary: "#FFFFFF",
    surface: "#F2F2F2",
    backdrop: "rgba(0,0,0,0.5)",
  },
  components: {
    Button: {
      defaultProps: {
        // ปิด uppercase และปรับ style เฉพาะ label ของปุ่ม
        uppercase: false,
        textColor: "CFA459", // กำหนดสีข้อความบนปุ่ม
        labelStyle: {
          fontSize: 30,
          fontWeight: "700",
          color: "#CFA459",
        },
      },
    },
  },
};
export default function DatePicker({
  visible,
  date,
  onChange,
  onClose,
}: DatePickerProps) {
  return (
    <PaperProvider theme={pickerTheme}>
      <DatePickerModal
        locale="th"
        mode="single"
        visible={visible}
        // ปิด modal ทันทีเมื่อกดยกเลิก
        onDismiss={onClose}
        date={date}
        // เมื่อกดตกลง จะได้ object { date: Date }
        onConfirm={({ date }) => {
          onClose(); // ① ปิด modal ก่อน
          onChange(date); // ② ย้อนวันที่ขึ้นไปให้ parent
        }}
        label="เลือกวันเกิด" // หัวเรื่อง
        saveLabel="ตกลง" // ปุ่มบันทึก
        animationType="slide" // หรือ "fade" ตามชอบ
      />
    </PaperProvider>
  );
}
