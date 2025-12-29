import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

const PlacesToVisit = ({ data, onItemPress }) => {
  const { colors } = useAppTheme();

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      className="mr-4 w-32 rounded-xl overflow-hidden border"
      style={{ 
        backgroundColor: colors.cardBackground,
        borderColor: colors.border
      }}
      onPress={() => onItemPress(item)}
    >
      <View className="h-40 w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
        <Text className="text-xs text-gray-500">place photo</Text>
      </View>
      <View className="p-2">
        <Text className="font-bold text-sm mb-1" numberOfLines={1} style={{ color: colors.textPrimary }}>
          {item.name}
        </Text>
        <Text className="text-xs" style={{ color: colors.textSecondary }}>
          details
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-center px-4 mb-3">
        <View className="h-px flex-1 bg-gray-300" />
        <Text className="text-lg font-semibold mx-3" style={{ color: colors.textPrimary }}>
          Places to Visit
        </Text>
        <View className="h-px flex-1 bg-gray-300" />
      </View>
      
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `place-${index}`}
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

export default PlacesToVisit;
