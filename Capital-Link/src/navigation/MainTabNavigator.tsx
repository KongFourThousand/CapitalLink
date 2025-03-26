// import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import HomeScreen from '../screens/home/HomeScreen';

// สมมติว่าเรามีหน้าต่างๆ เหล่านี้ (คุณต้องสร้างไฟล์พวกนี้ด้วย)
import NotificationScreen from '../screens/notifications/NotificationScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator();

// สร้าง Custom Bottom Tab
// ฟังก์ชันนี้จะสร้าง tab item แต่ละอัน
const CustomTabBarButton = ({
  label,
  isFocused,
  onPress,
  iconName,
  iconFamily = 'Ionicons',
}) => {
  const renderIcon = () => {
    if (iconFamily === 'FontAwesome5') {
      return (
        <FontAwesome5
          name={iconName}
          size={22}
          color={isFocused ? '#CFA459' : '#888'}
        />
      );
    }
    return (
      <Ionicons
        name={iconName}
        size={22}
        color={isFocused ? '#CFA459' : '#888'}
      />
    );
  };

  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {renderIcon()}
      <Text
        style={[
          styles.tabLabel,
          { color: isFocused ? '#CFA459' : '#888' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// Custom Tab Bar ทั้งแถบ
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // กำหนด Icon ตามชื่อ Route
        let iconName;
        let iconFamily = 'Ionicons';

        if (route.name === 'Home') {
          iconName = isFocused ? 'home' : 'home-outline';
        } else if (route.name === 'Notifications') {
          iconName = isFocused ? 'notifications' : 'notifications-outline';
        } else if (route.name === 'Profile') {
          iconName = isFocused ? 'person' : 'person-outline';
        } else if (route.name === 'Settings') {
          iconName = 'cog';
          iconFamily = 'FontAwesome5';
        }

        return (
          <CustomTabBarButton
            key={index}
            label={label}
            isFocused={isFocused}
            onPress={onPress}
            iconName={iconName}
            iconFamily={iconFamily}
          />
        );
      })}
    </View>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'หน้าหลัก',
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarLabel: 'แจ้งเตือน',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'โปรไฟล์',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'ตั้งค่า',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: 5,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});