import { StyleSheet } from 'react-native';
import { SIZES } from '../constants/colors';
import { createCommonStyles } from './commonStyles';

/**
 * Creates HolyPlacesDetailScreen-specific styles.
 * 
 * @param {Object} colors - Theme colors object from useAppTheme
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @returns {Object} StyleSheet for HolyPlacesDetailScreen
 */
export const createHolyPlacesDetailStyles = (colors, isDarkMode) => {
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

    // Coordinates
    ...common.coordinates(),

    // Address
    ...common.address(),

    // Religion icon container
    religionIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SIZES.md,
    },

    // Place type text
    placeType: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      marginTop: SIZES.xxs,
    },

    // Distance text
    distanceText: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
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
