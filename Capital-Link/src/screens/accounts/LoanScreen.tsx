import type React from "react";
import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import CustomTabBar from "../../components/common/CustomTabBar";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import {
  mockLoanInfos,
  type LoanInfo,
  type LoanHistoryItem,
  accountTypeMap,
  StatusLoanTypeMap,
} from "../../Data/UserDataStorage";
const SCREEN_WIDTH = Dimensions.get("window").width;
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const CARD_WIDTH = width - 34;
const SPACING = 16; // ระยะห่างระหว่างแต่ละ card
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const LoanScreen: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const data = mockLoanInfos;
  const current = data[selectedIndex];
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();

  // ปุ่ม Back → กลับหน้า "บัญชี" (หรือหน้าเดิม)
  const handleBack = () => {
    // navigation.navigate("Account");
    navigation.goBack();
  };
  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / (CARD_WIDTH + 16));
    setSelectedIndex(newIndex);
  };
  // ตัวอย่างปุ่ม "ชำระเงิน"
  const handlePay = () => {
    // ใส่ logic การชำระเงินตามที่ต้องการ
    console.log("ชำระเงิน");
  };
  const DetailRow = ({ title, detail }: { title: string; detail: string }) => (
    <View style={styles.dateRow}>
      <Text style={styles.dateLabel}>{title}</Text>
      <Text style={styles.dateValue}>{detail}</Text>
    </View>
  );
  const LoanAccount = ({ item }: { item: LoanInfo }) => {
    return (
      <View style={[styles.infoCard, { width: CARD_WIDTH }]}>
        <View style={styles.sideBar} />
        <View style={styles.cardContent}>
          {/* แถวบน: ข้อมูลบัญชี vs ยอดเงิน */}
          <View style={styles.headerRow}>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>
                {accountTypeMap[item.accountType]}
              </Text>
              <Text style={styles.accountNumber}>{item.accountNumber}</Text>
              <Text style={styles.accountOwner}>{item.accountHolder}</Text>
            </View>
            <View style={styles.balanceContainer}>
              <Text style={styles.accountBalance}>
                {item.balance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Text>
              <Text style={styles.currency}>THB</Text>
            </View>
          </View>

          {/* เส้นแบ่ง */}
          <View style={styles.divider} />

          {/* รายละเอียดอื่น ๆ */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>อัตราดอกเบี้ย:</Text>
            <Text style={styles.value}>{item.interestRate}%</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>วันถึงกำหนดชำระ:</Text>
            <Text style={styles.value}>{item.dueDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>ค่างวดครั้งถัดไป:</Text>
            <Text style={styles.value}>{item.nextInstallment} บาท</Text>
          </View>
        </View>
      </View>
    );
  };
  const PaginationDot = () => {
    return (
      // {/* <View style={styles.pagination}>
      //       {data.map((item, idx) => (
      //         <View
      //           key={item.id}
      //           style={[styles.dot, selectedIndex === idx && styles.activeDot]}
      //         />
      //       ))}
      //     </View> */}
      //     {/* <View style={styles.pagination}>
      //       <Text>
      //         {selectedIndex + 1} / {data.length}
      //       </Text>
      //     </View> */}
      <View style={styles.pagination}>
        {data.map((_, idx) => {
          const diff = Math.abs(idx - selectedIndex);
          // กำหนด opacity ตามระยะ: 0 = เต็ม, 1 = กลาง, >=2 = จาง
          const opacity = diff === 0 ? 1 : diff === 1 ? 0.6 : 0.3;
          // กำหนดขนาดตามระยะ: 0 = ใหญ่สุด, 1 = กลาง, >=2 = เล็กสุด
          const size = diff === 0 ? 10 : diff === 1 ? 8 : 6;

          return (
            <View
              key={_.id}
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: "#CFA459",
                opacity,
                marginHorizontal: 4,
              }}
            />
          );
        })}
      </View>
    );
  };
  const StatusLoan = ({ item }: { item: LoanInfo }) => {
    const getStatusColor = (statusKey: string) => {
      switch (statusKey) {
        case "Current":
          return "#4CAF50"; // เขียว
        case "Overdue":
          return "#F44336"; // แดง
        default:
          return "#000000"; // ดำ ถ้าเจอสถานะอื่น
      }
    };
    return (
      <View style={styles.statusCard}>
        <View style={styles.cardContent}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>สถานะการชำระ:</Text>
            <Text
              style={[
                styles.value,
                { color: getStatusColor(item.paymentStatus) },
              ]}
            >
              {StatusLoanTypeMap[item.paymentStatus]}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>ค่าปรับค้างชำระ:</Text>
            <Text style={styles.value}>{item.penaltyFee} บาท</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>กำหนดชำระภายใน:</Text>
            <Text style={styles.value}>{item.daysUntilDue} วัน</Text>
          </View>

          {/* ปุ่ม "ชำระเงิน" */}
          <LinearGradient
            colors={["#c49a45", "#d4af71", "#e0c080"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.payButton}
          >
            <TouchableOpacity
              style={styles.payButtonContainer}
              onPress={handlePay}
              activeOpacity={0.9}
            >
              <Text style={styles.payButtonText}>ชำระเงิน</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    );
  };
  const HistoryLoan = ({ history }: { history: LoanHistoryItem[] }) => {
    return (
      <View style={styles.scheduleCard}>
        <View style={styles.cardContent}>
          <Text style={styles.scheduleTitle}>ประวัติการผ่อนชำระ</Text>

          {history.map((h) => (
            <DetailRow
              key={h.id}
              title={h.id}
              detail={h.amount.toLocaleString()}
            />
          ))}
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ปุ่ม Back */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="chevron-back" size={26} color="#CFA459" />
      </TouchableOpacity>

      {/* หัวข้อหน้าจอ */}
      <Text style={styles.headerTitle}>สินเชื่อ</Text>
      {/* ====== Card 1: ข้อมูลบัญชีสินเชื่อ ====== */}
      {/* <LoanAccount item={current} /> */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.carouselContainer}>
          {/* <ScrollView
            horizontal
            pagingEnabled
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + 16}
            snapToAlignment="start"
            showsHorizontalScrollIndicator={false}
            // contentContainerStyle={{ paddingHorizontal: 5 }}
            onMomentumScrollEnd={onMomentumScrollEnd}
          >
            {data.map((item, idx) => (
              <TouchableOpacity
                key={item.accountNumber}
                activeOpacity={0.9}
                onPress={() => setSelectedIndex(idx)}
              >
                <LoanAccount item={item} />
              </TouchableOpacity>
            ))}
          </ScrollView> */}
          <FlatList
            horizontal
            data={data}
            keyExtractor={(item) => item.id.toString()}
            // เว้นขอบซ้าย–ขวา เพื่อให้การ์ดแรก+สุดอยู่กึ่งกลาง
            contentContainerStyle={{ paddingHorizontal: SIDE_PADDING / 2.5 }}
            showsHorizontalScrollIndicator={false}
            // ระยะที่จะ snap = ความกว้างการ์ด + ระยะห่าง
            snapToInterval={CARD_WIDTH + SPACING}
            decelerationRate="fast"
            // เปลี่ยนเป็นล็อคที่กลางหน้าจอ
            snapToAlignment="center"
            // หรือจะเปลี่ยนเป็น offsets เองก็ได้ (ดูข้อสองข้างล่าง)
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSelectedIndex(index)}
                style={{ width: CARD_WIDTH, marginRight: SPACING }}
              >
                <LoanAccount item={item} />
              </TouchableOpacity>
            )}
            onMomentumScrollEnd={onMomentumScrollEnd}
          />
          <PaginationDot />
        </View>

        {/* ====== Card 2: สถานะการชำระ ====== */}
        <StatusLoan item={current} />

        {/* ====== Card 3: ตารางกำหนดการ / ประวัติการผ่อนชำระ ====== */}
        <HistoryLoan history={current.history} />
      </ScrollView>

      {/* แท็บบาร์ (ถ้ามีการใช้งาน) */}
      <CustomTabBar activeTab="account" />
    </SafeAreaView>
  );
};

export default LoanScreen;

/** ========== Styles ========== */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 18,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 999,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#a2754c",
    textAlign: "center",
    marginTop: 35,
    marginBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  /* =========== Card พื้นฐาน =========== */
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 15,
    flexDirection: "row",
    // shadow (iOS + Android)
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
    marginRight: 2,
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  scheduleCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  sideBar: {
    width: 5,
    backgroundColor: "#CFA459",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },

  /* =========== Card ส่วนบน: ข้อมูลบัญชี =========== */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  accountInfo: {
    alignItems: "flex-start",
  },
  accountName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  accountNumber: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    marginBottom: 2,
  },
  accountOwner: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  balanceContainer: {
    alignItems: "flex-end",
  },
  accountBalance: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  currency: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#666",
    marginBottom: 15,
  },

  /* =========== รายละเอียดดอกเบี้ย ฯลฯ =========== */
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },

  /* =========== Card ส่วนกลาง: สถานะการชำระ + ปุ่ม =========== */
  payButton: {
    borderRadius: 30,
    marginTop: 10,
  },
  payButtonContainer: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  /* =========== Card ส่วนล่าง: ประวัติ/กำหนดการผ่อนชำระ =========== */
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#000",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dateLabel: {
    fontSize: 14,
    color: "#666",
  },
  dateValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    // marginTop: 8,
    // backgroundColor: "pink",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#CFA459",
  },
  carouselContainer: {
    // backgroundColor: "red",
    // height: height * 0.3,
    marginBottom: 16,
  },
});
