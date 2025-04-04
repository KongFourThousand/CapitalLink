// import React, { useState } from "react";
// import {
//   SafeAreaView,
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Switch,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../../navigation/RootNavigator";
// import { LinearGradient } from "expo-linear-gradient";

// type NotificationSettingsScreenNavProp = NativeStackNavigationProp<
//   RootStackParamList,
//   "NotificationSettings"
// >;

// // ประเภทของการแจ้งเตือนในแอพ
// interface NotificationSetting {
//   id: string;
//   title: string;
//   description: string;
//   enabled: boolean;
// }

// const NotificationSettingsScreen: React.FC = () => {
//   const navigation = useNavigation<NotificationSettingsScreenNavProp>();
  
//   // สถานะหลักของการแจ้งเตือน
//   const [mainNotificationEnabled, setMainNotificationEnabled] = useState(true);
  
//   // สถานะการโหลด
//   const [isLoading, setIsLoading] = useState(false);
  
//   // การตั้งค่าประเภทการแจ้งเตือนย่อย
//   const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
//     {
//       id: "transaction",
//       title: "การทำธุรกรรม",
//       description: "แจ้งเตือนเมื่อมีการฝาก ถอน หรือโอนเงิน",
//       enabled: true,
//     },
//     {
//       id: "news",
//       title: "ข่าวสารและโปรโมชัน",
//       description: "ข้อมูลข่าวสาร สิทธิพิเศษ และโปรโมชันต่างๆ",
//       enabled: true,
//     },
//     {
//       id: "account",
//       title: "ข้อมูลบัญชี",
//       description: "การเปลี่ยนแปลงข้อมูลบัญชีและการเข้าสู่ระบบ",
//       enabled: true,
//     },
//     {
//       id: "reminder",
//       title: "การเตือนการชำระเงิน",
//       description: "แจ้งเตือนเมื่อใกล้ถึงกำหนดชำระเงิน",
//       enabled: false,
//     },
//     {
//       id: "balance",
//       title: "รายงานยอดเงินคงเหลือ",
//       description: "สรุปยอดเงินคงเหลือประจำเดือน",
//       enabled: false,
//     },
//   ]);

//   // ฟังก์ชันกดปุ่ม Back → กลับหน้าเดิม
//   const handleBack = () => {
//     navigation.goBack();
//   };

//   // ฟังก์ชันเปลี่ยนสถานะการแจ้งเตือนหลัก
//   const handleMainToggle = (value: boolean) => {
//     setMainNotificationEnabled(value);
    
//     // ถ้าปิดการแจ้งเตือนหลัก ให้ปิดการแจ้งเตือนย่อยทั้งหมดด้วย
//     if (!value) {
//       const updatedSettings = notificationSettings.map(setting => ({
//         ...setting,
//         enabled: false,
//       }));
//       setNotificationSettings(updatedSettings);
//     } else {
//       // ถ้าเปิดการแจ้งเตือนหลัก ให้เปิดการแจ้งเตือนย่อยที่สำคัญ
//       const updatedSettings = notificationSettings.map(setting => ({
//         ...setting,
//         // เปิดเฉพาะการแจ้งเตือนที่สำคัญ เช่น การทำธุรกรรมและข้อมูลบัญชี
//         enabled: ['transaction', 'account'].includes(setting.id) ? true : setting.enabled,
//       }));
//       setNotificationSettings(updatedSettings);
//     }
//   };

//   // ฟังก์ชันเปลี่ยนสถานะการแจ้งเตือนย่อย
//   const handleSettingToggle = (id: string, value: boolean) => {
//     const updatedSettings = notificationSettings.map(setting => {
//       if (setting.id === id) {
//         return {
//           ...setting,
//           enabled: value,
//         };
//       }
//       return setting;
//     });
    
//     setNotificationSettings(updatedSettings);
    
//     // ถ้าเปิดการแจ้งเตือนย่อยใดๆ ให้เปิดการแจ้งเตือนหลักด้วย
//     if (value && !mainNotificationEnabled) {
//       setMainNotificationEnabled(true);
//     }
//   };

//   // ฟังก์ชันบันทึกการตั้งค่า
//   const handleSaveSettings = () => {
//     setIsLoading(true);
    
//     // สมมติว่าบันทึกการตั้งค่าไปยัง API
//     setTimeout(() => {
//       setIsLoading(false);
      
//       // แสดงแจ้งเตือนบันทึกสำเร็จ
//       Alert.alert(
//         "บันทึกการตั้งค่าสำเร็จ",
//         "การตั้งค่าการแจ้งเตือนของคุณถูกบันทึกเรียบร้อยแล้ว",
//         [
//           {
//             text: "ตกลง",
//             onPress: () => navigation.navigate("Profile"),
//           },
//         ]
//       );
//     }, 1500);
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {/* ปุ่ม Back */}
//       <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
//         <Ionicons name="chevron-back" size={26} color="#CFA459" />
//       </TouchableOpacity>

//       {/* Header Title */}
//       <Text style={styles.headerTitle}>ตั้งค่าการแจ้งเตือน</Text>

//       <ScrollView contentContainerStyle={styles.contentContainer}>
//         {/* การตั้งค่าการแจ้งเตือนหลัก */}
//         <View style={styles.mainSettingCard}>
//           <View style={styles.mainSettingContent}>
//             <View>
//               <Text style={styles.mainSettingTitle}>เปิดการแจ้งเตือน</Text>
//               <Text style={styles.mainSettingDescription}>
//                 ข้อความแจ้งเตือนจะถูกส่งไปยังหน้าจออุปกรณ์ของคุณ
//               </Text>
//             </View>
            
//             <Switch
//               value={mainNotificationEnabled}
//               onValueChange={handleMainToggle}
//               trackColor={{ false: "#D1D1D6", true: "#CFA45980" }}
//               thumbColor={mainNotificationEnabled ? "#CFA459" : "#F4F4F4"}
//               ios_backgroundColor="#D1D1D6"
//               style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
//             />
//           </View>
//         </View>

//         {/* การตั้งค่าประเภทการแจ้งเตือน */}
//         <Text style={styles.sectionLabel}>ประเภทการแจ้งเตือน</Text>
        
//         <View style={styles.settingsContainer}>
//           {notificationSettings.map((setting) => (
//             <View key={setting.id} style={styles.settingItem}>
//               <View style={styles.settingInfo}>
//                 <Text style={styles.settingTitle}>{setting.title}</Text>
//                 <Text style={styles.settingDescription}>{setting.description}</Text>
//               </View>
              
//               <Switch
//                 value={mainNotificationEnabled && setting.enabled}
//                 onValueChange={(value) => handleSettingToggle(setting.id, value)}
//                 disabled={!mainNotificationEnabled}
//                 trackColor={{ false: "#D1D1D6", true: "#CFA45980" }}
//                 thumbColor={
//                   !mainNotificationEnabled
//                     ? "#F4F4F4"
//                     : setting.enabled
//                     ? "#CFA459"
//                     : "#F4F4F4"
//                 }
//                 ios_backgroundColor="#D1D1D6"
//                 style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
//               />
//             </View>
//           ))}
//         </View>

//         {/* หมายเหตุการตั้งค่า */}
//         <View style={styles.noteContainer}>
//           <Text style={styles.noteTitle}>หมายเหตุ:</Text>
//           <Text style={styles.noteText}>
//             - การแจ้งเตือนจะถูกส่งไปยังอุปกรณ์ที่คุณลงชื่อเข้าใช้งานล่าสุด
//           </Text>
//           <Text style={styles.noteText}>
//             - คุณอาจต้องเปิดการแจ้งเตือนในตั้งค่าอุปกรณ์ของคุณเพื่อให้ใช้งานได้
//           </Text>
//           <Text style={styles.noteText}>
//             - การแจ้งเตือนที่สำคัญเกี่ยวกับความปลอดภัยจะยังคงถูกส่งแม้ว่าคุณจะปิดการแจ้งเตือน
//           </Text>
//         </View>

//         {/* ปุ่มบันทึกการตั้งค่า */}
//         <LinearGradient
//           colors={["#c49a45", "#d4af71", "#e0c080"]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.saveGradient}
//         >
//           <TouchableOpacity
//             style={styles.saveButton}
//             onPress={handleSaveSettings}
//             activeOpacity={0.8}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="#FFF" size="small" />
//             ) : (
//               <Text style={styles.saveButtonText}>บันทึกการตั้งค่า</Text>
//             )}
//           </TouchableOpacity>
//         </LinearGradient>

//         {/* Spacer สำหรับ ScrollView */}
//         <View style={{ height: 30 }} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default NotificationSettingsScreen;

// // --- Styles ---
// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//   },
//   backButton: {
//     position: "absolute",
//     top: 40,
//     left: 18,
//     flexDirection: "row",
//     alignItems: "center",
//     zIndex: 999,
//   },
// //   headerTitle: {
// //     fontSize: 20,
// //     fontWeight: "