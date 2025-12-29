import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

const ServicesList = ({ data, onItemPress }) => {
  const { colors } = useAppTheme();

  return (
    <View className="mb-6 px-4">
      <View className="flex-row items-center justify-center mb-3">
        <View className="h-px flex-1 bg-gray-300" />
        <Text className="text-lg font-semibold mx-3" style={{ color: colors.textPrimary }}>
          Services and Amenities
        </Text>
        <View className="h-px flex-1 bg-gray-300" />
      </View>
      
      <View 
        className="rounded-xl overflow-hidden border h-48"
        style={{ 
          backgroundColor: colors.cardBackground,
          borderColor: colors.border
        }}
      >
        <ScrollView nestedScrollEnabled>
          {data.map((item, index) => (
            <TouchableOpacity 
              key={index}
              className="p-4 border-b flex-row justify-between items-center"
              style={{ borderBottomColor: colors.border }}
              onPress={() => onItemPress(item)}
            >
              <Text className="font-medium" style={{ color: colors.textPrimary }}>
                {item.name}
              </Text>
              <Text className="text-xs" style={{ color: colors.textSecondary }}>
                call detail and review
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default ServicesList;
