// components/common/ThaiDatePicker.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
// เปลี่ยนจาก 5 แถว เป็น 3 แถว
const ITEM_HEIGHT = 70; // เพิ่มความสูงของแต่ละรายการ
const VISIBLE_ITEMS = 3; // ลดจำนวนรายการที่มองเห็นจาก 5 เป็น 3
const VISIBLE_OFFSET = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2); // ปรับ offset ให้เป็นกลางของ 3 รายการ

interface ThaiDatePickerProps {
  visible: boolean;
  date: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
  onSave: () => void;
}

const ThaiDatePicker: React.FC<ThaiDatePickerProps> = ({ visible, date, onChange, onClose, onSave }) => {
  const [selectedDate, setSelectedDate] = useState(new Date(date));
  const dayRef = useRef<FlatList>(null);
  const monthRef = useRef<FlatList>(null);
  const yearRef = useRef<FlatList>(null);

  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ];

  const getDays = () => {
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() + 543 - i);

  useEffect(() => {
    setSelectedDate(new Date(date));
  }, [visible, date]);

  useEffect(() => {
    if (visible) {
      // ให้เลื่อนไปยังวันที่ เดือน และปีที่เลือกเมื่อ modal แสดงขึ้น
      scrollToSelected();
    }
  }, [visible, selectedDate]);

  const scrollToSelected = () => {
    // เลื่อนไปยังวันที่เลือก
    if (dayRef.current) {
      const dayIndex = selectedDate.getDate() - 1;
      dayRef.current.scrollToOffset({
        offset: dayIndex * ITEM_HEIGHT,
        animated: false
      });
    }
    
    // เลื่อนไปยังเดือนที่เลือก
    if (monthRef.current) {
      const monthIndex = selectedDate.getMonth();
      monthRef.current.scrollToOffset({
        offset: monthIndex * ITEM_HEIGHT,
        animated: false
      });
    }
    
    // เลื่อนไปยังปีที่เลือก
    if (yearRef.current) {
      const yearIndex = years.indexOf(selectedDate.getFullYear() + 543);
      if (yearIndex >= 0) {
        yearRef.current.scrollToOffset({
          offset: yearIndex * ITEM_HEIGHT,
          animated: false
        });
      }
    }
  };

  const updateDate = (type: "day" | "month" | "year", value: number) => {
    const newDate = new Date(selectedDate);
    if (type === "day") newDate.setDate(value);
    if (type === "month") newDate.setMonth(value);
    if (type === "year") newDate.setFullYear(value - 543);
    setSelectedDate(newDate);
  };

  const handleSave = () => {
    onChange(selectedDate);
    onSave();
  };

  const renderItem = (item: any, selected: boolean) => (
    <View style={[styles.item, selected && styles.itemSelected]}>
      <Text style={[styles.itemText, selected && styles.itemTextSelected]}>{item}</Text>
    </View>
  );

  const days = getDays();

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>เลือกวันเกิด</Text>
          
          <View style={styles.datePreview}>
            <Text style={styles.previewText}>
              {`${selectedDate.getDate()} ${thaiMonths[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`}
            </Text>
          </View>
          
          <View style={styles.pickerRow}>
            {/* คอลัมน์วันที่ */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>วันที่</Text>
              <View style={styles.picker}>
                <FlatList
                  ref={dayRef}
                  data={days}
                  keyExtractor={(item) => `day-${item}`}
                  renderItem={({ item }) => renderItem(item, item === selectedDate.getDate())}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
                  contentContainerStyle={{ paddingVertical: VISIBLE_OFFSET }}
                  onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                    if (index >= 0 && index < days.length) {
                      updateDate("day", days[index]);
                    }
                  }}
                />
                {/* ตัวไฮไลท์ */}
                <View style={styles.selectionIndicator} />
              </View>
            </View>
            
            {/* คอลัมน์เดือน */}
            <View style={[styles.pickerContainer, styles.monthContainer]}>
              <Text style={styles.pickerLabel}>เดือน</Text>
              <View style={styles.picker}>
                <FlatList
                  ref={monthRef}
                  data={thaiMonths}
                  keyExtractor={(item) => `month-${item}`}
                  renderItem={({ item, index }) => renderItem(item, index === selectedDate.getMonth())}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
                  contentContainerStyle={{ paddingVertical: VISIBLE_OFFSET }}
                  onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                    if (index >= 0 && index < thaiMonths.length) {
                      updateDate("month", index);
                    }
                  }}
                />
                {/* ตัวไฮไลท์ */}
                <View style={styles.selectionIndicator} />
              </View>
            </View>
            
            {/* คอลัมน์ปี */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>ปี (พ.ศ.)</Text>
              <View style={styles.picker}>
                <FlatList
                  ref={yearRef}
                  data={years}
                  keyExtractor={(item) => `year-${item}`}
                  renderItem={({ item }) => renderItem(item, item === selectedDate.getFullYear() + 543)}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
                  contentContainerStyle={{ paddingVertical: VISIBLE_OFFSET }}
                  onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                    if (index >= 0 && index < years.length) {
                      updateDate("year", years[index]);
                    }
                  }}
                />
                {/* ตัวไฮไลท์ */}
                <View style={styles.selectionIndicator} />
              </View>
            </View>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>ยกเลิก</Text>
            </TouchableOpacity>
            <LinearGradient
              colors={["#c49a45", "#d4af71", "#e0c080"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.confirmGradient}
            >
              <TouchableOpacity style={styles.confirmButton} onPress={handleSave}>
                <Text style={styles.confirmText}>ตกลง</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%", // เพิ่มความกว้าง
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24, // เพิ่ม padding
    alignItems: "center",
  },
  title: {
    fontSize: 22, // เพิ่มขนาดตัวอักษร
    fontWeight: "bold",
    color: "#a2754c",
    marginBottom: 16,
  },
  datePreview: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  previewText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    width: "100%",
  },
  pickerContainer: {
    flex: 1,
    alignItems: "center",
  },
  monthContainer: {
    flex: 1.5, // ให้ส่วนของเดือนกว้างกว่า
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  picker: {
    width: "95%",
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative", // สำหรับวาง selectionIndicator
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  itemText: {
    fontSize: 18, // เพิ่มขนาดตัวอักษร
    color: "#333",
    textAlign: "center",
  },
  itemSelected: {
    backgroundColor: "#CFA459",
  },
  itemTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectionIndicator: {
    position: "absolute",
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#CFA459",
    backgroundColor: "rgba(207, 164, 89, 0.1)",
    pointerEvents: "none",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14, // เพิ่มความสูงของปุ่ม
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  confirmGradient: {
    flex: 1,
    borderRadius: 12,
    marginLeft: 10,
  },
  confirmButton: {
    paddingVertical: 14, // เพิ่มความสูงของปุ่ม
    alignItems: "center",
  },
  confirmText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
});

export default ThaiDatePicker;