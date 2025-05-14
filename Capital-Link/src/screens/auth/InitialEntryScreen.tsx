import type React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootNavigator";
import { useFonts } from "expo-font";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const InitialEntryScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [fontsLoaded] = useFonts({
    TimesNewRoman: require("../../../assets/fonts/times new roman bold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/CLlogo+NoBG.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {/* ลงทะเบียน */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Register")}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={["#FFFFFF", "#F5F5F5"]}
              style={styles.button}
            >
              <Feather
                name="user"
                size={28}
                color="#CFA459"
                style={styles.icon}
              />
              <Text style={[styles.buttonText, styles.registerText]}>
                เข้าใช้งานครั้งแรก
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* เข้าสู่ระบบ */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Login")}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={["#d4af71", "#c49a45"]}
              style={styles.button}
            >
              <Feather
                name="log-in"
                size={28}
                color="#FFFFFF"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default InitialEntryScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.9,
    height: width * 0.9,
  },
  /* บล็อกปุ่มทั้งหมด */
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 30,
    gap: 20,
  },
  /* แต่ละปุ่ม */
  buttonWrapper: {
    width: "100%",
    height: 70,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "TimesNewRoman",
  },
  registerText: {
    color: "#CFA459",
  },
});
