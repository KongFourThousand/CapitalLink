// RegisterScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import {
  formatPhoneNumber,
  formatThaiID,
} from "../../components/common/formatPhoneAndID";

// นำเข้าคอมโพเนนต์ ThaiDatePicker ที่ปรับปรุงแล้ว
import ThaiDatePicker from "../../components/common/ThaiDatePicker";

const { width } = Dimensions.get("window");

// ตั้งค่า default date เป็น 1 มกราคมของปีปัจจุบัน
const defaultDate = new Date(new Date().getFullYear(), 0, 1);

const RegisterScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman bold.ttf"),
  });

  const [userType, setUserType] = useState<"บุคคลธรรมดา" | "นิติบุคคล">(
    "บุคคลธรรมดา"
  );

  // State สำหรับข้อมูลฟอร์ม
  const [idCard, setIdCard] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [taxId, setTaxId] = useState("");
  const [companyRegisterNumber, setCompanyRegisterNumber] = useState("");
  const [contactPerson, setContactPerson] = useState("");

  // State สำหรับ Date Picker – เริ่ม default เป็น 1 มกราคมของปีปัจจุบัน
  const [date, setDate] = useState<Date>(defaultDate);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#cfa459" />
      </View>
    );
  }

  const handlePhoneChange = (input: string) => {
    const digits = input.replace(/\D/g, "").substring(0, 10);
    setPhoneNumber(digits);
  };

  const handleIdCardChange = (input: string) => {
    const digits = input.replace(/\D/g, "").substring(0, 13);
    setIdCard(digits);
  };

  const handleRequestOtp = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert("หมายเลขไม่ถูกต้อง", "กรุณากรอกเบอร์โทร 10 หลัก");
      return;
    }
    try {
      setLoading(true);
      // จำลองการขอ OTP (แทนที่ด้วย mockRequestOtp ในงานจริง)
      await Promise.resolve();
      navigation.navigate("OtpVerification", {
        from: "Register",
        phoneNumber: phoneNumber,
      });
    } catch (error) {
      console.log("ขอ OTP ไม่สำเร็จ:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถขอ OTP ได้");
    } finally {
      setLoading(false);
    }
  };

  // เมื่อได้รับวันที่จาก ThaiDatePicker ให้ update state date และ birthDate (แปลงเป็น พ.ศ.)
  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
    const day = selectedDate.getDate().toString().padStart(2, "0");
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = selectedDate.getFullYear() + 543;
    setBirthDate(`${day}/${month}/${year}`);
  };

  const showDatepicker = () => {
    setShowCustomDatePicker(true);
  };

  const handleCloseDatePicker = () => {
    setShowCustomDatePicker(false);
  };

  // เมื่อกดตกลงใน popup ให้ปิด popup (ThaiDatePicker จะ update ผ่าน onChange)
  const handleSaveDate = () => {
    setShowCustomDatePicker(false);
  };

  const renderPersonalForm = () => (
    <>
      <Text style={styles.inputLabel}>เลขบัตรประชาชน</Text>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={20} color="#999999" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="X-XXXX-XXXXX-XX-X"
          placeholderTextColor="#AAAAAA"
          keyboardType="number-pad"
          value={formatThaiID(idCard)}
          onChangeText={handleIdCardChange}
          maxLength={17}
        />
      </View>
      <Text style={styles.inputLabel}>เบอร์โทรศัพท์</Text>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome name="phone" size={20} color="#999999" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="0XX-XXX-XXXX"
          placeholderTextColor="#AAAAAA"
          value={formatPhoneNumber(phoneNumber)}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          maxLength={12}
        />
      </View>
      {phoneNumber.length < 10 && phoneNumber.length > 0 && (
        <Text style={styles.hintText}>
          กรุณากรอกเบอร์โทร 10 หลัก เช่น 0812345678
        </Text>
      )}
      <Text style={styles.inputLabel}>วันเดือนปีเกิด (พ.ศ.)</Text>
      <TouchableOpacity activeOpacity={0.7} onPress={showDatepicker}>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="date-range" size={20} color="#999999" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="วว/ดด/ปป"
            placeholderTextColor="#AAAAAA"
            value={birthDate}
            editable={false}
            pointerEvents="none"
          />
          <View style={styles.iconContainer}>
            <Ionicons name="calendar-outline" size={20} color="#CFA459" />
          </View>
        </View>
      </TouchableOpacity>
      {/* แสดง ThaiDatePicker popup */}
      <ThaiDatePicker
        visible={showCustomDatePicker}
        date={date}
        onChange={handleDateChange}
        onClose={handleCloseDatePicker}
        onSave={handleSaveDate}
      />
    </>
  );

  const renderCorporateForm = () => (
    <>
      <Text style={styles.inputLabel}>เลขทะเบียนนิติบุคคล</Text>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="office-building-outline"
            size={20}
            color="#999999"
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder=" x-xx-x-xxx-xxxxx-x"
          placeholderTextColor="#AAAAAA"
          value={companyRegisterNumber}
          onChangeText={setCompanyRegisterNumber}
          keyboardType="number-pad"
        />
      </View>
      <Text style={styles.inputLabel}>ผู้ติดต่อ</Text>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="people-outline" size={20} color="#999999" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="ชื่อผู้ติดต่อ"
          placeholderTextColor="#AAAAAA"
          value={contactPerson}
          onChangeText={setContactPerson}
        />
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.replace("InitialEntry")}
          >
            <Ionicons name="chevron-back" size={24} color="#CFA459" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/CLlogo+NoBG.png")}
              style={styles.logo}
            />
          </View>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                userType === "บุคคลธรรมดา" && styles.tabActive,
              ]}
              onPress={() => setUserType("บุคคลธรรมดา")}
            >
              <Text
                style={[
                  styles.tabText,
                  userType === "บุคคลธรรมดา" && styles.tabTextActive,
                ]}
              >
                บุคคลธรรมดา
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, userType === "นิติบุคคล" && styles.tabActive]}
              onPress={() => setUserType("นิติบุคคล")}
            >
              <Text
                style={[
                  styles.tabText,
                  userType === "นิติบุคคล" && styles.tabTextActive,
                ]}
              >
                นิติบุคคล
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formContainer}>
            {userType === "บุคคลธรรมดา"
              ? renderPersonalForm()
              : renderCorporateForm()}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleRequestOtp}
              disabled={phoneNumber.length < 10 || loading}
            >
              <LinearGradient
                colors={["#e6c170", "#d4af71", "#c19346"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={[
                  styles.otpButton,
                  (phoneNumber.length < 10 || loading) && { opacity: 0.6 },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Text style={styles.otpButtonText}>ขอรหัส OTP</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#FFFFFF"
                    />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pinLoginContainer}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.pinLoginText}>เข้าสู่ระบบ</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, paddingHorizontal: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  backButton: {
    position: "absolute",
    top: 55,
    zIndex: 99,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 70,
  },

  logo: {
    width: width * 0.9,
    height: width * 0.5,
    resizeMode: "contain",
    marginBottom: 5,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabActive: { borderBottomWidth: 2, borderBottomColor: "#CFA459" },
  tabText: { fontSize: 16, color: "#AAAAAA" },
  tabTextActive: { color: "#CFA459", fontWeight: "700" },
  formContainer: { marginTop: 20, paddingBottom: 30 },
  inputLabel: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 5,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    height: 48,
  },
  iconContainer: { width: 45, alignItems: "center", justifyContent: "center" },
  input: {
    flex: 1,
    height: "100%",
    paddingRight: 15,
    color: "#333333",
    fontSize: 16,
  },
  hintText: { fontSize: 12, color: "#999", marginBottom: 12 },
  otpButton: {
    borderRadius: 8,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  otpButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 18,
    marginRight: 8,
  },
  pinLoginContainer: { alignItems: "center", marginTop: 15 },
  pinLoginText: { color: "#CFA459", fontSize: 16, fontWeight: "600" },
});
