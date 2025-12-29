import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

const CategoryFilter = ({ onCategorySelect }) => {
  const { colors } = useAppTheme();
  const categories = ['Hotels', 'Restaurants', 'Services', 'News', 'Holy Places'];

  return (
    <View className="my-6">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            className="px-5 py-2.5 rounded-full mr-3 border"
            style={{ 
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
            onPress={() => onCategorySelect(category)}
          >
            <Text className="font-inter-medium text-sm" style={{ color: colors.textPrimary }}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryFilter;
