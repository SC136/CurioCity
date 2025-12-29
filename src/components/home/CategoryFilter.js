import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

const CategoryFilter = ({ onCategorySelect }) => {
  const { colors } = useAppTheme();
  const categories = ['Hotels', 'Restaurants', 'Services'];

  return (
    <View className="my-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            className="px-6 py-2 rounded-full mr-3 border"
            style={{ 
              backgroundColor: colors.cardBackground,
              borderColor: colors.border 
            }}
            onPress={() => onCategorySelect(category)}
          >
            <Text className="font-medium" style={{ color: colors.textPrimary }}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryFilter;
