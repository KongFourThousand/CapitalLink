// components/common/ThaiDatePicker.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  StyleSheet,
} from "react-native";

const { width } = Dimensions.get("window");

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

          {/* เลือกปี (แสดงเป็น พ.ศ.) */}
          <View style={styles.thaiYearSelector}>
            <Text style={styles.selectorLabel}>ปี (พ.ศ.):</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.yearScroll}
            >
              {Array.from({ length: 80 }, (_, i) => {
                const yearTH = (new Date().getFullYear() - i) + 543;
                const selected = (date.getFullYear() + 543) === yearTH;
                return (
                  <TouchableOpacity
                    key={yearTH}
                    style={[
                      styles.yearButton,
                      selected && styles.selectedYearButton,
                    ]}
                    onPress={() => {
                      const newDate = new Date(date);
                      newDate.setFullYear(yearTH - 543);
                      onChange(newDate);
                    }}
                  >
                    <Text
                      style={[
                        styles.yearText,
                        selected && styles.selectedYearText,
                      ]}
                    >
                      {yearTH}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* เลือกเดือน */}
          <View style={styles.thaiMonthSelector}>
            <Text style={styles.selectorLabel}>เดือน:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.monthScroll}
            >
              {[
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
              ].map((month, index) => {
                const selected = date.getMonth() === index;
                return (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.monthButton,
                      selected && styles.selectedMonthButton,
                    ]}
                    onPress={() => {
                      const newDate = new Date(date);
                      newDate.setMonth(index);
                      onChange(newDate);
                    }}
                  >
                    <Text
                      style={[
                        styles.monthText,
                        selected && styles.selectedMonthText,
                      ]}
                    >
                      {month}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* เลือกวัน */}
          <View style={styles.thaiDaySelector}>
            <Text style={styles.selectorLabel}>วันที่:</Text>
            <View style={styles.dayGrid}>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const lastDayOfMonth = new Date(
                  date.getFullYear(),
                  date.getMonth() + 1,
                  0
                ).getDate();
                if (day > lastDayOfMonth) return null;
                const selected = date.getDate() === day;
                return (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayButton, selected && styles.selectedDayButton]}
                    onPress={() => {
                      const newDate = new Date(date);
                      newDate.setDate(day);
                      onChange(newDate);
                    }}
                  >
                    <Text style={[styles.dayText, selected && styles.selectedDayText]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ThaiDatePicker;

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
    paddingBottom: Platform.OS === "ios" ? 30 : 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#CFA459", // เปลี่ยนสีเส้นแนวนอนให้ตรงกับไอคอนปฎิทิน
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
  thaiYearSelector: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  thaiMonthSelector: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  thaiDaySelector: {
    padding: 15,
  },
  selectorLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  yearScroll: {
    flexDirection: "row",
  },
  monthScroll: {
    flexDirection: "row",
  },
  dayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  yearButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  monthButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  dayButton: {
    width: width / 8,
    height: 44,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  selectedYearButton: {
    backgroundColor: "#CFA459",
  },
  selectedMonthButton: {
    backgroundColor: "#CFA459",
  },
  selectedDayButton: {
    backgroundColor: "#CFA459",
  },
  yearText: {
    fontSize: 18,
    color: "#333",
  },
  monthText: {
    fontSize: 16,
    color: "#333",
  },
  dayText: {
    fontSize: 16,
    color: "#333",
  },
  selectedYearText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedMonthText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "bold",
  },
});