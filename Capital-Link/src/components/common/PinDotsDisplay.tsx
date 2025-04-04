import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

interface PinDotsDisplayProps {
  pin: string;
  maxLength?: number;
  showLast?: boolean;
  customStyles?: {
    container?: object;
    pinBox?: object;
    pinBoxActive?: object;
    pinDot?: object;
    digitText?: object;
  };
}

const PinDotsDisplay: React.FC<PinDotsDisplayProps> = ({
  pin,
  maxLength = 6,
  showLast = false,
  customStyles = {},
}) => {
  return (
    <View style={[styles.pinContainer, customStyles.container]}>
      {Array.from({ length: maxLength }).map((_, index) => {
        const filled = index < pin.length;
        return (
          <View
            key={index}
            style={[
              styles.pinBox,
              pin.length === index ? styles.pinBoxActive : {},
              customStyles.pinBox,
              pin.length === index ? customStyles.pinBoxActive : {},
            ]}
          >
            {filled ? (
              index === pin.length - 1 && showLast ? (
                <Text style={[styles.digitText, customStyles.digitText]}>
                  {pin[index]}
                </Text>
              ) : (
                <View style={[styles.pinDot, customStyles.pinDot]} />
              )
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
    padding: 10,
  },
  pinBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 6,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  pinBoxActive: {
    borderColor: "#CFA459",
    borderWidth: 1.5,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#333",
  },
  digitText: {
    fontSize: 24,
    color: "#333",
    fontWeight: "600",
  },
});

export default PinDotsDisplay;