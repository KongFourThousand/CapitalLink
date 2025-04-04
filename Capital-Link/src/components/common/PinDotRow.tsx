import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface PinDotRowProps {
  pin: string;
  maxLength?: number;
  showLast?: boolean;
  customStyles?: {
    container?: object;
    dotContainer?: object;
    dotFilled?: object;
    digitText?: object;
  };
}

const PinDotRow: React.FC<PinDotRowProps> = ({
  pin,
  maxLength = 6,
  showLast = false,
  customStyles = {},
}) => {
  return (
    <View style={[styles.container, customStyles.container]}>
      {Array.from({ length: maxLength }).map((_, index) => {
        const filled = index < pin.length;
        return (
          <View
            key={index}
            style={[styles.dotContainer, customStyles.dotContainer]}
          >
            {filled ? (
              index === pin.length - 1 && showLast ? (
                <Text style={[styles.digitText, customStyles.digitText]}>
                  {pin[index]}
                </Text>
              ) : (
                <View style={[styles.dotFilled, customStyles.dotFilled]} />
              )
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginBottom: 30,
  },
  dotContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  dotFilled: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "#CFA459",
  },
  digitText: {
    fontSize: 24,
    color: "#333",
    fontWeight: "600",
  },
});

export default React.memo(PinDotRow);
