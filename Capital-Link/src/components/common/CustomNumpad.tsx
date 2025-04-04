import React from "react";
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
  onForgotPin?: () => void; // Optional callback for "forgot PIN" action
  showForgotPin?: boolean; // Whether to show the "forgot PIN" button
  forgotPinText?: string; // Text for "forgot PIN" button
  keySize?: number; // Optional size for numpad keys
  keyColor?: string; // Optional color for numpad keys
  textColor?: string; // Optional color for numpad text
  customStyles?: {
    container?: object; // Custom styles for container
    keypadRow?: object; // Custom styles for row
    keyButton?: object; // Custom styles for button
    keyText?: object; // Custom styles for text
  };
}

const CustomNumpad: React.FC<CustomNumpadProps> = ({
  onNumberPress,
  onBackspace,
  onForgotPin,
  showForgotPin = false,
  forgotPinText = "ลืมรหัส PIN?",
  keySize = 80,
  keyColor = "#f8f8f8",
  textColor = "#333",
  customStyles = {},
}) => {
  // PinKey component for individual number keys
  const PinKey: React.FC<{ label: string }> = ({ label }) => (
    <TouchableOpacity
      style={[
        styles.keyButton,
        { width: keySize, height: keySize, borderRadius: keySize / 2, backgroundColor: keyColor },
        customStyles.keyButton
      ]}
      onPress={() => onNumberPress(label)}
    >
      <Text style={[styles.keyText, { color: textColor }, customStyles.keyText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.keypadContainer, customStyles.container]}>
      <View style={[styles.keypadRow, customStyles.keypadRow]}>
        <PinKey label="1" />
        <PinKey label="2" />
        <PinKey label="3" />
      </View>
      <View style={[styles.keypadRow, customStyles.keypadRow]}>
        <PinKey label="4" />
        <PinKey label="5" />
        <PinKey label="6" />
      </View>
      <View style={[styles.keypadRow, customStyles.keypadRow]}>
        <PinKey label="7" />
        <PinKey label="8" />
        <PinKey label="9" />
      </View>
      <View style={[styles.keypadRow, customStyles.keypadRow]}>
        {showForgotPin ? (
          <TouchableOpacity
            style={[{ width: keySize, height: keySize }, styles.forgotPinButton]}
            onPress={onForgotPin}
          >
            <Text style={styles.forgotPinText}>{forgotPinText}</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: keySize, height: keySize }} />
        )}
        <PinKey label="0" />
        <TouchableOpacity
          onPress={onBackspace}
          style={[
            styles.keyButton,
            {
              width: keySize,
              height: keySize,
              borderRadius: keySize / 2,
              backgroundColor: keyColor
            },
            customStyles.keyButton
          ]}
        >
          <Ionicons name="backspace-outline" size={24} color={textColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keypadContainer: {
    // width: "80%",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    // backgroundColor: "blue"
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
  forgotPinButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPinText: {
    fontSize: 10,
    color: "#CFA459",
    textDecorationLine: "underline",
  },
});

export default CustomNumpad;