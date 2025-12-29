import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';

const CityInfoCard = ({ description, onReadMore, onSearch }) => {
  const { colors } = useAppTheme();

  return (
    <View 
      className="mx-4 mt-4 p-4 rounded-2xl" 
      style={{ backgroundColor: colors.cardBackground }}
    >
      <Text 
        className="text-base mb-4" 
        numberOfLines={3} 
        style={{ color: colors.textSecondary }}
      >
        {description || "Loading city information..."}
      </Text>
      
      <View className="flex-row items-center justify-between">
        <TouchableOpacity 
          className="px-4 py-2 rounded-full border"
          style={{ borderColor: colors.primary }}
          onPress={onReadMore}
        >
          <Text className="font-medium" style={{ color: colors.primary }}>
            read more →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary }}
          onPress={onSearch}
        >
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CityInfoCard;
