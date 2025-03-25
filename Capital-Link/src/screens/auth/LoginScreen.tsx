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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";

const { width } = Dimensions.get("window");

const LoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman.ttf"),
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Logo + Company Name */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/CLLogin.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.companyName}>CAPITAL LINK</Text>
          <Text style={styles.companySubtitle}>
            FINANCIAL GROUP PUBLIC COMPANY LIMITED
          </Text>
        </View>

        {/* Phone Input */}
        <Text style={styles.inputLabel}>เบอร์โทรศัพท์</Text>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <FontAwesome name="phone" size={18} color="#999999" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="0XX-XXX-XXXX"
            placeholderTextColor="#AAAAAA"
            keyboardType="phone-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity activeOpacity={0.9}>
          <LinearGradient
            colors={["#e6c170", "#d4af71", "#c19346"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotText}>ลืมรหัสผ่าน?</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>หรือ</Text>
          <View style={styles.divider} />
        </View>

        {/* Register Button */}
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate("Register")}>
          <LinearGradient
          colors={["#e6c170", "#d4af71", "#c19346"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.button}
          >
            <Text
              style={styles.buttonText}
            >
              ลงทะเบียนใหม่
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: width * 0.55,
    height: width * 0.28,
    marginTop: 40,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 16,
    color: "#CFA459",
    fontWeight: "500",
    fontFamily: "TimesNewRoman",
    marginBottom: 2,
  },
  companySubtitle: {
    fontSize: 11,
    color: "#AAAAAA",
    letterSpacing: 0.5,
    fontFamily: "TimesNewRoman",
  },
  inputLabel: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    marginBottom: 18,
    height: 45,
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingRight: 15,
    color: "#333333",
  },
  button: {
    borderRadius: 8,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  forgotText: {
    color: "#CFA459",
    fontSize: 13,
    textAlign: "center",
    marginVertical: 10,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#555555",
    fontSize: 13,
  },
});
