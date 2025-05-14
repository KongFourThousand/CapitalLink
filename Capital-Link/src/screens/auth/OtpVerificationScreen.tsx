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
type OtpRouteProp = RouteProp<RootStackParamList, "OtpVerification">;

const { width } = Dimensions.get("window");

const OtpVerificationScreen: React.FC = () => {
  const { UserData, setUserData, setDataUserPending, DataUserPending } =
    useData();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<OtpRouteProp>();

  const from = route.params?.from || "Login";
  const phoneNumber = route.params?.phoneNumber || "";

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
        try {
          // อัปเดต Context ว่าสถานะล็อกอินสำเร็จ
          const updatedData = {
            ...UserData,
            phone: phoneNumber,
          };
          setUserData(updatedData);

          // บันทึกลง SecureStore
          await SecureStore.setItemAsync(
            "userData",
            JSON.stringify(updatedData)
          );
          Alert.alert("เปลี่ยนเบอร์สำเร็จ", `เบอร์ของคุณคือ ${phoneNumber}`, [
            {
              text: "ตกลง",
              onPress: () => navigation.navigate("Profile"),
            },
          ]);
        } catch (error) {
          console.error("บันทึกข้อมูลผู้ใช้ไม่สำเร็จ", error);
        }
        break;

      case "Register":
        try {
          // อัปเดต Context ว่าสถานะล็อกอินสำเร็จ
          const updatedData = {
            ...DataUserPending,
            authToken: "true",
            // statusUser: "docSub", // ตั้งค่าเป็น docSub
          };
          setUserData(updatedData);

          // บันทึกลง SecureStore
          await SecureStore.setItemAsync(
            "userData",
            JSON.stringify(updatedData)
          );
          console.log("บันทึกข้อมูลผู้ใช้สำเร็จ", updatedData);

          // นำทางไปหน้ารออนุมัติ/ตั้งค่า PIN
          // navigation.replace("Pending");
          navigation.replace("PinSetup");
        } catch (error) {
          console.error("บันทึกข้อมูลผู้ใช้ไม่สำเร็จ", error);
        }
        break;

      case "Login":
        // สำหรับกรณี Login ธรรมดา
        setUserData(DataUserPending);
        await SecureStore.setItemAsync("userData", JSON.stringify(UserData));
        await SecureStore.setItemAsync("authToken", "true");
        navigation.replace("PinSetup");
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
