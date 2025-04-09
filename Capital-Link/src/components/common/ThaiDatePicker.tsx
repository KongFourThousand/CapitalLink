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
  const [needsScrollUpdate, setNeedsScrollUpdate] = useState(false);
  const [isChangingMonthOrYear, setIsChangingMonthOrYear] = useState(false);

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

  // สร้างรายการวันตามเดือนและปีที่เลือก
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // สร้างรายการวัน
  const generateDays = () => {
    const lastDay = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth());
    return Array.from({ length: lastDay }, (_, i) => i + 1);
  };
  
  // สร้างรายการปี (พ.ศ.)
  const generateYears = () => {
    const currentYear = new Date().getFullYear() + 543;
    return Array.from({ length: 100 }, (_, i) => currentYear - i);
  };

  const [days, setDays] = useState<number[]>(generateDays());
  const [years, setYears] = useState<number[]>(generateYears());

  // เมื่อโหลด component ครั้งแรก
  useEffect(() => {
    setYears(generateYears());
  }, []);

  // อัพเดทรายการวันเมื่อเดือนหรือปีเปลี่ยน
  useEffect(() => {
    setDays(generateDays());
    
    // ตรวจสอบและอัพเดท scroll ตำแหน่งของวันหลังจากอัพเดทรายการวัน
    if (isChangingMonthOrYear) {
      setTimeout(() => {
        scrollToSelected();
        setIsChangingMonthOrYear(false);
      }, 100);
    }
  }, [selectedDate.getMonth(), selectedDate.getFullYear()]);

  // เมื่อ modal เปิดขึ้น
  useEffect(() => {
    if (visible) {
      setSelectedDate(new Date(date));
      setNeedsScrollUpdate(true);
    }
  }, [visible, date]);

  // อัพเดท scroll ตำแหน่งเมื่อจำเป็น
  useEffect(() => {
    if (needsScrollUpdate && days.length > 0) {
      setTimeout(() => {
        scrollToSelected();
        setNeedsScrollUpdate(false);
      }, 300);
    }
  }, [needsScrollUpdate, days]);

  // ฟังก์ชันเลื่อน FlatList ให้ตำแหน่งที่เลือกอยู่ตรงกลาง
  const scrollToSelected = () => {
    try {
      // สำหรับวัน
      if (dayListRef.current) {
        const dayIndex = selectedDate.getDate() - 1;
        if (dayIndex >= 0 && dayIndex < days.length) {
          dayListRef.current.scrollToOffset({
            offset: dayIndex * ITEM_HEIGHT - VISIBLE_OFFSET - (EXTRA_OFFSET_ROWS * ITEM_HEIGHT),
            animated: false,
          });
        }
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
    // สร้าง Date object ใหม่จาก selectedDate ปัจจุบัน
    const newDate = new Date(selectedDate);
    
    if (type === "day") {
      // อัพเดทวันที่
      newDate.setDate(value);
    } else if (type === "month") {
      // กำหนดว่ากำลังเปลี่ยนเดือน
      setIsChangingMonthOrYear(true);
      
      // ตรวจสอบวันสุดท้ายของเดือนใหม่
      const lastDayOfSelectedMonth = getDaysInMonth(newDate.getFullYear(), value);
      const currentDay = newDate.getDate();
      
      // อัพเดทเดือน
      newDate.setMonth(value);
      
      // ถ้าวันที่ปัจจุบันมากกว่าวันสุดท้ายของเดือนใหม่ ให้กำหนดเป็นวันสุดท้ายของเดือนนั้นแทน
      if (currentDay > lastDayOfSelectedMonth) {
        newDate.setDate(lastDayOfSelectedMonth);
      }
    } else if (type === "year") {
      // กำหนดว่ากำลังเปลี่ยนปี
      setIsChangingMonthOrYear(true);
      
      // บันทึกเดือนและวันปัจจุบัน
      const currentMonth = newDate.getMonth();
      const currentDay = newDate.getDate();
      
      // ตรวจสอบว่าเป็นปีอธิกสุรทินหรือไม่สำหรับเดือนกุมภาพันธ์
      const isCurrentlyLeapYear = getDaysInMonth(newDate.getFullYear(), 1) === 29;
      
      // อัพเดทปี
      newDate.setFullYear(value - 543);
      
      // ตรวจสอบว่าปีใหม่เป็นปีอธิกสุรทินหรือไม่
      const isNewLeapYear = getDaysInMonth(value - 543, 1) === 29;
      
      // ถ้าเดือนปัจจุบันเป็นกุมภาพันธ์และวันที่เป็น 29 แต่ปีใหม่ไม่ใช่ปีอธิกสุรทิน
      if (currentMonth === 1 && currentDay === 29 && !isNewLeapYear) {
        newDate.setDate(28);
      }
      
      // สำหรับเดือนอื่นๆ ตรวจสอบว่าวันที่ยังถูกต้องในปีใหม่
      const lastDayOfMonthInNewYear = getDaysInMonth(value - 543, currentMonth);
      if (currentDay > lastDayOfMonthInNewYear) {
        newDate.setDate(lastDayOfMonthInNewYear);
      }
    }
    
    setSelectedDate(newDate);
  };

  // จับ event เมื่อเลื่อน FlatList
  const handleScroll = (event: any, type: "day" | "month" | "year") => {
    // ไม่อัพเดทถ้ากำลังเปลี่ยนเดือนหรือปีอยู่
    if (isChangingMonthOrYear) return;
    
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

  // Render item สำหรับปี
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
                  initialNumToRender={10}
                  windowSize={5}
                />
                
                {/* ตัวไฮไลท์ช่องเลือก - ใช้แบบทึบเพื่อป้องกันการเห็นช่องว่าง */}
                <View style={styles.selectionBackground} />
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
                  initialNumToRender={12}
                  windowSize={5}
                />
                
                {/* ตัวไฮไลท์ช่องเลือก */}
                <View style={styles.selectionBackground} />
                <View style={styles.selectionIndicator} />
              </View>
            </View>
            
            {/* คอลัมน์สำหรับปี */}
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
                  windowSize={5}
                />
                
                {/* ตัวไฮไลท์ช่องเลือก */}
                <View style={styles.selectionBackground} />
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
    flex: 2, // ช่องเดือนกว้างกว่า
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
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
    textAlign: "center", // จัดข้อความให้อยู่ตรงกลางเสมอ
  },
  selectedPickerItemText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // ตัวไฮไลท์พื้นหลังทึบรองรับ เพื่อป้องกันการเห็นช่องว่าง
  selectionBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    top: VISIBLE_OFFSET,
    backgroundColor: "rgba(207, 164, 89, 0.2)", // เพิ่มความทึบมากขึ้น
    pointerEvents: "none",
  },
  selectionIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    top: VISIBLE_OFFSET,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#CFA459",
    pointerEvents: "none",
  },
});

export default ThaiDatePicker;