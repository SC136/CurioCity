import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Shimmer animation component
const Shimmer = ({ width, height, borderRadius = 8, style }) => {
  const { colors } = useAppTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Card skeleton for places/restaurants
export const CardSkeleton = ({ width = SCREEN_WIDTH * 0.85 }) => {
  const { colors } = useAppTheme();

  return (
    <View
      className="mr-5 rounded-3xl overflow-hidden"
      style={{
        width,
        backgroundColor: colors.cardBackground,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 10,
      }}
    >
      <Shimmer width="100%" height={320} borderRadius={0} />
      <View className="p-6">
        <Shimmer width="70%" height={24} style={{ marginBottom: 12 }} />
        <View className="flex-row justify-between mb-4">
          <Shimmer width="40%" height={16} />
          <Shimmer width={60} height={28} borderRadius={14} />
        </View>
        <View className="flex-row justify-between">
          <Shimmer width="30%" height={16} />
          <Shimmer width={100} height={36} borderRadius={18} />
        </View>
      </View>
    </View>
  );
};

// Grid item skeleton for accommodation
export const GridItemSkeleton = () => {
  const { colors } = useAppTheme();

  return (
    <View
      className="w-[48%] mb-4 rounded-xl overflow-hidden"
      style={{
        backgroundColor: colors.cardBackground,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      <Shimmer width="100%" height={192} borderRadius={0} />
      <View className="p-3 pb-4">
        <Shimmer width="80%" height={18} style={{ marginBottom: 8 }} />
        <View className="flex-row justify-between mt-2">
          <Shimmer width={50} height={22} borderRadius={4} />
          <Shimmer width={24} height={24} borderRadius={4} />
        </View>
      </View>
    </View>
  );
};

// List item skeleton for services/news
export const ListItemSkeleton = () => {
  const { colors } = useAppTheme();

  return (
    <View
      className="flex-row items-center p-4 mb-3 rounded-xl"
      style={{ backgroundColor: colors.cardBackground }}
    >
      <Shimmer width={48} height={48} borderRadius={12} />
      <View className="flex-1 ml-4">
        <Shimmer width="70%" height={16} style={{ marginBottom: 8 }} />
        <Shimmer width="50%" height={14} />
      </View>
      <Shimmer width={24} height={24} borderRadius={4} />
    </View>
  );
};

// Holy place card skeleton
export const HolyPlaceSkeleton = () => {
  const { colors } = useAppTheme();

  return (
    <View
      className="mr-4 rounded-2xl overflow-hidden"
      style={{
        width: SCREEN_WIDTH * 0.4,
        backgroundColor: colors.cardBackground,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      <Shimmer width="100%" height={140} borderRadius={0} />
      <View className="p-3">
        <Shimmer width="80%" height={16} style={{ marginBottom: 6 }} />
        <Shimmer width="50%" height={14} />
      </View>
    </View>
  );
};

// News item skeleton
export const NewsItemSkeleton = () => {
  const { colors } = useAppTheme();

  return (
    <View
      className="mr-4 rounded-2xl overflow-hidden"
      style={{
        width: SCREEN_WIDTH * 0.75,
        backgroundColor: colors.cardBackground,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      <Shimmer width="100%" height={140} borderRadius={0} />
      <View className="p-4">
        <Shimmer width="90%" height={18} style={{ marginBottom: 8 }} />
        <Shimmer width="70%" height={14} style={{ marginBottom: 8 }} />
        <View className="flex-row justify-between">
          <Shimmer width="30%" height={12} />
          <Shimmer width="25%" height={12} />
        </View>
      </View>
    </View>
  );
};

// Empty state component
export const EmptyState = ({ icon, title, subtitle }) => {
  const { colors } = useAppTheme();
  const { Ionicons } = require('@expo/vector-icons');
  const { Text } = require('react-native');

  return (
    <View className="items-center justify-center py-8 px-6">
      <Ionicons name={icon} size={48} color={colors.textSecondary} style={{ opacity: 0.5 }} />
      <Text className="text-base font-semibold mt-4" style={{ color: colors.textPrimary }}>
        {title}
      </Text>
      {subtitle && (
        <Text className="text-sm text-center mt-2" style={{ color: colors.textSecondary }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

export default {
  Shimmer,
  CardSkeleton,
  GridItemSkeleton,
  ListItemSkeleton,
  HolyPlaceSkeleton,
  NewsItemSkeleton,
  EmptyState,
};
