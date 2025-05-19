// DepositCarousel.tsx
import React from "react";
import {
  FlatList,
  Dimensions,
  TouchableOpacity,
  View,
  StyleSheet,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  type ScrollView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
import type { DepositInfo } from "../../Data/UserDataStorage";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 34;
const SPACING = 16;

interface Props {
  data: DepositInfo[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  index: number;
  setIndex: (index: number) => void;
  onMomentumScrollEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  DepositAccount: React.FC<{ item: DepositInfo }>;
}

const DepositCarousel: React.FC<Props> = ({
  data,
  selectedIndex,
  setSelectedIndex,
  index,
  setIndex,
  onMomentumScrollEnd,
  DepositAccount,
}) => {
  const scrollViewRef = React.useRef<ScrollView>(null);

  return (
    <View style={styles.carouselContainer}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <FlatList
          horizontal
          data={data}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingHorizontal: (width - CARD_WIDTH) / 5,
          }}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          snapToAlignment="center"
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setSelectedIndex(index)}
              style={{ width: CARD_WIDTH, marginRight: SPACING }}
            >
              <DepositAccount item={item} />
            </TouchableOpacity>
          )}
          onMomentumScrollEnd={onMomentumScrollEnd}
        />
        <AnimatedDotsCarousel
          length={data.length}
          scrollableDotsConfig={{
            setIndex,
            onNewIndex: (newIndex) => {
              scrollViewRef?.current?.scrollTo?.({
                x: newIndex * width,
                animated: false,
              });
            },
            containerBackgroundColor: "rgba(230,230,230, 0.5)",
            container: {
              alignItems: "center",
              borderRadius: 15,
              height: 30,
              justifyContent: "center",
              paddingHorizontal: 15,
            },
          }}
          currentIndex={index}
          maxIndicators={3}
          interpolateOpacityAndColor={true}
          activeIndicatorConfig={{
            color: "#CFA459",
            margin: 3,
            opacity: 1,
            size: 8,
          }}
          inactiveIndicatorConfig={{
            color: "#ccc",
            margin: 3,
            opacity: 1,
            size: 8,
          }}
          decreasingDots={[
            {
              config: { color: "#ccc", margin: 3, opacity: 1, size: 6 },
              quantity: 1,
            },
            {
              config: { color: "#ccc", margin: 3, opacity: 1, size: 4 },
              quantity: 1,
            },
          ]}
        />
      </GestureHandlerRootView>
    </View>
  );
};

export default DepositCarousel;
const styles = StyleSheet.create({
  carouselContainer: {
    // backgroundColor: "red",
    marginBottom: 16,
  },
});
