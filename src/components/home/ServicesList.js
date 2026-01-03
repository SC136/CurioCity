import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';

const ServicesList = memo(({ data = [], loading = false, onItemPress }) => {
  const { colors } = useAppTheme();

  const getBackgroundColor = () => {
    // Get the actual background color from the theme
    return colors.background || '#FFFFFF';
  };

  // Get service icon based on type
  const getServiceIcon = useCallback((type) => {
    if (!type) return 'business';
    const typeLower = type.toLowerCase();

    if (typeLower.includes('bank')) return 'card';
    if (typeLower.includes('shop') || typeLower.includes('store')) return 'cart';
    if (typeLower.includes('sport') || typeLower.includes('gym')) return 'fitness';
    if (typeLower.includes('hospital') || typeLower.includes('medical')) return 'medical';
    if (typeLower.includes('pharmacy')) return 'medkit';
    if (typeLower.includes('police')) return 'shield';
    if (typeLower.includes('post')) return 'mail';
    if (typeLower.includes('library')) return 'library';
    if (typeLower.includes('school') || typeLower.includes('education')) return 'school';
    if (typeLower.includes('restaurant') || typeLower.includes('food')) return 'restaurant';
    if (typeLower.includes('hotel') || typeLower.includes('lodging')) return 'bed';
    if (typeLower.includes('fuel') || typeLower.includes('petrol') || typeLower.includes('gas')) return 'car';

    return 'business';
  }, []);

  return (
    <View className="mb-10 px-6">
      <View className="flex-row items-center justify-center mb-8">
        <View className="h-[2px] flex-1 bg-gray-300 dark:bg-gray-600" />
        <Text className="text-2xl font-bold mx-6 tracking-wide" style={{ color: colors.textPrimary }}>
          Services & Amenities
        </Text>
        <View className="h-[2px] flex-1 bg-gray-300 dark:bg-gray-600" />
      </View>
      
      <View 
        className="overflow-hidden h-[500px] relative"
      >
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : !data || data.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="business-outline" size={48} color={colors.textSecondary} />
            <Text className="text-base mt-3" style={{ color: colors.textSecondary }}>No services found nearby</Text>
          </View>
        ) : (
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}>
          {data.map((item, index) => (
            <TouchableOpacity 
              key={item.id || index}
              className="p-6 flex-row justify-between items-center"
              onPress={() => onItemPress(item)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-14 h-14 rounded-full items-center justify-center mr-5" style={{ backgroundColor: colors.primary + '20' }}>
                    <Ionicons name={getServiceIcon(item.type)} size={26} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-lg" numberOfLines={1} style={{ color: colors.textPrimary }}>
                      {item.name}
                  </Text>
                  {item.distance && (
                    <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                      {(item.distance / 1000).toFixed(1)} km away
                    </Text>
                  )}
                </View>
              </View>
              <View className="flex-row items-center ml-3">
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        )}
        {!loading && data && data.length > 0 && (
        <>
        <LinearGradient
          colors={[getBackgroundColor(), 'transparent']}
          className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
        />
        <LinearGradient
          colors={['transparent', getBackgroundColor()]}
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        />
        </>
        )}
      </View>
    </View>
  );
});

ServicesList.displayName = 'ServicesList';

export default ServicesList;
