// RegisterScreen.tsx
import React, { useEffect, useState } from "react";
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
import { formatPhoneNumber, formatThaiID } from "../../utils/formatPhoneAndID";
import { isValidThaiID } from "../../utils/isValidThaiID";
import CustomAlertModal from "../../components/common/CustomAlertModal";
// นำเข้าคอมโพเนนต์ ThaiDatePicker ที่ปรับปรุงแล้ว
import ThaiDatePicker from "../../components/common/ThaiDatePicker";
import MaskInput from "react-native-mask-input";
import { mockRequestOtp } from "../../services/mockApi";
import { useData } from "../../Provide/Auth/UserDataProvide";
import DatePicker from "../../components/common/DatePicker";

const { width } = Dimensions.get("window");

// ตั้งค่า default date เป็น 1 มกราคมของปีปัจจุบัน
const defaultDate = new Date(new Date().getFullYear(), 0, 1);
type UserType = "บุคคลธรรมดา" | "นิติบุคคล";
const RegisterScreen: React.FC = () => {
  const { UserData, setUserData } = useData();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman bold.ttf"),
  });

  const [userType, setUserType] = useState<UserType>("บุคคลธรรมดา");
  // State สำหรับข้อมูลฟอร์ม
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [companyRegisterNumber, setCompanyRegisterNumber] = useState("");
  const [personalIdCard, setPersonalIdCard] = useState("");
  const [contactIdCard, setContactIdCard] = useState("");
  // State สำหรับ Date Picker – เริ่ม default เป็น 1 มกราคมของปีปัจจุบัน
  const [date, setDate] = useState<Date>(defaultDate);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#cfa459" />
      </View>
    );
  }
  useEffect(() => {
    const CheckdocInCom = () => {
      if (UserData.statusUser === "docInCom") {
        showAlert(
          "ไม่สามารถดำเนินการสมัครได้ เนื่องจากข้อมูลที่กรอกไม่ถูกต้อง กรุณาตรวจสอบและแก้ไขข้อมูลให้ครบถ้วนและถูกต้องก่อนดำเนินการอีกครั้ง"
        );
      }
    };
    CheckdocInCom();
  }, []);
  const showAlert = (message: string) => {
    setAlert({ visible: true, message });
  };

  const handlePhoneChange = (input: string) => {
    const digits = input.replace(/\D/g, "").substring(0, 10);
    setPhoneNumber(digits);
  };

  const handleRequestOtp = async () => {
    const rawPersonalId = personalIdCard.replace(/\D/g, "");
    const rawCompanyReg = companyRegisterNumber.replace(/\D/g, "");
    const rawContactId = contactIdCard.replace(/\D/g, "");

    if (userType === "บุคคลธรรมดา") {
      if (rawPersonalId.length !== 13) {
        return showAlert("กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก");
      }
      if (!isValidThaiID(rawPersonalId)) {
        return showAlert("เลขบัตรประชาชนไม่ถูกต้อง");
      }
      if (!birthDate) {
        return showAlert("กรุณาเลือกวันเกิด");
      }
    } else {
      if (rawCompanyReg.length !== 13) {
        return showAlert("กรุณากรอกเลขทะเบียนนิติบุคคลให้ครบ 13 หลัก");
      }
      if (rawContactId.length !== 13) {
        return showAlert("กรุณากรอกเลขบัตรประชาชนผู้ติดต่อให้ครบ 13 หลัก");
      }
      if (!isValidThaiID(rawContactId)) {
        return showAlert("เลขบัตรประชาชนผู้ติดต่อไม่ถูกต้อง");
      }
    }

    if (phoneNumber.length !== 10) {
      return showAlert("กรุณากรอกเบอร์โทรให้ครบ 10 หลัก");
    }

    try {
      setLoading(true);
      await mockRequestOtp(phoneNumber);

      // บันทึกข้อมูลผู้ใช้ลง Context
      setUserData((prev) => ({
        ...prev,
        userType,
        personalIdCard: userType === "บุคคลธรรมดา" ? rawPersonalId : undefined,
        birthDate: userType === "บุคคลธรรมดา" ? birthDate : undefined,
        companyRegisterNumber:
          userType === "นิติบุคคล" ? rawCompanyReg : undefined,
        contactIdCard: userType === "นิติบุคคล" ? rawContactId : undefined,
        phone: phoneNumber,
      }));

      navigation.navigate("OtpVerification", { from: "Register", phoneNumber });
    } catch (err) {
      console.error("ขอ OTP ไม่สำเร็จ", err);
      showAlert("ไม่สามารถขอรหัส OTP ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  // เมื่อได้รับวันที่จาก ThaiDatePicker ให้ update state date และ birthDate (แปลงเป็น พ.ศ.)
  const handleDateChange = (selectedDate: Date) => {
    handleSaveDate();
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
        <MaskInput
          style={styles.input}
          placeholder="X-XXXX-XXXXX-XX-X"
          placeholderTextColor="#AAAAAA"
          keyboardType="number-pad"
          value={personalIdCard}
          onChangeText={(masked, unmasked) => setPersonalIdCard(unmasked)}
          mask={[
            /\d/,
            "-",
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            "-",
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            "-",
            /\d/,
            /\d/,
            "-",
            /\d/,
          ]}
        />
      </View>
      {UserData.statusUser === "docInCom" &&
        UserData.errors.personalIdCard &&
        UserData.userType === "บุคคลธรรมดา" && (
          <Text style={styles.hintTextError}>
            **{UserData.errors.personalIdCard}
          </Text>
        )}
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
      {UserData.statusUser === "docInCom" &&
        UserData.errors.phone &&
        UserData.userType === "บุคคลธรรมดา" && (
          <Text style={styles.hintTextError}>**{UserData.errors.phone}</Text>
        )}
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
      {UserData.statusUser === "docInCom" &&
        UserData.errors.birthDate &&
        UserData.userType === "บุคคลธรรมดา" && (
          <Text style={styles.hintTextError}>
            **{UserData.errors.birthDate}
          </Text>
        )}
      {/* แสดง ThaiDatePicker popup */}
      {/* <ThaiDatePicker
        visible={showCustomDatePicker}
        date={date}
        onChange={handleDateChange}
        onClose={handleCloseDatePicker}
        onSave={handleSaveDate}
      /> */}
      <DatePicker
        visible={showCustomDatePicker}
        date={date}
        onChange={handleDateChange}
        onClose={handleCloseDatePicker}
        // onSave={handleSaveDate}
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
      {UserData.statusUser === "docInCom" &&
        UserData.errors.contactIdCard &&
        UserData.userType === "นิติบุคคล" && (
          <Text style={styles.hintTextError}>
            **{UserData.errors.contactIdCard}
          </Text>
        )}
      <Text style={styles.inputLabel}>เลขบัตรประชาชน</Text>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={20} color="#999999" />
        </View>
        <MaskInput
          style={styles.input}
          placeholder="X-XXXX-XXXXX-XX-X"
          placeholderTextColor="#AAAAAA"
          keyboardType="number-pad"
          value={contactIdCard}
          onChangeText={(masked, unmasked) => setContactIdCard(unmasked)}
          mask={[
            /\d/,
            "-",
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            "-",
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            "-",
            /\d/,
            /\d/,
            "-",
            /\d/,
          ]}
        />
      </View>
      {UserData.statusUser === "docInCom" &&
        UserData.errors.personalIdCard &&
        UserData.userType === "นิติบุคคล" && (
          <Text style={styles.hintTextError}>
            **{UserData.errors.personalIdCard}
          </Text>
        )}
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
      {UserData.statusUser === "docInCom" &&
        UserData.errors.phone &&
        UserData.userType === "นิติบุคคล" && (
          <Text style={styles.hintTextError}>**{UserData.errors.phone}</Text>
        )}
      {phoneNumber.length < 10 && phoneNumber.length > 0 && (
        <Text style={styles.hintText}>
          กรุณากรอกเบอร์โทร 10 หลัก เช่น 0812345678
        </Text>
      )}
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
              disabled={loading}
            >
              <LinearGradient
                colors={["#e6c170", "#d4af71", "#c19346"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={[styles.otpButton, loading && { opacity: 0.6 }]}
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
        <CustomAlertModal
          visible={alert.visible}
          message={alert.message}
          onlyConfirm={true}
          onConfirm={() => setAlert({ visible: false, message: "" })}
          onCancel={() => setAlert({ visible: false, message: "" })}
        />
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
  hintTextError: { fontSize: 12, color: "red", marginBottom: 12 },
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
