import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Linking,
  Dimensions,
  Text,
  type ViewToken,
} from "react-native";
import { BannerFromAPI, type BannerLink } from "../../../Data/bannerLink";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = 16; // same as HomeScreen paddingHorizontal
const BANNER_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;

const BannerAdmin = () => {
  const data = Object.values(BannerFromAPI);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<BannerLink>>(null);

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const handleOpenLink = (linkUrl: string) => {
    Linking.openURL(linkUrl);
  };

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % data.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);
    return () => clearInterval(timer);
  }, [currentIndex, data.length]);

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        snapToAlignment="start"
        initialScrollIndex={0}
        snapToInterval={BANNER_WIDTH + 12} // card width + marginRight
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bannerCard}
            activeOpacity={0.9}
            onPress={() => handleOpenLink(item.url)}
          >
            <Image
              // source={item.image}
              source={{
                uri: item.image,
              }}
              style={styles.bannerImage}
              resizeMode="cover"
              // onError={(e) =>
              //   console.warn("Image load error:", e.nativeEvent.error)
              // }
              // onLoad={() => console.log("Image loaded!")}
            />
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {data.map((item, i) => (
          <View
            key={item.id}
            style={[styles.dot, currentIndex === i && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  listContainer: {
    // backgroundColor: "red",
    // paddingHorizontal: HORIZONTAL_PADDING,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 3,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.3)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#000",
  },
});

export default BannerAdmin;
