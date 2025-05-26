import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  DataUserType,
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
const DataContext = createContext(null);

export function useData() {
  return useContext(DataContext);
}

export const DataProvider = ({ children }) => {
  const [UserData, setUserData] = useState<DataUserType>(DataUser);
  const [individualData, setIndividualData] =
    useState<RegisterIndividualType>(RegisterIndividual);
  const [juristicData, setJuristicData] =
    useState<RegisterJuristicType>(RegisterJuristic);
  const [loanData, setLoanData] = useState<LoanInfo[]>(mockLoanInfos);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [DataUserPending, setDataUserPending] =
    useState<DataUserType>(DataUser);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync("userData");
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
  useEffect(() => {
    AsyncStorage.setItem("userData", JSON.stringify(UserData));
  }, [UserData]);
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
