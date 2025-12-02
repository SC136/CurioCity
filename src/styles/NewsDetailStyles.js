import { StyleSheet } from 'react-native';
import { SIZES } from '../constants/colors';
import { createCommonStyles } from './commonStyles';

/**
 * Creates NewsDetailScreen-specific styles.
 * 
 * @param {Object} colors - Theme colors object from useAppTheme
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @returns {Object} StyleSheet for NewsDetailScreen
 */
export const createNewsDetailStyles = (colors, isDarkMode) => {
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

    // News card
    newsCard: {
      flexDirection: 'row',
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
      alignItems: 'flex-start',
    },
    newsImage: {
      width: 60,
      height: 60,
      borderRadius: SIZES.radiusSmall,
      marginRight: SIZES.md,
      backgroundColor: colors.lightBackground,
    },
    placeholderImage: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.lightBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    newsContent: {
      flex: 1,
    },
    newsTitle: {
      fontSize: SIZES.body,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: SIZES.xs,
    },
    newsDescription: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      lineHeight: 18,
      marginBottom: SIZES.sm,
    },
    newsFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    newsSource: {
      fontSize: SIZES.caption,
      color: colors.primary,
      fontWeight: '600',
    },
    newsDate: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
    },

    // Empty state extras
    emptyDescription: {
      fontSize: SIZES.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
  });
};
