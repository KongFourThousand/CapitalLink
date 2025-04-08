// components/common/ThaiDatePicker.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
  StyleSheet,
  FlatList,
  ViewToken,
  TouchableWithoutFeedback,
} from "react-native";

const { width, height } = Dimensions.get("window");

// ความสูงของแต่ละรายการ (เพิ่มขนาดให้ใหญ่ขึ้น)
const ITEM_HEIGHT = 55;
// จำนวนรายการที่แสดงในสไลด์ (ต้องเป็นเลขคี่เสมอ)
const VISIBLE_ITEMS = 5;

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
  // refs สำหรับ FlatList แต่ละคอลัมน์
  const dayListRef = useRef<FlatList<number>>(null);
  const monthListRef = useRef<FlatList<string>>(null);
  const yearListRef = useRef<FlatList<number>>(null);

  // state สำหรับการแสดงค่าปัจจุบัน
  const [selectedDate, setSelectedDate] = useState(date);

  // รายการเดือนเป็นภาษาไทย
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  // สร้างรายการวันตามเดือนและปีที่เลือก
  const generateDays = (year: number, month: number) => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
  };

  // สร้างรายการปี (แสดงเป็น พ.ศ.)
  const generateYears = (startYear: number, count: number) => {
    return Array.from({ length: count }, (_, i) => startYear - i);
  };

  // กำหนด state สำหรับรายการวันและปี
  const [days, setDays] = useState(() =>
    generateDays(selectedDate.getFullYear(), selectedDate.getMonth())
  );
  const [years] = useState(() =>
    generateYears(new Date().getFullYear() + 543, 100)
  );

  // อัพเดท state เมื่อ props.date เปลี่ยน
  useEffect(() => {
    setSelectedDate(new Date(date));
  }, [date]);

  // เมื่อเดือนหรือปีเปลี่ยนให้ปรับรายการวันใหม่
  useEffect(() => {
    setDays(generateDays(selectedDate.getFullYear(), selectedDate.getMonth()));
  }, [selectedDate.getMonth(), selectedDate.getFullYear()]);

  // เมื่อ modal เปิดขึ้น ให้เลื่อนไปที่ค่าเดิมทันที
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        scrollToCurrentDate();
      }, 300);
    }
  }, [visible, selectedDate]);

  const scrollToCurrentDate = () => {
    // เลื่อนไปที่วัน
    dayListRef.current?.scrollToIndex({
      index: selectedDate.getDate() - 1,
      animated: true,
      viewPosition: 0.5,
    });
    // เลื่อนไปที่เดือน
    monthListRef.current?.scrollToIndex({
      index: selectedDate.getMonth(),
      animated: true,
      viewPosition: 0.5,
    });
    // เลื่อนไปที่ปี (พ.ศ.)
    const yearIndex = years.findIndex(
      (year) => year === selectedDate.getFullYear() + 543
    );
    if (yearIndex >= 0) {
      yearListRef.current?.scrollToIndex({
        index: yearIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  // ฟังก์ชันเลือกวัน
  const handleDayChange = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };

  // ฟังก์ชันเลือกเดือน
  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(monthIndex);
    const lastDayOfMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
    if (newDate.getDate() > lastDayOfMonth) {
      newDate.setDate(lastDayOfMonth);
    }
    setSelectedDate(newDate);
  };

  // ฟังก์ชันเลือกปี (รับค่าเป็น พ.ศ.)
  const handleYearChange = (yearTH: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(yearTH - 543);
    const lastDayOfMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
    if (newDate.getDate() > lastDayOfMonth) {
      newDate.setDate(lastDayOfMonth);
    }
    setSelectedDate(newDate);
  };

  // บันทึกค่าที่เลือก
  const handleSave = () => {
    onChange(selectedDate);
    onSave();
  };

  // ใช้ getItemLayout สำหรับ FlatList
  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  // ฟังก์ชันสำหรับตรวจจับการเลื่อน
  const handleDayScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index >= 0 && index < days.length && days[index] !== selectedDate.getDate()) {
      handleDayChange(days[index]);
    }
  };

  const handleMonthScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index >= 0 && index < 12 && index !== selectedDate.getMonth()) {
      handleMonthChange(index);
    }
  };

  const handleYearScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index >= 0 && index < years.length && years[index] !== selectedDate.getFullYear() + 543) {
      handleYearChange(years[index]);
    }
  };

  // Render item สำหรับวัน
  const renderDayItem = ({ item }: { item: number }) => {
    const selected = selectedDate.getDate() === item;
    return (
      <TouchableWithoutFeedback onPress={() => handleDayChange(item)}>
        <View style={[styles.pickerItem, selected && styles.selectedPickerItem]}>
          <Text style={[styles.pickerItemText, selected && styles.selectedPickerItemText]}>
            {item}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  // Render item สำหรับเดือน
  const renderMonthItem = ({ item, index }: { item: string; index: number }) => {
    const selected = selectedDate.getMonth() === index;
    return (
      <TouchableWithoutFeedback onPress={() => handleMonthChange(index)}>
        <View style={[styles.pickerItem, selected && styles.selectedPickerItem]}>
          <Text style={[styles.pickerItemText, selected && styles.selectedPickerItemText]}>
            {item}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  // Render item สำหรับปี (แสดง พ.ศ.)
  const renderYearItem = ({ item }: { item: number }) => {
    const selected = selectedDate.getFullYear() + 543 === item;
    return (
      <TouchableWithoutFeedback onPress={() => handleYearChange(item)}>
        <View style={[styles.pickerItem, selected && styles.selectedPickerItem]}>
          <Text style={[styles.pickerItemText, selected && styles.selectedPickerItemText]}>
            {item}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <Text style={styles.cancelText}>ยกเลิก</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>เลือกวันเกิด</Text>
            <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
              <Text style={styles.confirmText}>ตกลง</Text>
            </TouchableOpacity>
          </View>

          {/* แสดงวันที่ที่เลือกขณะนี้ */}
          <View style={styles.currentDateContainer}>
            <Text style={styles.currentDateText}>
              {`${selectedDate.getDate()} ${thaiMonths[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`}
            </Text>
          </View>

          <View style={styles.spinnerContainer}>
            {/* คอลัมน์สำหรับวันที่ */}
            <View style={styles.spinnerColumnContainer}>
              <Text style={styles.spinnerLabel}>วันที่</Text>
              <View style={styles.spinnerWrapper}>
                <FlatList
                  ref={dayListRef}
                  data={days}
                  renderItem={renderDayItem}
                  keyExtractor={(item) => `day-${item}`}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  getItemLayout={getItemLayout}
                  contentContainerStyle={styles.flatListContent}
                  onMomentumScrollEnd={handleDayScroll}
                  initialNumToRender={20}
                />
                <View style={styles.selectionIndicator} />
              </View>
            </View>

            {/* คอลัมน์สำหรับเดือน */}
            <View style={styles.spinnerColumnContainer}>
              <Text style={styles.spinnerLabel}>เดือน</Text>
              <View style={styles.spinnerWrapper}>
                <FlatList
                  ref={monthListRef}
                  data={thaiMonths}
                  renderItem={renderMonthItem}
                  keyExtractor={(item) => `month-${item}`}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  getItemLayout={getItemLayout}
                  contentContainerStyle={styles.flatListContent}
                  onMomentumScrollEnd={handleMonthScroll}
                  initialNumToRender={12}
                />
                <View style={styles.selectionIndicator} />
              </View>
            </View>

            {/* คอลัมน์สำหรับปี (พ.ศ.) */}
            <View style={styles.spinnerColumnContainer}>
              <Text style={styles.spinnerLabel}>ปี (พ.ศ.)</Text>
              <View style={styles.spinnerWrapper}>
                <FlatList
                  ref={yearListRef}
                  data={years}
                  renderItem={renderYearItem}
                  keyExtractor={(item) => `year-${item}`}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  getItemLayout={getItemLayout}
                  contentContainerStyle={styles.flatListContent}
                  onMomentumScrollEnd={handleYearScroll}
                  initialNumToRender={20}
                />
                <View style={styles.selectionIndicator} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
    maxHeight: height * 0.7,
    minHeight: height * 0.55,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#CFA459",
  },
  headerButton: {
    padding: 10,
    minWidth: 60,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  cancelText: {
    fontSize: 18,
    color: "#999",
    fontWeight: "500",
  },
  confirmText: {
    fontSize: 18,
    color: "#CFA459",
    fontWeight: "600",
    textAlign: "right",
  },
  currentDateContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    paddingVertical: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  currentDateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  spinnerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  spinnerColumnContainer: {
    flex: 1,
    marginHorizontal: 6,
  },
  spinnerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  spinnerWrapper: {
    height: ITEM_HEIGHT * 5,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
    position: "relative",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  flatListContent: {
    paddingVertical: ITEM_HEIGHT * 2,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 4,
  },
  selectedPickerItem: {
    backgroundColor: "#CFA459",
  },
  pickerItemText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "500",
  },
  selectedPickerItemText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectionIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    top: ITEM_HEIGHT * 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#CFA459",
    backgroundColor: "rgba(207, 164, 89, 0.1)",
    pointerEvents: "none",
  },
});

export default ThaiDatePicker;