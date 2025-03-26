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

const { width } = Dimensions.get("window");

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [fontsLoaded] = useFonts({
    TimesNewRoman: require('../../../assets/fonts/times new roman bold.ttf'),
  });

  // ประเภท user
  const [userType, setUserType] = useState<"บุคคลธรรมดา" | "นิติบุคคล">("บุคคลธรรมดา");

  // State เก็บค่าฟอร์ม
  const [idCard, setIdCard] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [taxId, setTaxId] = useState("");
  const [companyRegisterNumber, setCompanyRegisterNumber] = useState("");
  const [contactPerson, setContactPerson] = useState("");

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#cfa459" />
      </View>
    );
  }

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
          value={idCard}
          onChangeText={setIdCard}
          keyboardType="number-pad"
          maxLength={13}
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
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      <Text style={styles.inputLabel}>วันเดือนปีเกิด</Text>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="date-range" size={20} color="#999999" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#AAAAAA"
          value={birthDate}
          onChangeText={setBirthDate}
        />
      </View>
    </>
  );

  const renderCorporateForm = () => (
    <>
      <Text style={styles.inputLabel}>เลขประจำตัวผู้เสียภาษี</Text>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="file-document-outline" size={20} color="#999999" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="X-XXXX-XXXXX-XX-X"
          placeholderTextColor="#AAAAAA"
          value={taxId}
          onChangeText={setTaxId}
          keyboardType="number-pad"
          maxLength={13}
        />
      </View>

      <Text style={styles.inputLabel}>เลขทะเบียนนิติบุคคล</Text>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="office-building-outline" size={20} color="#999999" />
        </View>
        <TextInput
          style={styles.input}
          placeholder="XXXXXXXXXXXX"
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
        {/* ปุ่มย้อนกลับ (ไปหน้าแรก) */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.replace("InitialEntry")}>
          <Ionicons name="chevron-back" size={24} color="#CFA459" />
          {/* <Text style={styles.backButtonText}>กลับหน้าหลัก</Text> */}
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/CLlogo+NoBG.png')}
            style={styles.logo}
            
          />
  
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, userType === "บุคคลธรรมดา" && styles.tabActive]}
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

        {/* Form */}
        <View style={styles.formContainer}>
          {userType === "บุคคลธรรมดา"
            ? renderPersonalForm()
            : renderCorporateForm()}

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("OtpVerification", { from: "Register" })}
          >
            <LinearGradient
              colors={["#e6c170", "#d4af71", "#c19346"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.otpButton}
            >
              <Text style={styles.otpButtonText}>ขอรหัส OTP</Text>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pinLoginContainer}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.pinLoginText}>เข้าสู่ระบบ</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  /* ปุ่มย้อนกลับ */
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
  },
  backButtonText: {
    color: "#CFA459",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 5,
  },

  /* Logo */
  logoContainer: {
    alignItems: "center",
    // backgroundColor: "pink"
  },
  logo: {
    width: width * 0.9,
    height: width * 0.5,
    resizeMode: "contain",
     marginBottom: 5,
    // marginTop: 20,
  },

  /* Tabs */
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#CFA459",
  },
  tabText: {
    fontSize: 16, // bigger for older users
    color: "#AAAAAA",
  },
  tabTextActive: {
    color: "#CFA459",
    fontWeight: "700",
  },

  /* Form */
  formContainer: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16, // bigger for older users
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
    height: 48, // slightly bigger
  },
  iconContainer: {
    width: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingRight: 15,
    color: "#333333",
    fontSize: 16, // bigger
  },

  /* ปุ่มขอ OTP */
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
    fontSize: 18, // bigger
    marginRight: 8,
  },

  /* ปุ่มเข้าสู่ระบบแบบลิงก์ */
  pinLoginContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  pinLoginText: {
    color: "#CFA459",
    fontSize: 16,
    fontWeight: "600",
  },
  
});
