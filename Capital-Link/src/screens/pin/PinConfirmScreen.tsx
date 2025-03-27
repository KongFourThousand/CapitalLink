import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useFonts } from 'expo-font';

type PinConfirmNavProp = NativeStackNavigationProp<RootStackParamList, 'PinConfirm'>;

const { width } = Dimensions.get('window');

const PinConfirmScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<PinConfirmNavProp>();
  const { firstPin } = route.params as { firstPin: string };

  const [confirmPin, setConfirmPin] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  // โหลดฟอนต์
  const [fontsLoaded] = useFonts({
    TimesNewRoman: require('../../../assets/fonts/times new roman bold.ttf'),
  });

  // focus input ตอนเริ่ม
  React.useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsFocused(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsFocused(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // เปลี่ยน PIN (รับได้ทีละหลายตัวในครั้งเดียว)
  const handleChangePin = (text: string) => {
    // อนุญาตเฉพาะตัวเลข และความยาวไม่เกิน 6 หลัก
    const newPin = text.replace(/[^0-9]/g, '').slice(0, 6);
    setConfirmPin(newPin);
    // ถ้าครบ 6 => ยืนยัน
    if (newPin.length === 6) {
      setTimeout(() => handleConfirm(), 300);
    }
  };

  // ยืนยัน PIN
  const handleConfirm = async () => {
    if (confirmPin === firstPin) {
      // เก็บ PIN
      await SecureStore.setItemAsync('userPin', confirmPin);
      // ไปหน้า PinEntry หรือ MainApp
      //navigation.replace('HomeScreen');
      navigation.replace('PinEntry');
    } else {
      Alert.alert('แจ้งเตือน', 'PIN ไม่ตรงกัน กรุณาลองใหม่');
      setConfirmPin('');
    }
  };

  // กดที่ boxes → focus input
  const handlePinBoxPress = () => {
    inputRef.current?.focus();
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ปุ่มย้อนกลับ */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#CFA459" />
        </TouchableOpacity>

        <Text style={styles.title}>ยืนยันรหัส PIN</Text>

        <View style={styles.mainContent}>
          <Text style={styles.subtitle}>กรุณากรอกรหัส PIN อีกครั้ง</Text>
          <Text style={styles.description}>เพื่อยืนยันการตั้งรหัส PIN</Text>

          {/* PIN Box */}
          <TouchableOpacity style={styles.pinContainer} onPress={handlePinBoxPress}>
            {[0,1,2,3,4,5].map(index => {
              const isFilled = confirmPin.length > index; 
              return (
                <View
                  key={index}
                  style={[
                    styles.pinBox,
                    confirmPin.length === index && isFocused ? styles.pinBoxActive : {}
                  ]}
                >
                  {isFilled && <View style={styles.pinDot} />}
                </View>
              );
            })}
          </TouchableOpacity>

          {/* TextInput ที่ซ่อนไว้ */}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={confirmPin}
            onChangeText={handleChangePin}
            keyboardType="number-pad"
            maxLength={6}
            secureTextEntry
            caretHidden
          />

          <Text style={styles.brandText}>Capital Link</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PinConfirmScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    marginTop: 40,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    // marginTop: 0,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  description: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 30,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    padding: 10,
  },
  pinBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinBoxActive: {
    borderColor: '#CFA459',
    borderWidth: 1.5,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
  },
  brandText: {
    color: '#CFA459',
    fontSize: 16,
    marginVertical: 20,
    fontFamily: 'TimesNewRoman',
  },
});
