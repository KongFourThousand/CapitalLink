import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataUser, DataUserType } from "../../Data/UserDataStorage";
import * as SecureStore from "expo-secure-store";
const DataContext = createContext(null);

export function useData() {
  return useContext(DataContext);
}
export const DataProvider = ({ children }) => {
  const [UserData, setUserData] = useState<DataUserType>(DataUser);
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
    <DataContext.Provider value={{ UserData, setUserData }}>
      {children}
    </DataContext.Provider>
  );
};
