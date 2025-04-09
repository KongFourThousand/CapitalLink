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
} from "react-native";

const { width, height } = Dimensions.get("window");
const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 5;
const CENTER_ITEM_INDEX = Math.floor(VISIBLE_ITEMS / 2); // หาตำแหน่งกลาง (2 สำหรับ VISIBLE_ITEMS = 5)

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

  // ใช้ local state สำหรับ selectedDate; เริ่มจาก props.date
  const [selectedDate, setSelectedDate] = useState(new Date(date));
  const [hasInitialScroll, setHasInitialScroll] = useState(false);
  
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
  const [days, setDays] = useState<number[]>([]);
  // สร้างรายการปี (พ.ศ.)
  const [years, setYears] = useState<number[]>([]);

  // สร้างรายการวันเมื่อเดือนหรือปีเปลี่ยน
  useEffect(() => {
    const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const newDays = Array.from({ length: lastDay }, (_, i) => i + 1);
    setDays(newDays);
  }, [selectedDate.getMonth(), selectedDate.getFullYear()]);

  // สร้างรายการปี (พ.ศ.) เมื่อ component โหลด
  useEffect(() => {
    const currentYear = new Date().getFullYear() + 543;
    const newYears = Array.from({ length: 100 }, (_, i) => currentYear - i);
    setYears(newYears);
  }, []);

  // เมื่อ modal เปิดขึ้น อัพเดท selectedDate และเลื่อนไปที่วันนั้น
  useEffect(() => {
    if (visible) {
      setSelectedDate(new Date(date));
      setHasInitialScroll(false);
    }
  }, [visible, date]);

  // เมื่อ modal เปิดอยู่และยังไม่ได้เลื่อนตำแหน่ง ให้เลื่อนไปที่ตำแหน่งที่เลือก
  useEffect(() => {
    if (visible && !hasInitialScroll && days.length > 0 && years.length > 0) {
      // รอให้ FlatList พร้อมก่อนเลื่อน
      setTimeout(() => {
        scrollToSelected();
        setHasInitialScroll(true);
      }, 300);
    }
  }, [visible, hasInitialScroll, days, years]);

  // เลื่อน FlatList ไปที่วันที่เลือก เพื่อให้อยู่ตรงกลาง
  const scrollToSelected = () => {
    try {
      // เลื่อนไปที่วัน
      if (dayListRef.current) {
        dayListRef.current.scrollToOffset({
          offset: (selectedDate.getDate() - 1 - CENTER_ITEM_INDEX) * ITEM_HEIGHT,
          animated: false,
        });
      }
      
      // เลื่อนไปที่เดือน
      if (monthListRef.current) {
        monthListRef.current.scrollToOffset({
          offset: (selectedDate.getMonth() - CENTER_ITEM_INDEX) * ITEM_HEIGHT,
          animated: false,
        });
      }
      
      // เลื่อนไปที่ปี (พ.ศ.)
      const yearIndex = years.findIndex(year => year === selectedDate.getFullYear() + 543);
      if (yearIndex >= 0 && yearListRef.current) {
        yearListRef.current.scrollToOffset({
          offset: (yearIndex - CENTER_ITEM_INDEX) * ITEM_HEIGHT,
          animated: false,
        });
      }
    } catch (error) {
      console.log("Error scrolling to selected date", error);
    }
  };

  // แนบตัวจัดการกับการ scroll เสร็จสิ้น
  const handleScroll = (event: any, type: 'day' | 'month' | 'year') => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const indexFloat = offsetY / ITEM_HEIGHT;
    const index = Math.round(indexFloat) + CENTER_ITEM_INDEX;

    if (type === 'day' && index >= 0 && index < days.length) {
      updateDate('day', days[index]);
    } else if (type === 'month' && index >= 0 && index < 12) {
      updateDate('month', index);
    } else if (type === 'year' && index >= 0 && index < years.length) {
      updateDate('year', years[index]);
    }
  };

  // อัพเดทวันที่เมื่อมีการเลือกวัน เดือน หรือปี
  const updateDate = (type: 'day' | 'month' | 'year', value: number) => {
    const newDate = new Date(selectedDate);
    
    if (type === 'day') {
      newDate.setDate(value);
    } else if (type === 'month') {
      newDate.setMonth(value);
      
      // ตรวจสอบว่าวันที่ยังถูกต้องหลังจากเปลี่ยนเดือน
      const lastDayOfNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
      if (newDate.getDate() > lastDayOfNewMonth) {
        newDate.setDate(lastDayOfNewMonth);
      }
    } else if (type === 'year') {
      // แปลงจาก พ.ศ. เป็น ค.ศ.
      newDate.setFullYear(value - 543);
      
      // ตรวจสอบวันที่ในกรณีปีอธิกสุรทิน
      const lastDayOfNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
      if (newDate.getDate() > lastDayOfNewMonth) {
        newDate.setDate(lastDayOfNewMonth);
      }
    }
    
    setSelectedDate(newDate);
  };

  // บันทึกการเปลี่ยนแปลงและปิด modal
  const handleSave = () => {
    onChange(selectedDate);
    onSave();
  };

  // เลื่อนไปที่วันที่ตรงกลาง
  const scrollToMiddle = (type: 'day' | 'month' | 'year') => {
    if (type === 'day') {
      const index = days.findIndex(day => day === selectedDate.getDate());
      if (index >= 0 && dayListRef.current) {
        dayListRef.current.scrollToOffset({
          offset: (index - CENTER_ITEM_INDEX) * ITEM_HEIGHT,
          animated: true,
        });
      }
    } else if (type === 'month') {
      if (monthListRef.current) {
        monthListRef.current.scrollToOffset({
          offset: (selectedDate.getMonth() - CENTER_ITEM_INDEX) * ITEM_HEIGHT,
          animated: true,
        });
      }
    } else if (type === 'year') {
      const yearIndex = years.findIndex(year => year === selectedDate.getFullYear() + 543);
      if (yearIndex >= 0 && yearListRef.current) {
        yearListRef.current.scrollToOffset({
          offset: (yearIndex - CENTER_ITEM_INDEX) * ITEM_HEIGHT,
          animated: true,
        });
      }
    }
  };

  // รูปแบบรายการวัน
  const renderDayItem = ({ item }: { item: number }) => {
    const isSelected = selectedDate.getDate() === item;
    return (
      <View style={[styles.pickerItem, isSelected && styles.selectedPickerItem]}>
        <Text style={[styles.pickerItemText, isSelected && styles.selectedPickerItemText]}>
          {item}
        </Text>
      </View>
    );
  };

  // รูปแบบรายการเดือน
  const renderMonthItem = ({ item, index }: { item: string; index: number }) => {
    const isSelected = selectedDate.getMonth() === index;
    return (
      <View style={[styles.pickerItem, styles.monthItem, isSelected && styles.selectedPickerItem]}>
        <Text style={[styles.pickerItemText, isSelected && styles.selectedPickerItemText]}>
          {item}
        </Text>
      </View>
    );
  };

  // รูปแบบรายการปี
  const renderYearItem = ({ item }: { item: number }) => {
    const isSelected = selectedDate.getFullYear() + 543 === item;
    return (
      <View style={[styles.pickerItem, isSelected && styles.selectedPickerItem]}>
        <Text style={[styles.pickerItemText, isSelected && styles.selectedPickerItemText]}>
          {item}
        </Text>
      </View>
    );
  };

  // สร้างรายการเพิ่มเติมด้านบนและด้านล่างเพื่อให้สามารถเลื่อนได้
  const extraItems = Array(CENTER_ITEM_INDEX).fill(null);

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
            {/* คอลัมน์วันที่ */}
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
                  contentContainerStyle={styles.flatListContent}
                  onMomentumScrollEnd={(e) => handleScroll(e, 'day')}
                  initialNumToRender={31}
                  ListHeaderComponent={<View style={{ height: CENTER_ITEM_INDEX * ITEM_HEIGHT }} />}
                  ListFooterComponent={<View style={{ height: CENTER_ITEM_INDEX * ITEM_HEIGHT }} />}
                />
                
                {/* แถบเลือกตรงกลาง */}
                <View style={styles.selectionIndicator} />
                
                {/* ปุ่มเลือกกดตรง highlight */}
                <TouchableOpacity 
                  style={styles.centeredTouchable}
                  activeOpacity={0.6}
                  onPress={() => scrollToMiddle('day')}
                />
              </View>
            </View>
            
            {/* คอลัมน์เดือน */}
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
                  contentContainerStyle={styles.flatListContent}
                  onMomentumScrollEnd={(e) => handleScroll(e, 'month')}
                  initialNumToRender={12}
                  ListHeaderComponent={<View style={{ height: CENTER_ITEM_INDEX * ITEM_HEIGHT }} />}
                  ListFooterComponent={<View style={{ height: CENTER_ITEM_INDEX * ITEM_HEIGHT }} />}
                />
                
                {/* แถบเลือกตรงกลาง */}
                <View style={styles.selectionIndicator} />
                
                {/* ปุ่มเลือกกดตรง highlight */}
                <TouchableOpacity
                  style={styles.centeredTouchable}
                  activeOpacity={0.6}
                  onPress={() => scrollToMiddle('month')}
                />
              </View>
            </View>
            
            {/* คอลัมน์ปี */}
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
                  contentContainerStyle={styles.flatListContent}
                  onMomentumScrollEnd={(e) => handleScroll(e, 'year')}
                  initialNumToRender={20}
                  ListHeaderComponent={<View style={{ height: CENTER_ITEM_INDEX * ITEM_HEIGHT }} />}
                  ListFooterComponent={<View style={{ height: CENTER_ITEM_INDEX * ITEM_HEIGHT }} />}
                />
                
                {/* แถบเลือกตรงกลาง */}
                <View style={styles.selectionIndicator} />
                
                {/* ปุ่มเลือกกดตรง highlight */}
                <TouchableOpacity
                  style={styles.centeredTouchable}
                  activeOpacity={0.6}
                  onPress={() => scrollToMiddle('year')}
                />
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
  // เพิ่มความกว้างให้คอลัมน์เดือน
  monthColumn: {
    flex: 1.6, // ให้คอลัมน์เดือนกว้างกว่าวันที่และปี
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
    width: '100%',
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
    // ไม่ต้องใส่ padding เพราะเราใช้ ListHeaderComponent และ ListFooterComponent แทน
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 4,
  },
  // ปรับช่องเดือนให้กว้างพอสำหรับแสดงทุกตัวอักษร
  monthItem: {
    paddingHorizontal: 0, // ลด padding เพื่อให้มีพื้นที่มากขึ้น
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
    top: ITEM_HEIGHT * CENTER_ITEM_INDEX,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#CFA459", 
    backgroundColor: "rgba(207, 164, 89, 0.1)",
    pointerEvents: "none",
  },
  // ปุ่มที่ซ่อนไว้สำหรับการกดเลือกตรง highlight
  centeredTouchable: {
    position: "absolute",
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    top: ITEM_HEIGHT * CENTER_ITEM_INDEX,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
});

export default ThaiDatePicker;