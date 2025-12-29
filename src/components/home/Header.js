import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';

const Header = ({ cityName }) => {
  const { colors, toggleTheme, isDarkMode } = useAppTheme();

  return (
    <View className="flex-row items-center justify-between px-4 py-2">
      <View className="flex-row items-center">
        <Text className="text-2xl font-bold mr-1" style={{ color: colors.textPrimary }}>
          {cityName}
        </Text>
        <Ionicons name="location" size={24} color={colors.primary} />
      </View>
      <TouchableOpacity onPress={toggleTheme}>
        <Ionicons 
          name={isDarkMode ? "sunny" : "moon"} 
          size={24} 
          color={colors.textPrimary} 
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
