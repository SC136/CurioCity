import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';

const LocalRestaurants = ({ data, onItemPress }) => {
  const { colors } = useAppTheme();

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      className="mr-4 w-64 rounded-xl overflow-hidden border"
      style={{ 
        backgroundColor: colors.cardBackground,
        borderColor: colors.border
      }}
      onPress={() => onItemPress(item)}
    >
      <View className="h-32 w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
        <Text className="text-xs text-gray-500">restaurant/dish image</Text>
      </View>
      
      <View className="p-3">
        <Text className="font-bold text-base mb-2" numberOfLines={1} style={{ color: colors.textPrimary }}>
          {item.name}
        </Text>
        
        <View className="flex-row items-center justify-between">
          <View className="px-3 py-1 rounded-full border" style={{ borderColor: colors.textSecondary }}>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>details</Text>
          </View>
          
          <View className="flex-row items-center">
            <Text className="text-xs mr-1" style={{ color: colors.textPrimary }}>review</Text>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text className="text-xs ml-1 font-bold" style={{ color: colors.textPrimary }}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-center px-4 mb-3">
        <View className="h-px flex-1 bg-gray-300" />
        <Text className="text-lg font-semibold mx-3" style={{ color: colors.textPrimary }}>
          Local Restaurants
        </Text>
        <View className="h-px flex-1 bg-gray-300" />
      </View>
      
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `restaurant-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
      
      <View className="flex-row justify-center mt-3 gap-1">
        <View className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        <View className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        <View className="w-1.5 h-1.5 rounded-full bg-gray-300" />
      </View>
    </View>
  );
};

export default LocalRestaurants;
