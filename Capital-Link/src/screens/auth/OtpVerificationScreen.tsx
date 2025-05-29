import type React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { useRoute, type RouteProp } from "@react-navigation/native";
import OtpVerification from "../../components/common/OtpVerification";
import * as SecureStore from "expo-secure-store";
import { useData } from "../../Provide/Auth/UserDataProvide";
import { api, apiWeb } from "../../../API/route";
type OtpRouteProp = RouteProp<RootStackParamList, "OtpVerification">;

const { width } = Dimensions.get("window");

const OtpVerificationScreen: React.FC = () => {
  const { UserData, setUserData, showAlert, DataUserPending, setLoading } =
    useData();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<OtpRouteProp>();

  const from = route.params?.from || "Login";
  const phoneNumber = route.params?.phoneNumber || "";
  const data = route.params?.Data || {};

  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman.ttf"),
  });

  // const handleVerifyOtp = async (otpCode: string) => {
  //   if (otpCode === "123456") {
  //     if (from === "PhoneChange") {
  //       Alert.alert("เปลี่ยนเบอร์สำเร็จ", `เบอร์ของคุณคือ ${phoneNumber}`, [
  //         { text: "ตกลง", onPress: () => navigation.navigate("Profile") },
  //       ]);
  //     } else if (from === "Register") {
  //       try {
  //         // อัปเดต Context ว่าสถานะล็อกอินสำเร็จ
  //         const updatedData = {
  //           ...UserData,
  //           authToken: "true",
  //           statusUser: "docSub", // <-- set เป็น docSub
  //         };
  //         setUserData(updatedData);

  //         // บันทึก UserData ทั้งหมดลง SecureStore
  //         await SecureStore.setItemAsync(
  //           "userData",
  //           JSON.stringify(updatedData)
  //         );

  //         // นำทางไปตั้งค่า PIN
  //         navigation.replace("Pending");
  //         // navigation.replace("PinSetup");
  //       } catch (error) {
  //         console.error("บันทึกข้อมูลผู้ใช้ไม่สำเร็จ", error);
  //       } finally {
  //       }
  //       // navigation.replace("PinSetup");
  //     } else if (from === "Login") {
  //       await SecureStore.setItemAsync("authToken", "true");
  //       navigation.replace("PinSetup"); // หรือใส่ค่าจริง
  //     }
  //   } else {
  //     Alert.alert("OTP ไม่ถูกต้อง", "กรุณากรอกใหม่อีกครั้ง");
  //   }
  // };
  const handleVerifyOtp = async (otpCode: string) => {
    // ตรวจสอบ OTP ก่อน
    if (otpCode !== "123456") {
      Alert.alert("OTP ไม่ถูกต้อง", "กรุณากรอกใหม่อีกครั้ง");
      return;
    }

    // ถ้า OTP ถูกต้อง ให้แยกกรณีตามค่า from
    switch (from) {
      case "PhoneChange":
        console.log("Phone", phoneNumber);
        try {
          const res = await api("changeRequest/Phone", data, "json", "POST");
          console.log("res:", res);
          console.log("getChangePhone res:", res.user);
          if (res.status === "ok") {
            setLoading(false);
            setUserData(res.user);
            navigation.goBack();
            await SecureStore.setItemAsync(
              "userData",
              JSON.stringify(res.user)
            );
          } else {
            Alert.alert("Error", "ส่งไม่สำเร็จ");
            setLoading(false);
            navigation.goBack();
          }
        } catch (error) {
          console.error("Error getLoanInfo:", error);
          setLoading(false);
        }
        break;

      case "Register":
        try {
          const endpoint =
            "personalIdCard" in data
              ? "register/individual"
              : "register/juristic";
          setLoading(true);
          const res = await api(endpoint, data, "json", "POST");
          console.log("endpoint", endpoint);
          console.log("Data", res);
          console.log("UserData", res.user);
          // บันทึกลง SecureStore

          if (res.status === "match") {
            await SecureStore.setItemAsync(
              "userData",
              JSON.stringify(res.user)
            );
            setUserData(res.user);
            setLoading(false);
            navigation.reset({
              index: 0,
              routes: [{ name: "PinSetup" }],
            });
          } else if (res.status === "notMatch") {
            setLoading(false);
            showAlert("ข้อมูลไม่ตรงกับฐานข้อมูล กรุณาลองใหม่อีกครั้ง");
            navigation.goBack();
            return;
          } else if (res.status === "notFound") {
            setLoading(false);
            showAlert("ไม่พบข้อมูลผู้ใช้ กรุณาลงทะเบียนใหม่");
            navigation.goBack();
            return;
          } else if (res.status === "registered") {
            setLoading(false);
            showAlert("เบอร์นี้ได้ลงทะเบียนไปแล้ว กรุณาเข้าสู่ระบบ");
            navigation.replace("Login");
            return;
          } else {
            setLoading(false);
            showAlert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
            navigation.goBack();
            return;
          }
        } catch (error) {
          console.error("บันทึกข้อมูลผู้ใช้ไม่สำเร็จ", error);
        }
        break;

      case "Login":
        // สำหรับกรณี Login ธรรมดา
        console.log("Data", data);
        try {
          const res = await api("user-login", data, "json", "POST");
          console.log("res:", res);
          console.log("getLogin res:", res.user);
          if (res.status === "match") {
            await SecureStore.setItemAsync(
              "userData",
              JSON.stringify(res.user)
            );
            setUserData(res.user);
            setLoading(false);
            navigation.replace("PinSetup");
            return res.status;
          }
          setLoading(false);
          showAlert("ไม่สามารถดึงข้อมูลเงินฝากได้ กรุณาลองใหม่อีกครั้ง");
          navigation.goBack();
          return res.status;
        } catch (error) {
          console.error("Error getLoanInfo:", error);
          setLoading(false);
        }

        break;

      default:
        // กรณีไม่ได้กำหนด from มา
        console.warn(`Unknown source: ${from}`);
        break;
    }
  };

  const handleResendOtp = async () => {
    console.log("Resend OTP to:", phoneNumber);
    await new Promise((res) => setTimeout(res, 1000));
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={26} color="#CFA459" />
      </TouchableOpacity>

      <Text style={styles.title}>ยืนยัน OTP</Text>

      <Image
        source={require("../../../assets/CapitalLink.png")}
        style={styles.logo}
      />

      <OtpVerification
        phoneNumber={phoneNumber}
        onVerify={handleVerifyOtp}
        onResendOtp={handleResendOtp}
      />

      <Text style={styles.supportText}>
        หากต้องการความช่วยเหลือ กรุณาติดต่อศูนย์บริการลูกค้า
      </Text>
    </SafeAreaView>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 60,
    marginBottom: 20,
    color: "#333",
  },
  logo: {
    width: width * 0.7,
    height: width * 0.35,
    marginVertical: 10,
  },
  supportText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 18,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 999,
  },
});
