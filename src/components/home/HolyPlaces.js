import React, { memo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../hooks/useAppTheme';
import { HolyPlaceSkeleton } from '../common/LoadingSkeleton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.7;

const HolyPlaces = memo(({ data = [], onItemPress, loading = false }) => {
  const { colors } = useAppTheme();

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity 
      className="mr-5 rounded-3xl overflow-hidden"
      style={{ 
        width: CARD_WIDTH,
        backgroundColor: colors.cardBackground,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 10,
      }}
      onPress={() => onItemPress(item)}
    >
      <View className="w-full relative">
        <View className="h-[450px] w-full items-center justify-center bg-gradient-to-br" style={{ backgroundColor: colors.primary + '20' }}>
          <Ionicons name="business" size={64} color={colors.primary} opacity={0.4} />
          <Text className="text-sm text-gray-400 font-medium mt-3">Holy Place Photo</Text>
        </View>
        
        {/* Gradient overlay with text on image */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 140,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
        >
          <Text className="font-bold text-2xl mb-2 text-white text-center" numberOfLines={2}>
            {item.name}
          </Text>
          <View className="flex-row items-center justify-center">
            <Ionicons name="location" size={16} color="#FFFFFF" opacity={0.9} />
            <Text className="text-base font-medium ml-2 text-white capitalize opacity-90">
              {item.type}
            </Text>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  ), [colors, onItemPress]);

  return (
    <View className="mb-2" style={{ overflow: 'visible' }}>
      <View className="flex-row items-center justify-center px-6 mb-5">
        <View className="h-[1px] flex-1" style={{ backgroundColor: colors.border }} />
        <Text className="text-lg font-bold mx-4 tracking-widest uppercase" style={{ color: colors.textPrimary }}>
          Holy Places
        </Text>
        <View className="h-[1px] flex-1" style={{ backgroundColor: colors.border }} />
      </View>
      
      {loading ? (
        <View className="flex-row px-5 pb-5">
          <HolyPlaceSkeleton />
          <HolyPlaceSkeleton />
          <HolyPlaceSkeleton />
        </View>
      ) : !data || data.length === 0 ? (
        <View className="items-center justify-center py-8 px-6">
          <Ionicons name="business-outline" size={48} color={colors.textSecondary} style={{ opacity: 0.5 }} />
          <Text className="text-base font-semibold mt-4" style={{ color: colors.textPrimary }}>
            No holy places found nearby
          </Text>
          <Text className="text-sm text-center mt-2" style={{ color: colors.textSecondary }}>
            Try searching in a different area
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10, paddingBottom: 20 }}
        >
          {data.map((item, index) => (
            <View key={`holy-${index}`}>
              {renderItem({ item })}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
});

HolyPlaces.displayName = 'HolyPlaces';

export default HolyPlaces;
