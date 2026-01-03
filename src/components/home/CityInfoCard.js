import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { spacing, fontSizes, borderRadius, shadows } from '../../utils/responsiveDesign';

const CityInfoCard = memo(({ description, onReadMore, onSearch }) => {
  const { colors } = useAppTheme();

  return (
    <View 
      style={{ 
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.xl,
        backgroundColor: colors.cardBackground,
        ...shadows.md,
      }}
    >
      <Text 
        numberOfLines={3}
        style={{ 
          fontSize: fontSizes.base,
          marginBottom: spacing.lg,
          lineHeight: 24,
          fontWeight: '500',
          color: colors.textSecondary 
        }}
      >
        {description || "Loading city information..."}
      </Text>
      
      <View className="flex-row items-center justify-between">
        <TouchableOpacity 
          style={{ 
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderRadius: borderRadius.full,
            borderWidth: 2,
            borderColor: colors.primary,
            minHeight: 44,
            justifyContent: 'center',
          }}
          onPress={onReadMore}
          activeOpacity={0.7}
        >
          <Text 
            style={{ 
              fontWeight: 'bold',
              fontSize: fontSizes.base,
              color: colors.primary 
            }}
          >
            Read more →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ 
            width: 44,
            height: 44,
            borderRadius: borderRadius.full,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            ...shadows.sm,
          }}
          onPress={onSearch}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.description === nextProps.description;
});

CityInfoCard.displayName = 'CityInfoCard';

export default CityInfoCard;

