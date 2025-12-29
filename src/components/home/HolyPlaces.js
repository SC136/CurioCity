import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

const HolyPlaces = ({ data, onItemPress }) => {
  const { colors } = useAppTheme();

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      className="mr-4 w-40 h-56 rounded-xl overflow-hidden border"
      style={{ 
        backgroundColor: colors.cardBackground,
        borderColor: colors.border
      }}
      onPress={() => onItemPress(item)}
    >
      <View className="flex-1 items-center justify-center bg-gray-200 dark:bg-gray-700">
        <Text className="text-xs text-gray-500 text-center px-2">Holy Place image</Text>
        <Text className="text-sm font-bold mt-2 text-center px-2" style={{ color: colors.textPrimary }}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-center px-4 mb-3">
        <View className="h-px flex-1 bg-gray-300" />
        <Text className="text-lg font-semibold mx-3" style={{ color: colors.textPrimary }}>
          Holy Places
        </Text>
        <View className="h-px flex-1 bg-gray-300" />
      </View>
      
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `holy-${index}`}
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

export default HolyPlaces;
