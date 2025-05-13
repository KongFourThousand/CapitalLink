import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import CustomTabBar from "../../components/common/CustomTabBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import {
  mockDepositInfos,
  DepositInfo,
  DepositHistoryItem,
  accountTypeMap,
} from "../../Data/UserDataStorage";
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const CARD_WIDTH = width - 34;
const DepositScreen: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const data = mockDepositInfos;
  const current = data[selectedIndex];
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();

  // กดปุ่ม Back → กลับหน้า "บัญชี" (หรือ goBack())
  const handleBack = () => {
    // ถ้าต้องการไปหน้าบัญชีโดยเฉพาะ: navigation.navigate("Account");
    // หรือถ้าจะกลับหน้าเดิม:
    navigation.goBack();
    // navigation.navigate("Account");
  };
  const onMomentumScrollEnd = (e: any) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / (CARD_WIDTH + 16));
    setSelectedIndex(newIndex);
  };

  const DetailRow = ({ title, detail }: { title: string; detail: string }) => (
    <View style={styles.dateRow}>
      <Text style={styles.dateLabel}>{title}</Text>
      <Text style={styles.dateValue}>{detail}</Text>
    </View>
  );
  const DepositAccount = ({ item }: { item: DepositInfo }) => (
    <View style={[styles.infoCard, { width: CARD_WIDTH }]}>
      <View style={styles.sideBar} />
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <View>
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
          <Text style={styles.label}>ดอกเบี้ยสิ้นสุด:</Text>
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
        <DetailRow title="วันที่ฝาก:" detail={current.depositDate} />
        <DetailRow title="วันสิ้นสุดสัญญา:" detail={current.maturityDate} />
      </View>
    );
  };
  const HistoryDeposit = ({ history }: { history: DepositHistoryItem[] }) => (
    <View style={styles.dateCard}>
      <Text style={styles.accountName}>ประวัติการฝากเงิน</Text>
      {history.map((h) => (
        <DetailRow key={h.id} title={h.id} detail={h.amount.toLocaleString()} />
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

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* กล่องข้อมูลบัญชี ส่วนแรก */}
        <View style={styles.carouselContainer}>
          <ScrollView
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
                key={idx}
                activeOpacity={0.9}
                onPress={() => setSelectedIndex(idx)}
              >
                <DepositAccount item={item} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {data.map((_, idx) => (
              <View
                key={idx}
                style={[styles.dot, selectedIndex === idx && styles.activeDot]}
              />
            ))}
          </View>
        </View>
        {/* กล่องข้อมูลวันที่ ส่วนที่สอง */}
        <DetailAccount />
        <HistoryDeposit history={current.history} />
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
  carouselContainer: {
    // backgroundColor: "red",
    height: height * 0.22,
    marginBottom: 16,
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
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
    marginRight: 2,
  },
  sideBar: {
    width: 5,
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
  },
  accountInfo: {
    alignItems: "flex-start",
  },
  accountName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
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
  divider: {
    height: 1,
    backgroundColor: "#666",
    marginBottom: 15,
  },
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
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
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
});
