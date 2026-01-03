import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';

const Header = ({ cityName, airQuality }) => {
  const { colors, toggleTheme, isDarkMode } = useAppTheme();

  return (
    <View className="px-6 py-4 mt-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Text className="text-3xl font-bold mr-2 tracking-tight" numberOfLines={1} style={{ color: colors.textPrimary }}>
            {cityName}
          </Text>
          <Ionicons name="location" size={28} color={colors.primary} />
        </View>
        <TouchableOpacity 
          onPress={toggleTheme}
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: isDarkMode ? colors.cardBackground : colors.primary + '15' }}
        >
          <Ionicons 
            name={isDarkMode ? "sunny" : "moon"} 
            size={24} 
            color={isDarkMode ? "#FDB813" : "#6366F1"} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Air Quality Indicator */}
      {airQuality && (
        <View className="flex-row items-center mt-3">
          <View 
            className="flex-row items-center px-3 py-1.5 rounded-full mr-3"
            style={{ backgroundColor: airQuality.color + '20' }}
          >
            <View 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: airQuality.color }}
            />
            <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
              AQI {airQuality.aqi}
            </Text>
          </View>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            {airQuality.level} - {airQuality.description}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Header;
