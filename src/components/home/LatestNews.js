import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

const LatestNews = ({ data, onItemPress }) => {
  const { colors } = useAppTheme();

  return (
    <View className="mb-6 px-4">
      <View className="flex-row items-center justify-center mb-3">
        <View className="h-px flex-1 bg-gray-300" />
        <Text className="text-lg font-semibold mx-3" style={{ color: colors.textPrimary }}>
          Latest News in Area
        </Text>
        <View className="h-px flex-1 bg-gray-300" />
      </View>
      
      <View 
        className="rounded-xl overflow-hidden border h-64"
        style={{ 
          backgroundColor: colors.cardBackground,
          borderColor: colors.border
        }}
      >
        <ScrollView nestedScrollEnabled>
          {data.map((item, index) => (
            <TouchableOpacity 
              key={index}
              className="p-3 border-b"
              style={{ borderBottomColor: colors.border }}
              onPress={() => onItemPress(item)}
            >
              <View className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 items-center justify-center">
                <Text className="text-xs text-gray-500">News Image</Text>
              </View>
              <Text className="font-bold text-base mb-1" style={{ color: colors.textPrimary }}>
                {item.title}
              </Text>
              <Text className="text-sm" numberOfLines={1} style={{ color: colors.textSecondary }}>
                {item.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default LatestNews;
