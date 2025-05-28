import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  DataUserType,
  DepositInfo,
  LoanInfo,
  RegisterIndividualType,
  RegisterJuristicType,
} from "../../Data/UserDataStorage";
import {
  DataUser,
  mockLoanInfos,
  RegisterIndividual,
  RegisterJuristic,
} from "../../Data/UserDataStorage";
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";
import { mockNotifications, type Notification } from "../../Data/NotiData";
import CustomAlertModal from "../../components/common/CustomAlertModal";
import { ActivityIndicator, View } from "react-native";
import { api } from "../../../API/route";
const DataContext = createContext(null);

export function useData() {
  return useContext(DataContext);
}

export const DataProvider = ({ children }) => {
  const [UserData, setUserData] = useState<DataUserType>();
  // const [individualData, setIndividualData] =
  //   useState<RegisterIndividualType>(RegisterIndividual);
  // const [juristicData, setJuristicData] =
  //   useState<RegisterJuristicType>(RegisterJuristic);
  const [loanData, setLoanData] = useState<LoanInfo[]>(mockLoanInfos);
  const [depositData, setDepositData] = useState<DepositInfo[]>([]); // Initialize with an empty array
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [DataUserPending, setDataUserPending] =
    useState<DataUserType>(DataUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });
  const showAlert = (message: string) => {
    setAlert({ visible: true, message });
  };
  const getDepositInfo = async () => {
    console.log("getDepositInfo");
    setLoading(true);
    let data = {};
    if (UserData.userType === "individual") {
    }
    switch (UserData.userType) {
      case "individual":
        data = {
          personalIdCard: UserData.personalIdCard,
          phone: UserData.phone,
          userType: "individual",
        };
        break;

      case "juristic":
        data = {
          personalIdCard: UserData.contactIdCard,
          phone: UserData.phone,
          userType: "juristic",
        };
        break;

      default:
        console.warn("Unknown userType:", UserData.userType);
        setLoading(false);
        return;
    }
    try {
      const res = await api("account/DepositInfo", data, "json", "POST");
      console.log("res:", res);
      console.log("getDepositInfo res:", res.accounts);
      if (res.status === "ok") {
        setDepositData(res.accounts);
        setLoading(false);
        return res.status;
      }
      setLoading(false);
      showAlert("ไม่สามารถดึงข้อมูลเงินฝากได้ กรุณาลองใหม่อีกครั้ง");
      return res.status;
    } catch (error) {
      console.error("Error getDepositInfo:", error);
      setLoading(false);
    }
  };
  const getLoanInfo = async () => {
    console.log("getLoanInfo");
    setLoading(true);
    let data = {};
    if (UserData.userType === "individual") {
    }
    switch (UserData.userType) {
      case "individual":
        data = {
          personalIdCard: UserData.personalIdCard,
          phone: UserData.phone,
          userType: "individual",
        };
        break;

      case "juristic":
        data = {
          personalIdCard: UserData.contactIdCard,
          phone: UserData.phone,
          userType: "juristic",
        };
        break;

      default:
        console.warn("Unknown userType:", UserData.userType);
        setLoading(false);
        return;
    }
    try {
      const res = await api("account/LoanInfo", data, "json", "POST");
      console.log("getLoanInfo res:", res.accounts);
      if (res.status === "ok") {
        setLoanData(res.accounts);
        setLoading(false);
        return res.status;
      }
      setLoading(false);
      showAlert("ไม่สามารถดึงข้อมูลเงินฝากได้ กรุณาลองใหม่อีกครั้ง");
      return res.status;
    } catch (error) {
      console.error("Error getLoanInfo:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync("userData");
        console.log("UserData Loading", stored);
        if (stored) {
          setUserData(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load userData from SecureStore", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <DataContext.Provider
      value={{
        UserData,
        setUserData,
        DataUserPending,
        setDataUserPending,
        loanData,
        setLoanData,
        notifications,
        setNotifications,
        loading,
        setLoading,
        alert,
        setAlert,
        showAlert,
        depositData,
        getDepositInfo,
        getLoanInfo,
      }}
    >
      {children}
      {loading && (
        <View style={styles.overlay} pointerEvents="auto">
          <ActivityIndicator size="large" color="#CFA459" />
        </View>
      )}
      <CustomAlertModal
        visible={alert.visible}
        message={alert.message}
        onlyConfirm={true}
        onConfirm={() => setAlert({ visible: false, message: "" })}
        onCancel={() => setAlert({ visible: false, message: "" })}
      />
    </DataContext.Provider>
  );
};
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
});
