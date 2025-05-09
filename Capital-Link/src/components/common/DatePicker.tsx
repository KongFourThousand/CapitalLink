// components/common/ThaiDatePicker.tsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-native-date-picker";

interface ThaiDatePickerProps {
  visible: boolean;
  date: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
  onSave: () => void;
}

const ThaiDatePicker: React.FC<ThaiDatePickerProps> = ({
  visible,
  date,
  onChange,
  onClose,
  onSave,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(date);

  // Sync when opened or `date` prop changes
  useEffect(() => {
    if (visible) setSelectedDate(date);
  }, [visible, date]);

  return (
    <DatePicker
      modal
      open={visible}
      date={selectedDate}
      mode="date"
      locale="th-TH"
      title="เลือกวันเกิด"
      confirmText="ตกลง"
      cancelText="ยกเลิก"
      onConfirm={(d) => {
        setSelectedDate(d);
        onChange(d);
        onSave();
      }}
      onCancel={onClose}
      minimumDate={new Date(new Date().getFullYear() - 100, 0, 1)}
      maximumDate={new Date()}
    />
  );
};

export default ThaiDatePicker;
