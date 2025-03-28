// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Ionicons from "@expo/vector-icons/Ionicons";

// // นำเข้าหน้าต่างๆ ที่จะอยู่ในแท็บ
// import HomeScreen from "../screens/home/HomeScreen";
// import AccountScreen from "../screens/accounts/AccountScreen";

// // สร้าง stub components สำหรับหน้าที่ยังไม่มี (ชั่วคราว)
// const NotificationScreen = () => <></>;
// const ProfileScreen = () => <></>;

// // ถ้าต้องการสร้างจริงๆ ให้ uncomment และสร้างไฟล์เหล่านี้
// // import NotificationScreen from "../screens/notifications/NotificationScreen";
// // import ProfileScreen from "../screens/profile/ProfileScreen";

// // กำหนด types สำหรับ Tab Navigator
// export type MainTabParamList = {
//   HomeTab: undefined;
//   AccountsTab: undefined;
//   NotifyTab: undefined;
//   ProfileTab: undefined;
// };

// const Tab = createBottomTabNavigator<MainTabParamList>();

// const MainTabNavigator: React.FC = () => {
//   return (
//     <Tab.Navigator
//       id={undefined} // เพิ่ม id={undefined} เพื่อแก้ไข TypeScript error
//       screenOptions={({ route }) => ({
//         headerShown: false,             // ปิดหัว default
//         tabBarActiveTintColor: "#CFA459",
//         tabBarInactiveTintColor: "#888",
//         tabBarLabelStyle: { fontSize: 12 },
//         tabBarStyle: {
//           backgroundColor: "#fff",
//           borderTopWidth: 1,
//           borderTopColor: "#eee",
//           elevation: 8, // Android shadow
//         },
//         tabBarIcon: ({ color, size, focused }) => {
//           let iconName: string = "home-outline";
//           if (route.name === "HomeTab") {
//             iconName = focused ? "home" : "home-outline";
//           } else if (route.name === "AccountsTab") {
//             iconName = focused ? "card" : "card-outline";
//           } else if (route.name === "NotifyTab") {
//             iconName = focused ? "notifications" : "notifications-outline";
//           } else if (route.name === "ProfileTab") {
//             iconName = focused ? "person" : "person-outline";
//           }
//           // ติด TypeScript error? => as assertion
//           return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen
//         name="HomeTab"
//         component={HomeScreen}
//         options={{ title: "หน้าหลัก" }}
//       />
//       <Tab.Screen
//         name="AccountsTab"
//         component={AccountScreen}
//         options={{ title: "บัญชี" }}
//       />
//       <Tab.Screen
//         name="NotifyTab"
//         component={NotificationScreen}
//         options={{ title: "แจ้งเตือน" }}
//       />
//       <Tab.Screen
//         name="ProfileTab"
//         component={ProfileScreen}
//         options={{ title: "โปรไฟล์" }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default MainTabNavigator;