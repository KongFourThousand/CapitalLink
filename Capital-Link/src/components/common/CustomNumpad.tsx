import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface CustomNumpadProps {
  onNumberPress: (num: string) => void;
  onBackspace: () => void;
  keySize?: number;
  keyColor?: string;
  textColor?: string;
  customStyles?: {
    container?: object;
    keypadRow?: object;
    keyButton?: object;
    keyText?: object;
  };
}

// แยก PinKey ออกมาและใช้ memo
const PinKey = React.memo<{ 
  label: string; 
  onPress: (label: string) => void; 
  style: any; 
  textStyle: any;
}>(({ label, onPress, style, textStyle }) => (
  <TouchableOpacity
    style={style}
    onPress={() => onPress(label)}
    activeOpacity={0.5} // ลดค่าเพื่อตอบสนองชัดเจนขึ้น
  >
    <Text style={textStyle}>{label}</Text>
  </TouchableOpacity>
));

// แยกปุ่ม Backspace ออกมาและใช้ memo
const BackspaceKey = React.memo<{
  onPress: () => void;
  style: any;
  iconColor: string;
  iconSize: number;
}>(({ onPress, style, iconColor, iconSize }) => (
  <TouchableOpacity
    onPress={onPress}
    style={style}
    activeOpacity={0.5}
  >
    <Ionicons name="backspace-outline" size={iconSize} color={iconColor} />
  </TouchableOpacity>
));

const CustomNumpad = React.memo<CustomNumpadProps>(({
  onNumberPress,
  onBackspace,
  keySize = 80,
  keyColor = "#f8f8f8",
  textColor = "#333",
  customStyles = {},
}) => {
  // ป้องกัน undefined
  const safeCustomStyles = customStyles || {};
  
  // Memoize event handlers
  const handleNumberPress = useCallback((label: string) => {
    onNumberPress(label);
  }, [onNumberPress]);
  
  const handleBackspace = useCallback(() => {
    onBackspace();
  }, [onBackspace]);
  
  // Memoize styles
  const buttonStyle = useMemo(() => [
    styles.keyButton,
    { 
      width: keySize, 
      height: keySize, 
      borderRadius: keySize / 2, 
      backgroundColor: keyColor 
    },
    safeCustomStyles.keyButton
  ], [keySize, keyColor, safeCustomStyles.keyButton]);
  
  const textStyle = useMemo(() => [
    styles.keyText, 
    { color: textColor }, 
    safeCustomStyles.keyText
  ], [textColor, safeCustomStyles.keyText]);
  
  const containerStyle = useMemo(() => [
    styles.keypadContainer, 
    safeCustomStyles.container
  ], [safeCustomStyles.container]);
  
  const rowStyle = useMemo(() => [
    styles.keypadRow, 
    safeCustomStyles.keypadRow
  ], [safeCustomStyles.keypadRow]);
  
  // Memoize the number buttons to avoid re-creating them each render
  const numberButtons = useMemo(() => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9']
    ];
    
    return numbers.map((row, rowIndex) => (
      <View key={`row-${rowIndex}`} style={rowStyle}>
        {row.map(num => (
          <PinKey 
            key={num}
            label={num} 
            onPress={handleNumberPress} 
            style={buttonStyle}
            textStyle={textStyle}
          />
        ))}
      </View>
    ));
  }, [rowStyle, buttonStyle, textStyle, handleNumberPress]);
  
  // Render with optimized components
  return (
    <View style={containerStyle}>
      {numberButtons}
      <View style={rowStyle}>
      <View style={{ width: keySize, height: keySize }} />
        <PinKey 
          label="0" 
          onPress={handleNumberPress} 
          style={buttonStyle}
          textStyle={textStyle}
        />
        <BackspaceKey 
          onPress={handleBackspace}
          style={buttonStyle}
          iconColor={textColor}
          iconSize={24}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  keypadContainer: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    // =backgroundColor: "pink"
  },
  keypadRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginVertical: 5,
  },
  keyButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  keyText: {
    fontSize: 35,
    fontWeight: "600",
  },
});

export default CustomNumpad;