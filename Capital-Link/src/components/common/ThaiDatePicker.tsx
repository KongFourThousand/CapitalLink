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
} from "react-native";

const { width } = Dimensions.get("window");

interface ThaiDatePickerProps {
  visible: boolean;
  date: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
  onSave: () => void;
}

// ความสูงของแต่ละรายการในสไลด์
const ITEM_HEIGHT = 50;
// จำนวนรายการที่แสดงในสไลด์ (ต้องเป็นเลขคี่เสมอ)
const VISIBLE_ITEMS = 5;

const ThaiDatePicker: React.FC<ThaiDatePickerProps> = ({
  visible,
  date,
  onChange,
  onClose,
  onSave,
}) => {
  // สร้าง refs สำหรับแต่ละ FlatList
  const dayListRef = useRef<FlatList>(null);
  const monthListRef = useRef<FlatList>(null);
  const yearListRef = useRef<FlatList>(null);

  // เดือนไทย
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

  // สร้างรายการวัน
  const generateDays = (year: number, month: number) => {
    const lastDay = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
  };

  // สร้างรายการปี (พ.ศ.)
  const generateYears = (startYear: number, count: number) => {
    return Array.from({ length: count }, (_, i) => startYear - i);
  };

  // State สำหรับรายการต่างๆ
  const [days, setDays] = useState(() => 
    generateDays(date.getFullYear(), date.getMonth())
  );
  const [years] = useState(() => 
    generateYears(new Date().getFullYear() + 543, 80)
  );

  // อัพเดทรายการวันเมื่อเดือนหรือปีเปลี่ยน
  useEffect(() => {
    setDays(generateDays(date.getFullYear(), date.getMonth()));
  }, [date.getMonth(), date.getFullYear()]);

  // เลื่อนไปที่ค่าปัจจุบันเมื่อเปิด modal
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        scrollToCurrentDate();
      }, 200);
    }
  }, [visible]);

  const scrollToCurrentDate = () => {
    // เลื่อนไปที่วันที่
    dayListRef.current?.scrollToIndex({
      index: date.getDate() - 1,
      animated: false,
      viewPosition: 0.5,
    });

    // เลื่อนไปที่เดือน
    monthListRef.current?.scrollToIndex({
      index: date.getMonth(),
      animated: false,
      viewPosition: 0.5,
    });

    // เลื่อนไปที่ปี
    const yearIndex = years.findIndex(year => year === date.getFullYear() + 543);
    if (yearIndex >= 0) {
      yearListRef.current?.scrollToIndex({
        index: yearIndex,
        animated: false,
        viewPosition: 0.5,
      });
    }
  };

  // จัดการเมื่อเลือกวันที่
  const handleDayChange = (day: number) => {
    const newDate = new Date(date);
    newDate.setDate(day);
    onChange(newDate);
  };

  // จัดการเมื่อเลือกเดือน
  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(date);
    newDate.setMonth(monthIndex);
    
    // ตรวจสอบว่าวันที่ยังอยู่ในช่วงที่ถูกต้องหรือไม่
    const lastDayOfMonth = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0
    ).getDate();
    
    if (newDate.getDate() > lastDayOfMonth) {
      newDate.setDate(lastDayOfMonth);
    }
    
    onChange(newDate);
  };

  // จัดการเมื่อเลือกปี
  const handleYearChange = (yearTH: number) => {
    const newDate = new Date(date);
    newDate.setFullYear(yearTH - 543);
    
    // ตรวจสอบกรณีปีอธิกสุรทิน (29 ก.พ.)
    const lastDayOfMonth = new Date(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      0
    ).getDate();
    
    if (newDate.getDate() > lastDayOfMonth) {
      newDate.setDate(lastDayOfMonth);
    }
    
    onChange(newDate);
  };

  // ฟังก์ชันช่วยในการเลื่อน
  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  // สร้าง viewable item changed callbacks
  const onViewableItemsChangedDay = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[Math.floor(VISIBLE_ITEMS / 2)]) {
      const centerItem = viewableItems[Math.floor(VISIBLE_ITEMS / 2)].item as number;
      if (centerItem && centerItem !== date.getDate()) {
        handleDayChange(centerItem);
      }
    }
  });

  const onViewableItemsChangedMonth = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[Math.floor(VISIBLE_ITEMS / 2)]) {
      const centerIndex = viewableItems[Math.floor(VISIBLE_ITEMS / 2)].index as number;
      if (centerIndex !== undefined && centerIndex !== date.getMonth()) {
        handleMonthChange(centerIndex);
      }
    }
  });

  const onViewableItemsChangedYear = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[Math.floor(VISIBLE_ITEMS / 2)]) {
      const centerItem = viewableItems[Math.floor(VISIBLE_ITEMS / 2)].item as number;
      if (centerItem && centerItem !== date.getFullYear() + 543) {
        handleYearChange(centerItem);
      }
    }
  });

  // กำหนดค่า viewability config
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 100,
    minimumViewTime: 150,
  });

  // แสดงรายการวันที่
  const renderDayItem = ({ item }: { item: number }) => {
    const selected = date.getDate() === item;
    return (
      <View style={[styles.pickerItem, selected && styles.selectedPickerItem]}>
        <Text style={[styles.pickerItemText, selected && styles.selectedPickerItemText]}>
          {item}
        </Text>
      </View>
    );
  };

  // แสดงรายการเดือน
  const renderMonthItem = ({ item, index }: { item: string; index: number }) => {
    const selected = date.getMonth() === index;
    return (
      <View style={[styles.pickerItem, selected && styles.selectedPickerItem]}>
        <Text style={[styles.pickerItemText, selected && styles.selectedPickerItemText]}>
          {item}
        </Text>
      </View>
    );
  };

  // แสดงรายการปี
  const renderYearItem = ({ item }: { item: number }) => {
    const selected = date.getFullYear() + 543 === item;
    return (
      <View style={[styles.pickerItem, selected && styles.selectedPickerItem]}>
        <Text style={[styles.pickerItemText, selected && styles.selectedPickerItemText]}>
          {item}
        </Text>
      </View>
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
            <TouchableOpacity onPress={onSave} style={styles.headerButton}>
              <Text style={styles.confirmText}>ตกลง</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.spinnerContainer}>
            {/* ส่วนของวันที่ */}
            <View style={styles.spinnerColumnContainer}>
              <Text style={styles.spinnerLabel}>วันที่</Text>
              <View style={styles.spinnerWrapper}>
                {/* FlatList สำหรับวันที่ */}
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
                  onViewableItemsChanged={onViewableItemsChangedDay.current}
                  viewabilityConfig={viewabilityConfig.current}
                />
                {/* Overlay lines for highlight */}
                <View style={styles.highlightOverlay}>
                  <View style={styles.highlightLine} />
                  <View style={styles.highlightLine} />
                </View>
              </View>
            </View>

            {/* ส่วนของเดือน */}
            <View style={styles.spinnerColumnContainer}>
              <Text style={styles.spinnerLabel}>เดือน</Text>
              <View style={styles.spinnerWrapper}>
                {/* FlatList สำหรับเดือน */}
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
                  onViewableItemsChanged={onViewableItemsChangedMonth.current}
                  viewabilityConfig={viewabilityConfig.current}
                />
                {/* Overlay lines for highlight */}
                <View style={styles.highlightOverlay}>
                  <View style={styles.highlightLine} />
                  <View style={styles.highlightLine} />
                </View>
              </View>
            </View>

            {/* ส่วนของปี */}
            <View style={styles.spinnerColumnContainer}>
              <Text style={styles.spinnerLabel}>ปี (พ.ศ.)</Text>
              <View style={styles.spinnerWrapper}>
                {/* FlatList สำหรับปี */}
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
                  onViewableItemsChanged={onViewableItemsChangedYear.current}
                  viewabilityConfig={viewabilityConfig.current}
                />
                {/* Overlay lines for highlight */}
                <View style={styles.highlightOverlay}>
                  <View style={styles.highlightLine} />
                  <View style={styles.highlightLine} />
                </View>
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
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#CFA459",
  },
  headerButton: {
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  cancelText: {
    fontSize: 16,
    color: "#999",
  },
  confirmText: {
    fontSize: 16,
    color: "#CFA459",
    fontWeight: "600",
  },
  spinnerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
  },
  spinnerColumnContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  spinnerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  spinnerWrapper: {
    height: ITEM_HEIGHT * 5,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
    position: "relative",
  },
  flatListContent: {
    paddingVertical: ITEM_HEIGHT * 2,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  selectedPickerItem: {
    backgroundColor: "#CFA459",
  },
  pickerItemText: {
    fontSize: 18,
    color: "#333",
  },
  selectedPickerItemText: {
    color: "#fff",
    fontWeight: "bold",
  },
  highlightOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: ITEM_HEIGHT * 2,
    paddingBottom: ITEM_HEIGHT * 2,
    pointerEvents: "none",
  },
  highlightLine: {
    borderWidth: 1,
    borderColor: "#CFA459",
    width: "100%",
  },
});

export default ThaiDatePicker;