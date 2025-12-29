import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';

const NearbyAccommodation = ({ data, onItemPress, onViewMore }) => {
  const { colors } = useAppTheme();
  
  // Take only first 4 items for the grid
  const displayData = data.slice(0, 4);

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-center px-4 mb-3">
        <View className="h-px flex-1 bg-gray-300" />
        <Text className="text-lg font-semibold mx-3" style={{ color: colors.textPrimary }}>
          Nearby Accommodation
        </Text>
        <View className="h-px flex-1 bg-gray-300" />
      </View>
      
      <View className="flex-row flex-wrap justify-between px-4">
        {displayData.map((item, index) => (
          <TouchableOpacity 
            key={index}
            className="w-[48%] mb-4 rounded-xl overflow-hidden border"
            style={{ 
              backgroundColor: colors.cardBackground,
              borderColor: colors.border
            }}
            onPress={() => onItemPress(item)}
          >
            <View className="h-24 w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
              <Text className="text-xs text-gray-500">hotel image</Text>
            </View>
            
            <View className="p-2">
              <Text className="font-bold text-sm mb-1" numberOfLines={1} style={{ color: colors.textPrimary }}>
                {item.name}
              </Text>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Text className="text-xs mr-1" style={{ color: colors.textSecondary }}>detail</Text>
                    <Ionicons name="diamond-outline" size={10} color={colors.textSecondary} />
                </View>
                
                <View className="flex-row items-center">
                  <Ionicons name="star" size={10} color="#FFD700" />
                  <Text className="text-xs ml-1" style={{ color: colors.textPrimary }}>{item.rating}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity 
        className="self-center px-6 py-2 rounded-full border"
        style={{ borderColor: colors.textSecondary }}
        onPress={onViewMore}
      >
        <Text className="text-sm font-medium" style={{ color: colors.textPrimary }}>
          View More
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NearbyAccommodation;
