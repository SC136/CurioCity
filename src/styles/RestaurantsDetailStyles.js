import { StyleSheet } from 'react-native';
import { SIZES } from '../constants/colors';
import { createCommonStyles } from './commonStyles';

/**
 * Creates RestaurantsDetailScreen-specific styles.
 * 
 * @param {Object} colors - Theme colors object from useAppTheme
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @returns {Object} StyleSheet for RestaurantsDetailScreen
 */
export const createRestaurantsDetailStyles = (colors, isDarkMode) => {
  const common = createCommonStyles(colors, isDarkMode);

  return StyleSheet.create({
    // Base
    ...common.container(),
    ...common.content(),

    // Header
    ...common.gradientHeader(),

    // Stats section
    ...common.statsCard(),

    // Section header
    ...common.sectionHeader(),

    // Empty state
    ...common.emptyState(),

    // Restaurant card
    restaurantCard: {
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
    restaurantHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: SIZES.sm,
    },
    restaurantInfo: {
      flex: 1,
    },
    restaurantName: {
      fontSize: SIZES.body,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: SIZES.xs,
    },
    restaurantCategories: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      marginBottom: SIZES.xs,
    },
    restaurantDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: SIZES.sm,
    },

    // Rating
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingStars: {
      fontSize: SIZES.caption,
      color: colors.accent,
      marginRight: SIZES.xs,
    },
    ratingValue: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    ratingText: {
      fontSize: SIZES.caption,
      color: colors.primary,
      marginLeft: SIZES.xs,
      fontWeight: '600',
    },

    // Categories
    categoriesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: SIZES.sm,
    },
    categoryTag: {
      backgroundColor: colors.primary + '20',
      borderRadius: SIZES.radiusSmall,
      paddingHorizontal: SIZES.sm,
      paddingVertical: SIZES.xs,
      marginRight: SIZES.xs,
      marginBottom: SIZES.xs,
      borderWidth: 1,
      borderColor: colors.primary + '40',
    },
    categoryText: {
      fontSize: SIZES.caption,
      color: colors.primary,
      fontWeight: '500',
    },

    // Address
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SIZES.xs,
    },
    addressText: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      marginLeft: SIZES.xs,
      flex: 1,
    },

    // Distance
    distanceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    distanceText: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      marginLeft: SIZES.xs,
    },

    // Empty description override
    emptyDescription: {
      fontSize: SIZES.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
  });
};
