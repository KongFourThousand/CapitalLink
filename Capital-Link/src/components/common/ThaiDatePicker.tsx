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
  TouchableWithoutFeedback,
} from "react-native";

const { width, height } = Dimensions.get("window");
const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 5;
const CENTER_ITEM_INDEX = Math.floor(VISIBLE_ITEMS / 2); // สำหรับ 5 รายการ, center index = 2
const EXTRA_OFFSET_ROWS = -2;
const VISIBLE_OFFSET = ITEM_HEIGHT * CENTER_ITEM_INDEX;

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
  // refs สำหรับ FlatList ของวัน, เดือน, ปี
  const dayListRef = useRef<FlatList<number>>(null);
  const monthListRef = useRef<FlatList<string>>(null);
  const yearListRef = useRef<FlatList<number>>(null);

  // Local state สำหรับ selectedDate; เริ่มต้นจาก props.date
  const [selectedDate, setSelectedDate] = useState(new Date(date));
  const [isFirstRender, setIsFirstRender] = useState(true);

  // รายการเดือนภาษาไทย
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

  // Memoized data เพื่อลดการคำนวณซ้ำ
  const useMemoizedData = (generator: Function, deps: any[]) => {
    const [data, setData] = useState<any[]>([]);
    
    useEffect(() => {
      setData(generator());
    }, deps);
    
    return data;
  };

  // ฟังก์ชันสร้างรายการวันตามเดือนและปีที่เลือก
  const generateDays = () => {
    const lastDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    ).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
  };

  // ฟังก์ชันสร้างรายการปี (แสดงเป็น พ.ศ.)
  const generateYears = () => {
    const currentYear = new Date().getFullYear() + 543;
    return Array.from({ length: 100 }, (_, i) => currentYear - i);
  };

  const days = useMemoizedData(generateDays, [selectedDate.getMonth(), selectedDate.getFullYear()]);
  const years = useMemoizedData(generateYears, []);

  // เมื่อ modal เปิดขึ้นหรือ props.date เปลี่ยน ให้รีเซ็ต selectedDate และเลื่อน FlatList ไปที่ตัวเลือกที่ถูกเลือก
  useEffect(() => {
    if (visible) {
      setSelectedDate(new Date(date));
      setIsFirstRender(true);
    }
  }, [visible, date]);

  // เมื่อข้อมูลพร้อม ให้เลื่อนไปที่ตำแหน่งที่เลือก
  useEffect(() => {
    if (visible && isFirstRender && days.length > 0 && years.length > 0) {
      setTimeout(() => {
        scrollToSelected();
        setIsFirstRender(false);
      }, 300);
    }
  }, [visible, isFirstRender, days.length, years.length]);

  // ฟังก์ชันเลื่อน FlatList ให้อยู่ในตำแหน่งที่เลือก (ปรับ offset ด้วย EXTRA_OFFSET_ROWS)
  const scrollToSelected = () => {
    try {
      // สำหรับวัน
      if (dayListRef.current) {
        const dayIndex = selectedDate.getDate() - 1;
        dayListRef.current.scrollToOffset({
          offset: dayIndex * ITEM_HEIGHT - VISIBLE_OFFSET - (EXTRA_OFFSET_ROWS * ITEM_HEIGHT),
          animated: false,
        });
      }
      // สำหรับเดือน
      if (monthListRef.current) {
        const monthIndex = selectedDate.getMonth();
        monthListRef.current.scrollToOffset({
          offset: monthIndex * ITEM_HEIGHT - VISIBLE_OFFSET - (EXTRA_OFFSET_ROWS * ITEM_HEIGHT),
          animated: false,
        });
      }
      // สำหรับปี (แสดงเป็น พ.ศ.)
      if (yearListRef.current) {
        const yearIndex = years.findIndex(
          (year) => year === selectedDate.getFullYear() + 543
        );
        if (yearIndex >= 0) {
          yearListRef.current.scrollToOffset({
            offset: yearIndex * ITEM_HEIGHT - VISIBLE_OFFSET - (EXTRA_OFFSET_ROWS * ITEM_HEIGHT),
            animated: false,
          });
        }
      }
    } catch (error) {
      console.log("Error scrolling to selected date", error);
    }
  };

  // ฟังก์ชันอัปเดทวันที่เมื่อมีการเลือกจาก FlatList
  const updateDate = (type: "day" | "month" | "year", value: number) => {
    const newDate = new Date(selectedDate);
    if (type === "day") {
      newDate.setDate(value);
    } else if (type === "month") {
      newDate.setMonth(value);
      const lastDay = new Date(newDate.getFullYear(), value + 1, 0).getDate();
      if (newDate.getDate() > lastDay) {
        newDate.setDate(lastDay);
      }
    } else if (type === "year") {
      newDate.setFullYear(value - 543);
      const lastDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
      if (newDate.getDate() > lastDay) {
        newDate.setDate(lastDay);
      }
    }
    setSelectedDate(newDate);
  };

  // จับ event เมื่อเลื่อน FlatList - ใช้ debounced สำหรับการเลื่อนเพื่อลดการเรียกใช้งานมากเกินไป
  const handleScroll = (event: any, type: "day" | "month" | "year") => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (type === "day" && index >= 0 && index < days.length) {
      updateDate("day", days[index]);
    } else if (type === "month" && index >= 0 && index < thaiMonths.length) {
      updateDate("month", index);
    } else if (type === "year" && index >= 0 && index < years.length) {
      updateDate("year", years[index]);
    }
  };

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  // Render item สำหรับวัน
  const renderDayItem = ({ item }: { item: number }) => {
    const isSelected = selectedDate.getDate() === item;
    return (
      <TouchableWithoutFeedback onPress={() => updateDate("day", item)}>
        <View style={[styles.pickerItem, styles.pickerItemWide, isSelected && styles.selectedPickerItem]}>
          <Text style={[styles.pickerItemText, isSelected && styles.selectedPickerItemText]}>{item}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  // Render item สำหรับเดือน
  const renderMonthItem = ({ item, index }: { item: string; index: number }) => {
    const isSelected = selectedDate.getMonth() === index;
    return (
      <TouchableWithoutFeedback onPress={() => updateDate("month", index)}>
        <View style={[styles.pickerItem, styles.monthItem, isSelected && styles.selectedPickerItem]}>
          <Text style={[styles.pickerItemText, isSelected && styles.selectedPickerItemText]}>{item}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  // Render item สำหรับปี (แสดงเป็น พ.ศ.)
  const renderYearItem = ({ item }: { item: number }) => {
    const isSelected = selectedDate.getFullYear() + 543 === item;
    return (
      <TouchableWithoutFeedback onPress={() => updateDate("year", item)}>
        <View style={[styles.pickerItem, styles.yearItem, isSelected && styles.selectedPickerItem]}>
          <Text style={[styles.pickerItemText, isSelected && styles.selectedPickerItemText]}>{item}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  // เมื่อกดตกลง ส่งค่าที่เลือกกลับไปยัง parent component
  const handleSave = () => {
    onChange(selectedDate);
    onSave();
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
          <View style={styles.currentDateContainer}>
            <Text style={styles.currentDateText}>
              {`${selectedDate.getDate()} ${thaiMonths[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`}
            </Text>
          </View>
          <View style={styles.spinnerContainer}>
            {/* คอลัมน์สำหรับวัน */}
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
                  onMomentumScrollEnd={(e) => handleScroll(e, "day")}
                  initialNumToRender={10} // ลดจำนวนการ render ครั้งแรก
                  maxToRenderPerBatch={5} // ลดจำนวนการ render ต่อรอบ
                  windowSize={5} // ลดขนาดหน้าต่างการ render
                  removeClippedSubviews={true} // ลบ component ที่ไม่อยู่ในหน้าจอ
                />
                <View style={styles.selectionIndicator} />
              </View>
            </View>
            {/* คอลัมน์สำหรับเดือน */}
            <View style={[styles.spinnerColumnContainer, styles.monthColumn]}>
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
                  onMomentumScrollEnd={(e) => handleScroll(e, "month")}
                  initialNumToRender={5}
                  maxToRenderPerBatch={4}
                  windowSize={5}
                  removeClippedSubviews={true}
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
                  onMomentumScrollEnd={(e) => handleScroll(e, "year")}
                  initialNumToRender={10}
                  maxToRenderPerBatch={5}
                  windowSize={5}
                  removeClippedSubviews={true}
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
    maxHeight: height * 0.8,
    minHeight: height * 0.6,
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
    marginHorizontal: 4,
    alignItems: "center",
  },
  monthColumn: {
    flex: 2, // เพิ่มขนาดคอลัมน์เดือนให้กว้างขึ้น
  },
  spinnerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  spinnerWrapper: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: "100%",
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
    paddingVertical: VISIBLE_OFFSET,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 4,
  },
  pickerItemWide: {
    minWidth: 90,
  },
  monthItem: {
    minWidth: 140, // เพิ่มความกว้างของแต่ละรายการเดือน
    paddingHorizontal: 2, // ลด padding เพื่อให้ข้อความยาวขึ้นได้
  },
  yearItem: {
    minWidth: 100,
  },
  selectedPickerItem: {
    backgroundColor: "#CFA459",
  },
  pickerItemText: {
    fontSize: 18, // ลดขนาดตัวอักษรลงเล็กน้อยเพื่อให้เข้ากับพื้นที่
    color: "#333",
    fontWeight: "500",
    textAlign: "center", // จัดข้อความให้อยู่ตรงกลางเสมอ
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
    top: VISIBLE_OFFSET, // จะอยู่ตรงกลาง (แถวที่ 3)
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#CFA459",
    backgroundColor: "rgba(207, 164, 89, 0.1)",
    pointerEvents: "none",
  },
});

export default ThaiDatePicker;