import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { ListItemSkeleton } from '../common/LoadingSkeleton';
import { spacing, fontSizes, borderRadius, shadows } from '../../utils/responsiveDesign';

const ServicesList = memo(({ data, onItemPress, loading = false }) => {
  const { colors } = useAppTheme();

  // Get service icon based on type
  const getServiceIcon = useCallback((type) => {
    if (!type) return 'business';
    const typeLower = type.toLowerCase();
    
    if (typeLower.includes('bank')) return 'card';
    if (typeLower.includes('shop') || typeLower.includes('store')) return 'cart';
    if (typeLower.includes('sport') || typeLower.includes('gym')) return 'fitness';
    if (typeLower.includes('hospital') || typeLower.includes('medical')) return 'medical';
    if (typeLower.includes('pharmacy')) return 'medkit';
    if (typeLower.includes('police')) return 'shield';
    if (typeLower.includes('post')) return 'mail';
    if (typeLower.includes('library')) return 'library';
    if (typeLower.includes('school') || typeLower.includes('education')) return 'school';
    
    return 'business';
  }, []);

  // Only show first 10 items to avoid long lists
  const displayData = useMemo(() => data.slice(0, 10), [data]);

  const renderServiceItem = useCallback(({ item, index }) => (
    <TouchableOpacity 
      key={index}
      style={{
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.cardBackground,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...shadows.sm,
      }}
      onPress={() => onItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View 
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md,
            backgroundColor: colors.primary + '20',
          }}
        >
          <Ionicons name={getServiceIcon(item.type)} size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text 
            numberOfLines={1} 
            style={{ 
              fontWeight: '700',
              fontSize: fontSizes.base,
              color: colors.textPrimary,
            }}
          >
            {item.name}
          </Text>
          {item.distance && (
            <Text 
              style={{
                fontSize: fontSizes.sm,
                marginTop: spacing.xs,
                color: colors.textSecondary,
              }}
            >
              {(item.distance / 1000).toFixed(1)} km away
            </Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  ), [colors, getServiceIcon, onItemPress]);

  return (
    <View style={{ marginBottom: spacing.xl, paddingHorizontal: spacing.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg }}>
        <View style={{ height: 1, flex: 1, backgroundColor: colors.textSecondary + '40' }} />
        <Text 
          style={{
            fontSize: fontSizes.xl,
            fontWeight: 'bold',
            marginHorizontal: spacing.lg,
            letterSpacing: 0.5,
            color: colors.textPrimary,
          }}
        >
          Services & Amenities
        </Text>
        <View style={{ height: 1, flex: 1, backgroundColor: colors.textSecondary + '40' }} />
      </View>
      
      {loading ? (
        <View style={{ paddingVertical: spacing.md }}>
          <ListItemSkeleton />
          <ListItemSkeleton />
          <ListItemSkeleton />
          <ListItemSkeleton />
        </View>
      ) : data.length === 0 ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl }}>
          <Ionicons name="business-outline" size={48} color={colors.textSecondary} style={{ opacity: 0.5 }} />
          <Text 
            style={{
              fontSize: fontSizes.base,
              fontWeight: '600',
              marginTop: spacing.lg,
              color: colors.textPrimary,
            }}
          >
            No services found nearby
          </Text>
          <Text 
            style={{
              fontSize: fontSizes.sm,
              textAlign: 'center',
              marginTop: spacing.md,
              color: colors.textSecondary,
            }}
          >
            Try searching in a different area
          </Text>
        </View>
      ) : (
        <View>
          {displayData.map((item, index) => (
            renderServiceItem({ item, index })
          ))}
          {data.length > 10 && (
            <Text 
              style={{
                textAlign: 'center',
                fontSize: fontSizes.sm,
                marginTop: spacing.md,
                color: colors.textSecondary,
              }}
            >
              +{data.length - 10} more services
            </Text>
          )}
        </View>
      )}
    </View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.data?.length === nextProps.data?.length &&
    prevProps.onItemPress === nextProps.onItemPress
  );
});

ServicesList.displayName = 'ServicesList';

export default ServicesList;

