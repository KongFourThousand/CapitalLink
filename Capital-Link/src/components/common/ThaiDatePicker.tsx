import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const ITEM_HEIGHT = 70;
const VISIBLE_ITEMS = 3;
const VISIBLE_OFFSET = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

interface ThaiDatePickerProps {
  visible: boolean;
  date: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
  onSave: () => void;
}

const ThaiDatePicker: React.FC<ThaiDatePickerProps> = ({ visible, date, onChange, onClose, onSave }) => {
  const [selectedDate, setSelectedDate] = useState(new Date(date));
  const [isInitialRender, setIsInitialRender] = useState(true);
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

  const getYears = () => {
    return Array.from({ length: 100 }, (_, i) => new Date().getFullYear() + 543 - i);
  };

  const [days, setDays] = useState(getDays());
  const [years] = useState(getYears());

  useEffect(() => {
    setDays(getDays());
  }, [selectedDate.getMonth(), selectedDate.getFullYear()]);

  useEffect(() => {
    if (visible) {
      const newDate = new Date(date);
      setSelectedDate(newDate);
      setIsInitialRender(true);
    }
  }, [visible, date]);

  useEffect(() => {
    if (visible && isInitialRender && days.length > 0) {
      setTimeout(() => {
        scrollToSelected();
        setIsInitialRender(false);
      }, 100);
    }
  }, [visible, isInitialRender, days, selectedDate]);

  const scrollToSelected = () => {
    if (dayRef.current) {
      const dayIndex = selectedDate.getDate() - 1;
      if (dayIndex >= 0 && dayIndex < days.length) {
        dayRef.current.scrollToOffset({ offset: dayIndex * ITEM_HEIGHT, animated: false });
      }
    }
    if (monthRef.current) {
      const monthIndex = selectedDate.getMonth();
      monthRef.current.scrollToOffset({ offset: monthIndex * ITEM_HEIGHT, animated: false });
    }
    if (yearRef.current) {
      const yearIndex = years.findIndex(year => year === selectedDate.getFullYear() + 543);
      if (yearIndex >= 0) {
        yearRef.current.scrollToOffset({ offset: yearIndex * ITEM_HEIGHT, animated: false });
      }
    }
  };

  const resetToDefaultDate = () => {
    const newDefault = new Date(new Date().getFullYear(), 0, 1);
    setSelectedDate(newDefault);
    setTimeout(() => {
      dayRef.current?.scrollToOffset({ offset: 0, animated: true });
      monthRef.current?.scrollToOffset({ offset: 0, animated: true });
      yearRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 150);
  };

  const updateDate = (type: "day" | "month" | "year", value: number) => {
    const newDate = new Date(selectedDate);

    if (type === "day") {
      newDate.setDate(value);
    } else if (type === "month") {
      const currentDay = newDate.getDate();
      newDate.setMonth(value);
      const lastDay = new Date(newDate.getFullYear(), value + 1, 0).getDate();
      if (currentDay > lastDay) {
        resetToDefaultDate();
        return;
      }
    } else if (type === "year") {
      const currentDay = newDate.getDate();
      const currentMonth = newDate.getMonth();
      newDate.setFullYear(value - 543);
      if (currentMonth === 1 && currentDay === 29) {
        const isLeap = new Date(value - 543, 1, 29).getDate() === 29;
        if (!isLeap) {
          resetToDefaultDate();
          return;
        }
      }
    }

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
            {/* Day Picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>วันที่</Text>
              <View style={styles.picker}>
                <FlatList
                  ref={dayRef}
                  data={days}
                  keyExtractor={(item) => `day-${item}`}
                  renderItem={({ item }) => renderItem(item, item === selectedDate.getDate())}
                  snapToInterval={ITEM_HEIGHT}
                  getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
                  contentContainerStyle={{ paddingVertical: VISIBLE_OFFSET }}
                  onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                    if (index >= 0 && index < days.length) {
                      updateDate("day", days[index]);
                    }
                  }}
                  showsVerticalScrollIndicator={false}
                  decelerationRate="fast"
                  removeClippedSubviews={Platform.OS === 'android'}
                />
                <View style={styles.selectionIndicator} />
              </View>
            </View>

            {/* Month Picker */}
            <View style={[styles.pickerContainer, styles.monthContainer]}>
              <Text style={styles.pickerLabel}>เดือน</Text>
              <View style={styles.picker}>
                <FlatList
                  ref={monthRef}
                  data={thaiMonths}
                  keyExtractor={(item) => `month-${item}`}
                  renderItem={({ item, index }) => renderItem(item, index === selectedDate.getMonth())}
                  snapToInterval={ITEM_HEIGHT}
                  getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
                  contentContainerStyle={{ paddingVertical: VISIBLE_OFFSET }}
                  onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                    if (index >= 0 && index < thaiMonths.length) {
                      updateDate("month", index);
                    }
                  }}
                  showsVerticalScrollIndicator={false}
                  decelerationRate="fast"
                  removeClippedSubviews={Platform.OS === 'android'}
                />
                <View style={styles.selectionIndicator} />
              </View>
            </View>

            {/* Year Picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>ปี (พ.ศ.)</Text>
              <View style={styles.picker}>
                <FlatList
                  ref={yearRef}
                  data={years}
                  keyExtractor={(item) => `year-${item}`}
                  renderItem={({ item }) => renderItem(item, item === selectedDate.getFullYear() + 543)}
                  snapToInterval={ITEM_HEIGHT}
                  getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
                  contentContainerStyle={{ paddingVertical: VISIBLE_OFFSET }}
                  onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                    if (index >= 0 && index < years.length) {
                      updateDate("year", years[index]);
                    }
                  }}
                  showsVerticalScrollIndicator={false}
                  decelerationRate="fast"
                  removeClippedSubviews={Platform.OS === 'android'}
                />
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
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#a2754c", marginBottom: 16 },
  datePreview: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  previewText: { fontSize: 18, fontWeight: "600", color: "#333" },
  pickerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24, width: "100%" },
  pickerContainer: { flex: 1, alignItems: "center" },
  monthContainer: { flex: 1.5 },
  pickerLabel: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 8 },
  picker: {
    width: "95%",
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  item: { height: ITEM_HEIGHT, justifyContent: "center", alignItems: "center", paddingHorizontal: 4 },
  itemText: { fontSize: 18, color: "rgba(0, 0, 0, 0.43)", textAlign: "center" },
  itemSelected: { backgroundColor: "rgba(225, 182, 103, 0.43)"},
  itemTextSelected: { color: "rgb(110, 53, 6)", fontWeight: "bold" },
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
    paddingVertical: 14,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  cancelText: { fontSize: 16, color: "#666", fontWeight: "600" },
  confirmGradient: { flex: 1, borderRadius: 12, marginLeft: 10 },
  confirmButton: { paddingVertical: 14, alignItems: "center" },
  confirmText: { fontSize: 16, color: "#FFF", fontWeight: "600" },
});

export default ThaiDatePicker;
