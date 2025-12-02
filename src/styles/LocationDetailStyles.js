import { StyleSheet } from 'react-native';
import { SIZES } from '../constants/colors';
import { createCommonStyles } from './commonStyles';

/**
 * Creates LocationDetailScreen-specific styles.
 * 
 * @param {Object} colors - Theme colors object from useAppTheme
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @returns {Object} StyleSheet for LocationDetailScreen
 */
export const createLocationDetailStyles = (colors, isDarkMode) => {
  const common = createCommonStyles(colors, isDarkMode);

  return StyleSheet.create({
    // Base
    ...common.container(),

    // Header
    ...common.gradientHeader(),

    // Image container
    imageContainer: {
      marginHorizontal: SIZES.md,
      marginTop: SIZES.lg,
      borderRadius: SIZES.radiusMedium,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.3 : 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    locationImage: {
      width: '100%',
      height: 200,
      backgroundColor: colors.lightBackground,
    },

    // Content container
    contentContainer: {
      paddingHorizontal: SIZES.md,
    },

    // Section
    section: {
      marginVertical: SIZES.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SIZES.md,
    },
    sectionTitle: {
      fontSize: SIZES.h3,
      fontWeight: 'bold',
      color: colors.textPrimary,
      flex: 1,
    },

    // Wikipedia button
    wikipediaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      paddingHorizontal: SIZES.md,
      paddingVertical: SIZES.sm,
      borderRadius: SIZES.radiusMedium,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    wikipediaButtonText: {
      fontSize: SIZES.caption,
      color: colors.primary,
      marginLeft: SIZES.xs,
      fontWeight: '600',
    },

    // Section content
    sectionContent: {
      fontSize: SIZES.body,
      color: colors.textSecondary,
      lineHeight: 24,
    },

    // Facts list
    factsList: {
      backgroundColor: colors.cardBackground,
      borderRadius: SIZES.radiusMedium,
      padding: SIZES.sm,
      borderWidth: isDarkMode ? 1 : 0,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    factItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    factContent: {
      marginLeft: SIZES.md,
      flex: 1,
    },
    factLabel: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      marginBottom: SIZES.xs,
    },
    factValue: {
      fontSize: SIZES.body,
      color: colors.textPrimary,
      fontWeight: '500',
    },

    // Summary grid
    summaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: SIZES.md,
    },
    summaryItem: {
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
      borderRadius: SIZES.radiusMedium,
      padding: SIZES.md,
      marginBottom: SIZES.sm,
      minWidth: '30%',
      borderWidth: isDarkMode ? 1 : 0,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    summaryCount: {
      fontSize: SIZES.h3,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginTop: SIZES.xs,
    },
    summaryLabel: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: SIZES.xs,
    },

    // Data source note
    dataSourceNote: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.cardBackground,
      padding: SIZES.md,
      borderRadius: SIZES.radiusSmall,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      borderWidth: isDarkMode ? 1 : 0,
      borderColor: colors.border,
    },
    dataSourceText: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      marginLeft: SIZES.sm,
      flex: 1,
      lineHeight: 18,
    },
  });
};
