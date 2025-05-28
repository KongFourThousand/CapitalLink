import type React from "react";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
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
import * as ImagePicker from "expo-image-picker";
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
import LoanCarousel from "../../components/Account/LoanCarousel";
import PaymentEvidenceModal from "../../components/Account/PaymentEvidenceModal";
import { useData } from "../../Provide/Auth/UserDataProvide";
import { api } from "../../../API/route";
const SCREEN_WIDTH = Dimensions.get("window").width;
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const CARD_WIDTH = width - 34;
const SPACING = 16; // ระยะห่างระหว่างแต่ละ card
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;
type ImageObj = {
  uri: string;
  b64: string;
  type: string;
};
const LoanScreen: React.FC = () => {
  const { loanData, setLoading, setLoanData } = useData();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [index, setIndex] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentImage, setPaymentImage] = useState<string | null>(null);
  const data = loanData;
  const current = data[selectedIndex];
  const [selectedLoanIdForPayment, setSelectedLoanIdForPayment] = useState<
    string | null
  >(null);
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
    setIndex(newIndex);
  };
  // ตัวอย่างปุ่ม "ชำระเงิน"
  const handlePay = () => {
    const currentLoanId = loanData[selectedIndex]?.id;
    if (currentLoanId) {
      setSelectedLoanIdForPayment(currentLoanId); // ✅ ล็อกบัญชีที่ต้องชำระ
      setShowPaymentModal(true);
    }
  };
  const handleSubmitEvidence = async (imageUri: ImageObj | null) => {
    const data = {
      accountNumber: current.accountNumber,
      base64: imageUri,
    };
    try {
      setLoading(true);
      const res = await api("proof-payment", data, "json", "POST");
      console.log("res SubmitEvidence:", res);
      if (!res) {
        setLoading(false);
      }
      if (res.error) {
        setLoading(false);
      }
      if (res.success === true) {
        setLoanData(res.accounts);
        setLoading(false);
        setShowPaymentModal(false);
        setSelectedLoanIdForPayment(null); // ✅ เคลียร์หลังใช้งาน
      }
    } catch (error) {
      console.error("Error getLoanInfo:", error);
      setLoading(false);
    }
    // setLoanData(updated);
  };
  const DetailRow = ({ title, detail }: { title: string; detail: string }) => (
    <View style={styles.dateRow}>
      <Text style={styles.dateLabel}>{title}</Text>
      <Text style={styles.dateValue}>{detail}</Text>
    </View>
  );
  const DetailRowCard = ({
    title,
    detail,
  }: {
    title: string;
    detail: string;
  }) => (
    <View style={styles.dateRow}>
      <Text style={styles.dateLabelcard}>{title}</Text>
      <Text style={styles.dateValuecard}>{detail}</Text>
    </View>
  );
  const DetailHistoryRow = ({
    title,
    detail,
  }: {
    title: string;
    detail: string;
  }) => (
    <View style={styles.dateRow}>
      <Text style={styles.dateLabelHistory}>{title}</Text>
      <View style={styles.balanceRow}>
        <Text style={styles.dateValueHistory}>{detail} </Text>
        <Text style={styles.currencyHistory}>บาท</Text>
      </View>
    </View>
  );
  const ExpandableHistoryRow = ({ item }: { item: LoanHistoryItem }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <View>
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          style={styles.dateRow}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name={expanded ? "chevron-down" : "chevron-forward"}
              size={18}
              color="#CFA459"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.dateLabel}>{item.id}</Text>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.dateValue}>{item.amount.toLocaleString()}</Text>
            <Text style={styles.currency}> บาท</Text>
          </View>
        </TouchableOpacity>

        {expanded && (
          <View style={styles.detailContainer}>
            <DetailHistoryRow
              title="เงินต้น"
              detail={item.principalAmount?.toLocaleString() || "0"}
            />
            <DetailHistoryRow
              title="ดอกเบี้ย"
              detail={item.interest?.toLocaleString() || "0"}
            />
            <DetailHistoryRow
              title="ค่าปรับ"
              detail={item.penaltyFee?.toLocaleString() || "0"}
            />
          </View>
        )}
      </View>
    );
  };
  const LoanAccount = ({ item }: { item: LoanInfo }) => {
    return (
      <View style={[styles.infoCard, { width: CARD_WIDTH }]}>
        <View style={styles.sideBar} />
        <View style={styles.cardContent}>
          {/* แถวบน: ข้อมูลบัญชี vs ยอดเงิน */}
          <Text style={styles.accountName}>
            {accountTypeMap[item.accountType]}
          </Text>

          {/* Account Number + Balance in same row */}
          <View style={styles.rowBetween}>
            <Text style={styles.accountNumber}>{item.accountNumber}</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.accountBalance}>
                {item.balance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Text>
              <Text style={styles.currency}>บาท</Text>
            </View>
          </View>
          <Text style={styles.accountOwner}>{item.accountHolder}</Text>

          {/* เส้นแบ่ง */}
          <View style={styles.divider} />

          {/* รายละเอียดอื่น ๆ */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>อัตราดอกเบี้ย:</Text>
            <Text style={styles.value}>{item.interestRate}%</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>วันครบกำหนดสัญญา:</Text>
            <Text style={styles.value}>{item.dueDate}</Text>
          </View>
        </View>
      </View>
    );
  };

  const StatusLoan = ({ item }: { item: LoanInfo }) => {
    const isEvidenceSubmitted =
      item.evidenceStatus === "Pending" || item.daysUntilDue === 30;
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

          <DetailRowCard
            title="กำหนดชำระครั้งถัดไป:"
            detail={`${item.dueDate}`}
          />
          <DetailRowCard
            title="ค่างวด:"
            detail={`${item.nextInstallment.toLocaleString(undefined, {
              minimumFractionDigits: 0,
            })} บาท`}
          />
          <DetailRowCard
            title="ค่าปรับค้างชำระ:"
            detail={`${item.penaltyFee} บาท`}
          />
          <DetailRowCard
            title="กำหนดชำระภายใน:"
            detail={`${item.daysUntilDue} วัน`}
          />

          {/* ปุ่ม "ชำระเงิน" */}
          <LinearGradient
            colors={
              isEvidenceSubmitted
                ? ["#bbb", "#bbb"] // สีเทา
                : ["#c49a45", "#d4af71", "#e0c080"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.payButton}
          >
            <TouchableOpacity
              style={styles.payButtonContainer}
              onPress={handlePay}
              activeOpacity={0.9}
              disabled={isEvidenceSubmitted} // ✅ ปิดการกด
            >
              <Text style={styles.payButtonText}>
                {isEvidenceSubmitted ? "กำลังตรวจสอบ..." : "ส่งหลักฐานการชำระ"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        {/* <PaymentEvidenceModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={(imageUri) => {
            handleSubmitEvidence(imageUri);
            // setPaymentImage(null); // เคลียร์หลังใช้งาน
          }}
        /> */}
      </View>
    );
  };
  const HistoryLoan = ({ history }: { history: LoanHistoryItem[] }) => {
    return (
      <View style={styles.scheduleCard}>
        <View style={styles.cardContent}>
          <Text style={styles.scheduleTitle}>ประวัติการชำระ</Text>
          <View style={styles.divider} />
          {/* {history.map((h) => (
            <DetailHistoryRow
              key={h.id}
              title={h.id}
              detail={h.amount.toLocaleString()}
            />
          ))} */}
          {history.map((item) => (
            <ExpandableHistoryRow key={item.id} item={item} />
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

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
      >
        <LoanCarousel
          data={data}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          index={index}
          setIndex={setIndex}
          onMomentumScrollEnd={onMomentumScrollEnd}
          LoanAccount={LoanAccount}
        />
        {/* ====== Card 2: สถานะการชำระ ====== */}
        <StatusLoan item={current} />

        {/* ====== Card 3: ตารางกำหนดการ / ประวัติการผ่อนชำระ ====== */}
        <HistoryLoan history={current.history} />
      </ScrollView>
      <PaymentEvidenceModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={(imageUri) => {
          handleSubmitEvidence(imageUri);
          // setPaymentImage(null); // เคลียร์หลังใช้งาน
        }}
      />
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
    fontSize: 14,
    fontWeight: "400",
    color: "#878787",
    marginBottom: 5,
  },
  accountNumber: {
    fontSize: 15,
    color: "#4A4A4A",
    marginBottom: 2,
    fontWeight: "500",
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
    fontSize: 15,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginRight: 5,
  },
  currency: {
    fontSize: 15,
    color: "#666",
  },
  currencyHistory: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.38)",
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
    color: "#878787",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dateLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  dateLabelcard: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  dateLabelHistory: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    // color: "red",
  },
  dateValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  dateValuecard: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  dateValueHistory: {
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
  balanceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  detailContainer: {
    paddingLeft: 26,
    paddingBottom: 12,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modalContent: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  modalSubtext: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#CFA459",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    width: 220,
    height: 220,
  },
  uploadText: {
    fontSize: 16,
    color: "#666",
  },
});
