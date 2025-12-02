import { StyleSheet } from 'react-native';
import { SIZES } from '../constants/colors';
import { createCommonStyles } from './commonStyles';

/**
 * Creates HistoryDetailScreen-specific styles.
 * 
 * @param {Object} colors - Theme colors object from useAppTheme
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @returns {Object} StyleSheet for HistoryDetailScreen
 */
export const createHistoryDetailStyles = (colors, isDarkMode) => {
  const common = createCommonStyles(colors, isDarkMode);

  return StyleSheet.create({
    // Base
    ...common.container(),
    ...common.content(),

    // Header
    ...common.gradientHeader(),

    // Stats section
    ...common.statsCard(),

    // Item card base
    ...common.itemCard(),

    // Empty state
    ...common.emptyState(),

    // Section header with icon
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SIZES.md,
      paddingVertical: SIZES.md,
    },
    sectionTitle: {
      fontSize: SIZES.h3,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginLeft: SIZES.sm,
    },
    sectionSubtitle: {
      fontSize: SIZES.body,
      color: colors.textSecondary,
      marginTop: SIZES.xs,
    },

    // History section
    historySection: {
      marginHorizontal: SIZES.md,
      marginBottom: SIZES.lg,
    },

    // Content card
    contentCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: SIZES.radiusMedium,
      padding: SIZES.lg,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    historyText: {
      fontSize: SIZES.body,
      color: colors.textPrimary,
      lineHeight: 24,
    },
    noHistoryText: {
      fontSize: SIZES.body,
      color: colors.textSecondary,
      lineHeight: 24,
      fontStyle: 'italic',
    },
    cultureText: {
      fontSize: SIZES.body,
      color: colors.textPrimary,
      lineHeight: 24,
    },

    // Facts container
    factsContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: SIZES.radiusMedium,
      padding: SIZES.md,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    factItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: SIZES.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    factIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SIZES.md,
    },
    factContent: {
      flex: 1,
    },
    factTitle: {
      fontSize: SIZES.body,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: SIZES.xs,
    },
    factDescription: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      lineHeight: 18,
    },

    // Source section
    ...common.sourceSection(),

    // Additional item styles for compatibility
    distanceText: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
    },
    emptyDescription: {
      fontSize: SIZES.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
  });
};
