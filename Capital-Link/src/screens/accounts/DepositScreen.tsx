import React from "react";
import { useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  FlatList,
} from "react-native";
import type { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import CustomTabBar from "../../components/common/CustomTabBar";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import {
  mockDepositInfos,
  type DepositInfo,
  type DepositHistoryItem,
  accountTypeMap,
} from "../../Data/UserDataStorage";
import DepositCarousel from "../../components/Account/DepositCarousel";
import { useData } from "../../Provide/Auth/UserDataProvide";
const SCREEN_WIDTH = Dimensions.get("window").width;
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const CARD_WIDTH = width - 34;
const SPACING = 16; // ระยะห่างระหว่างแต่ละ card
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const DepositScreen: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [index, setIndex] = React.useState<number>(0);
  const { depositData } = useData();
  const data = depositData;
  const current = data[selectedIndex];
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();

  const handleBack = () => {
    navigation.goBack();
  };
  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / (CARD_WIDTH + 16));
    setSelectedIndex(newIndex);
    setIndex(newIndex);
  };

  const DetailRow = ({ title, detail }: { title: string; detail: string }) => (
    <View style={styles.dateRow}>
      <Text style={styles.dateLabel}>{title}</Text>
      <Text style={styles.dateValue}>{detail} </Text>
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
      <Text style={styles.dateLabel}>{title}</Text>
      <View style={styles.balanceRow}>
        <Text style={styles.dateValue}>{detail} </Text>
        <Text style={styles.currency}>บาท</Text>
      </View>
    </View>
  );
  const DepositAccount = ({ item }: { item: DepositInfo }) => (
    <View style={[styles.infoCard, { width: CARD_WIDTH }]}>
      <View style={styles.sideBar} />
      <View style={styles.cardContent}>
        {/* Top Row */}
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
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={styles.label}>อัตราดอกเบี้ย:</Text>
          <Text style={styles.value}>{item.interestRate}%</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>ระยะเวลาฝาก:</Text>
          <Text style={styles.value}>{item.term} ปี</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>ดอกเบี้ยรับรายเดือน:</Text>
          <Text style={styles.value}>
            {item.maturityInterest.toLocaleString()} บาท
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>ภาษี:</Text>
          <Text style={styles.value}>
            {item.maturityInterest.toLocaleString()} บาท
          </Text>
        </View>
      </View>
    </View>
  );
  const DetailAccount = () => {
    return (
      <View style={styles.dateCard}>
        <DetailRow title="วันที่เริ่มฝาก:" detail={current.depositDate} />
        <DetailRow title="วันที่ครบกำหนด:" detail={current.maturityDate} />
      </View>
    );
  };
  const HistoryDeposit = ({ history }: { history: DepositHistoryItem[] }) => (
    <View style={styles.dateCard}>
      <Text style={styles.accountName}>ประวัติการฝากเงิน</Text>
      <View style={styles.divider} />
      {history.map((h) => (
        <DetailHistoryRow
          key={h.id}
          title={h.id}
          detail={h.amount.toLocaleString()}
        />
      ))}
    </View>
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Back Button ที่ตำแหน่งเดียวกับใน PinSetupScreen */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="chevron-back" size={26} color="#CFA459" />
      </TouchableOpacity>

      {/* Header Title */}
      <Text style={styles.headerTitle}>เงินฝาก</Text>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitleSum}>ยอดรวมเงินฝาก</Text>
        <Text style={styles.headerDetailSum}>
          <Text style={styles.totalAmount}>
            {data
              .reduce((sum, item) => sum + item.balance, 0)
              .toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.bahtText}> บาท</Text>
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* กล่องข้อมูลบัญชีเงินฝาก */}
        {data.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ fontSize: 16, color: "#999" }}>
              คุณไม่มีบัญชีสินเชื่อ
            </Text>
          </View>
        ) : (
          <>
            <DepositCarousel
              data={data}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              index={index}
              setIndex={setIndex}
              onMomentumScrollEnd={onMomentumScrollEnd}
              DepositAccount={DepositAccount}
            />
            {/* กล่องข้อมูลวันที่ ส่วนที่สอง */}
            <DetailAccount />
            <HistoryDeposit history={current.history} />
          </>
        )}
      </ScrollView>
      <CustomTabBar activeTab="account" />
    </SafeAreaView>
  );
};

export default DepositScreen;

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
  headerTitleSum: {
    fontSize: 16,
    fontWeight: "600",
    color: "#878787",
    textAlign: "center",
    // marginTop: 35,
    // marginBottom: 20,
  },
  headerDetailSum: {
    fontSize: 16,
    fontWeight: "600",
    color: "#878787",
    textAlign: "center",
    // marginTop: 35,
    // marginBottom: 20,
  },
  totalAmount: {
    fontWeight: "700",
    color: "#2A2867",
  },

  bahtText: {
    color: "#888",
    fontWeight: "500",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100, // เพิ่มส่วนนี้เพื่อให้เนื้อหาไม่ถูกซ่อนโดย tabBar
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 15,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
    marginRight: 2,
  },
  sideBar: {
    width: 10,
    //height:50,
    backgroundColor: "#CFA459",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
    paddingHorizontal: 16,
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
  balanceContainer: {
    alignItems: "flex-end",
    flexDirection: "row",
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
  accountNumber: {
    fontSize: 15,
    color: "#4A4A4A",
    marginBottom: 2,
    fontWeight: "500",
  },
  accountOwner: {
    fontSize: 14,
    color: "#4A4A4A",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.38)",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: "#878787",
  },
  value: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  dateCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
    marginTop: 10,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
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
  moreButton: {
    borderRadius: 30,
    marginTop: 10,
  },
  moreButtonContainer: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  moreButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  tabBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    color: "#888",
  },
  activeTab: {
    color: "#CFA459",
    fontWeight: "600",
  },
  carouselContainer: {
    // backgroundColor: "red",
    marginBottom: 16,
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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
});
