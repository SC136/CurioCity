import React, { memo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../hooks/useAppTheme';
import { CardSkeleton } from '../common/LoadingSkeleton';
import { getCardWidth, spacing, fontSizes, borderRadius, shadows } from '../../utils/responsiveDesign';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = getCardWidth();
const CARD_MARGIN = Platform.OS === 'web' ? spacing.md : spacing.sm;

const PlacesToVisit = memo(({ data, onItemPress, loading = false }) => {
  const { colors } = useAppTheme();

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity 
      className="rounded-3xl overflow-hidden"
      style={{ 
        width: CARD_WIDTH,
        marginRight: CARD_MARGIN,
        backgroundColor: colors.cardBackground,
        ...shadows.lg,
      }}
      onPress={() => onItemPress(item)}
      activeOpacity={0.7}
    >
      <View className="w-full relative">
        <View 
          className="w-full items-center justify-center" 
          style={{ 
            height: 200,
            backgroundColor: colors.primary + '20' 
          }}
        >
          <Ionicons name="location" size={48} color={colors.primary} opacity={0.4} />
          <Text className="text-xs text-gray-400 font-medium mt-2">Place Photo</Text>
        </View>
        
        {/* Gradient blur overlay at bottom of image */}
        <LinearGradient
          colors={['transparent', colors.cardBackground]}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 50,
          }}
        />
      </View>
      
      <View style={{ padding: spacing.md }}>
        <Text 
          className="font-bold mb-3" 
          numberOfLines={2} 
          style={{ color: colors.textPrimary, fontSize: fontSizes.lg }}
        >
          {item.name}
        </Text>
        
        <View className="flex-row items-center justify-between mb-3">
          {item.type && (
            <View className="flex-row items-center flex-1">
              <Ionicons name="pricetag" size={14} color={colors.textSecondary} />
              <Text 
                className="text-xs font-medium ml-1.5 capitalize flex-1" 
                numberOfLines={1}
                style={{ color: colors.textSecondary }}
              >
                {item.type}
              </Text>
            </View>
          )}
          {item.rating && (
            <View 
              className="flex-row items-center px-2 py-1 rounded-full ml-2" 
              style={{ backgroundColor: colors.primary + '20' }}
            >
              <Ionicons name="star" size={12} color="#FDB813" />
              <Text 
                className="text-xs font-bold ml-1" 
                style={{ color: colors.textPrimary }}
              >
                {item.rating}
              </Text>
            </View>
          )}
        </View>
        
        {item.distance && (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons name="navigate" size={14} color={colors.primary} />
              <Text 
                className="text-xs font-medium ml-1.5" 
                style={{ color: colors.textSecondary }}
              >
                {(item.distance / 1000).toFixed(1)} km
              </Text>
            </View>
            <TouchableOpacity 
              className="px-3 py-1.5 rounded-full" 
              style={{ backgroundColor: colors.primary }}
              onPress={() => onItemPress(item)}
            >
              <Text className="text-xs font-bold text-white">View</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  ), [colors, onItemPress]);

  if (loading) {
    return (
      <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
        <Text 
          className="font-bold mb-4" 
          style={{ color: colors.textPrimary, fontSize: fontSizes.xl }}
        >
          🌟 Places to Visit
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate="fast"
        >
          {[1, 2, 3].map((index) => (
            <View key={index} style={{ marginRight: CARD_MARGIN }}>
              <CardSkeleton width={CARD_WIDTH} height={350} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
      <Text 
        className="font-bold mb-4" 
        style={{ color: colors.textPrimary, fontSize: fontSizes.xl }}
      >
        🌟 Places to Visit
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        contentContainerStyle={{ paddingRight: spacing.md }}
      >
        {data.map((item, index) => (
          <View key={item.id || index}>
            {renderItem({ item })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.data?.length === nextProps.data?.length &&
    prevProps.onItemPress === nextProps.onItemPress
  );
});

PlacesToVisit.displayName = 'PlacesToVisit';

export default PlacesToVisit;
