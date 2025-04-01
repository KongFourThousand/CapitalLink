import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// แบบง่าย ไม่ต้องเชื่อมกับ RootStackParamList ที่อาจจะมีปัญหา
type AnyNavigation = NativeStackNavigationProp<any>;

// ประเภทของแท็บ
export type TabName = 'home' | 'account' | 'notification' | 'profile';

interface CustomTabBarProps {
  activeTab: TabName;
  onTabPress?: (tabName: TabName) => void;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ activeTab, onTabPress }) => {
  const navigation = useNavigation<AnyNavigation>();

  // ฟังก์ชันสำหรับจัดการเมื่อกดแท็บ
  const handleTabPress = (tabName: TabName) => {
    // ถ้ามีการส่ง onTabPress มาให้ใช้ฟังก์ชันนั้น
    if (onTabPress) {
      onTabPress(tabName);
      return;
    }

    // ใช้การนำทางแบบตรงๆ ไปยังหน้าที่ต้องการ
    switch (tabName) {
      case 'home':
        navigation.navigate('Home');
        break;
      case 'account':
        navigation.navigate('Account');
        break;
      case 'notification':
        // สร้างหน้านี้ถ้ายังไม่มี
        // navigation.navigate('NotificationScreen');
        console.log('Navigate to notification page');
        break;
      case 'profile':
        // สร้างหน้านี้ถ้ายังไม่มี
        // navigation.navigate('ProfileScreen');
        console.log('Navigate to profile page');
        break;
    }
  };

  return (
    <View style={styles.tabBar}>
      {/* หน้าหลัก */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => handleTabPress('home')}
      >
        <Ionicons 
          name={activeTab === 'home' ? "home" : "home-outline"} 
          size={22} 
          color={activeTab === 'home' ? "#CFA459" : "#616a76"} 
        />
        <Text 
          style={[
            styles.tabLabel, 
            activeTab === 'home' && styles.activeTab
          ]}
        >
          หน้าหลัก
        </Text>
      </TouchableOpacity>
      
      {/* บัญชี */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => handleTabPress('account')}
      >
        <Ionicons 
          name={activeTab === 'account' ? "card" : "card-outline"} 
          size={22} 
          color={activeTab === 'account' ? "#CFA459" : "#616a76"} 
        />
        <Text 
          style={[
            styles.tabLabel, 
            activeTab === 'account' && styles.activeTab
          ]}
        >
          บัญชี
        </Text>
      </TouchableOpacity>
      
      {/* การแจ้งเตือน */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => handleTabPress('notification')}
      >
        <Ionicons 
          name={activeTab === 'notification' ? "notifications" : "notifications-outline"} 
          size={22} 
          color={activeTab === 'notification' ? "#CFA459" : "#616a76"} 
        />
        <Text 
          style={[
            styles.tabLabel, 
            activeTab === 'notification' && styles.activeTab
          ]}
        >
          การแจ้งเตือน
        </Text>
      </TouchableOpacity>
      
      {/* โปรไฟล์ */}
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => handleTabPress('profile')}
      >
        <Ionicons 
          name={activeTab === 'profile' ? "person" : "person-outline"} 
          size={22} 
          color={activeTab === 'profile' ? "#CFA459" : "#616a76"} 
        />
        <Text 
          style={[
            styles.tabLabel, 
            activeTab === 'profile' && styles.activeTab
          ]}
        >
          โปรไฟล์
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 15,
    marginTop: 4,
    color: '#616a76',
  },
  activeTab: {
    color: '#CFA459', // เปลี่ยนเป็นสีทองตามธีมของแอป
    fontWeight: '600',
  },
});

export default CustomTabBar;