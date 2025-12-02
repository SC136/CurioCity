import { StyleSheet } from 'react-native';
import { SIZES } from '../constants/colors';
import { createCommonStyles } from './commonStyles';

/**
 * Creates AccommodationDetailScreen-specific styles.
 * 
 * @param {Object} colors - Theme colors object from useAppTheme
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @returns {Object} StyleSheet for AccommodationDetailScreen
 */
export const createAccommodationDetailStyles = (colors, isDarkMode) => {
  const common = createCommonStyles(colors, isDarkMode);

  return StyleSheet.create({
    // Base
    ...common.container(),
    ...common.content(),

    // Header (from common gradient header)
    ...common.gradientHeader(),

    // Stats section
    ...common.statsCard(),

    // Section header
    ...common.sectionHeader(),

    // Empty state
    ...common.emptyState(),

    // Accommodation card
    accommodationCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: SIZES.radiusMedium,
      padding: SIZES.md,
      marginHorizontal: SIZES.md,
      marginBottom: SIZES.sm,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    accommodationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: SIZES.sm,
    },
    accommodationInfo: {
      flex: 1,
    },
    accommodationName: {
      fontSize: SIZES.body,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: SIZES.xs,
    },
    typeContainer: {
      alignSelf: 'flex-start',
    },
    accommodationType: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      backgroundColor: colors.primary + '15',
      paddingHorizontal: SIZES.sm,
      paddingVertical: SIZES.xxs,
      borderRadius: SIZES.radiusSmall,
      borderWidth: 1,
      borderColor: colors.primary + '40',
    },
    accommodationMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.sm,
    },

    // Rating
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.warning + '15',
      paddingHorizontal: SIZES.sm,
      paddingVertical: SIZES.xxs,
      borderRadius: SIZES.radiusSmall,
      borderWidth: 1,
      borderColor: colors.warning + '40',
    },
    rating: {
      fontSize: SIZES.caption,
      color: colors.warning,
      marginLeft: SIZES.xxs,
      fontWeight: '600',
    },

    // Address
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SIZES.xs,
    },
    address: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      marginLeft: SIZES.xs,
      flex: 1,
    },

    // Amenities
    amenitiesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: SIZES.xs,
      marginBottom: SIZES.sm,
    },
    amenityTag: {
      backgroundColor: colors.primary + '15',
      paddingHorizontal: SIZES.sm,
      paddingVertical: SIZES.xxs,
      borderRadius: SIZES.radiusSmall,
      marginRight: SIZES.xs,
      marginBottom: SIZES.xs,
      borderWidth: 1,
      borderColor: colors.primary + '40',
    },
    amenityText: {
      fontSize: SIZES.caption,
      color: colors.primary,
    },

    // Distance
    distanceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SIZES.xs,
    },
    distance: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      marginLeft: SIZES.xs,
    },

    // Price
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SIZES.xs,
    },
    priceLabel: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      marginRight: SIZES.xs,
    },
    priceRange: {
      fontSize: SIZES.caption,
      color: colors.primary,
      fontWeight: '600',
    },

    // Source
    source: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },

    // Empty state extras
    emptyStateContainer: {
      alignItems: 'center',
      paddingVertical: SIZES.xxl,
      paddingHorizontal: SIZES.lg,
    },
    emptyStateTitle: {
      fontSize: SIZES.h3,
      fontWeight: '600',
      color: colors.textPrimary,
      marginTop: SIZES.lg,
      marginBottom: SIZES.sm,
    },
    emptyStateText: {
      fontSize: SIZES.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: SIZES.lg,
    },
    searchButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.md,
      borderRadius: SIZES.radiusMedium,
    },
    searchButtonText: {
      fontSize: SIZES.body,
      color: colors.textWhite,
      fontWeight: '600',
    },
  });
};
