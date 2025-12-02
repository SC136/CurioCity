import { StyleSheet } from 'react-native';
import { SIZES } from '../constants/colors';
import { createCommonStyles } from './commonStyles';

/**
 * Creates PlacesDetailScreen-specific styles.
 * 
 * @param {Object} colors - Theme colors object from useAppTheme
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @returns {Object} StyleSheet for PlacesDetailScreen
 */
export const createPlacesDetailStyles = (colors, isDarkMode) => {
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

    // Item card
    ...common.itemCard(),

    // Empty state
    ...common.emptyState(),

    // Distance
    ...common.distance(),

    // Coordinates
    ...common.coordinates(),

    // Place icon container
    placeIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SIZES.md,
    },

    // Rating
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
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
