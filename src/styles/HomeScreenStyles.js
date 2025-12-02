import { StyleSheet } from 'react-native';
import { SIZES } from '../constants/colors';
import { createCommonStyles } from './commonStyles';

/**
 * Creates HomeScreen-specific styles, composing common styles with screen-specific overrides.
 * 
 * @param {Object} colors - Theme colors object from useAppTheme
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @returns {Object} StyleSheet for HomeScreen
 */
export const createHomeScreenStyles = (colors, isDarkMode) => {
  const common = createCommonStyles(colors, isDarkMode);

  return StyleSheet.create({
    // Base container
    ...common.container(),

    // Loading states
    ...common.loading(),

    // Welcome section (gradient header area)
    welcomeSection: {
      paddingTop: SIZES.xl,
      paddingBottom: SIZES.lg,
      paddingHorizontal: SIZES.lg,
    },
    welcomeContent: {
      paddingTop: SIZES.md,
    },
    welcomeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: SIZES.md,
    },
    welcomeTextContainer: {
      flex: 1,
      marginRight: SIZES.md,
    },
    welcomeText: {
      fontSize: SIZES.xl,
      fontWeight: 'bold',
      color: colors.textWhite,
      lineHeight: SIZES.xl * 1.2,
    },
    headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.sm,
    },
    themeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    locationButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    locationDescription: {
      fontSize: SIZES.md,
      color: colors.textWhite,
      opacity: 0.9,
      lineHeight: SIZES.md * 1.4,
      marginBottom: SIZES.lg,
    },
    readMoreButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.md,
      borderRadius: SIZES.radiusMedium,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      alignSelf: 'flex-start',
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    readMoreText: {
      color: colors.textWhite,
      fontSize: SIZES.md,
      fontWeight: '600',
      marginRight: SIZES.xs,
    },

    // Content container
    contentContainer: {
      padding: SIZES.lg,
    },
    sectionHeading: {
      fontSize: SIZES.lg,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: SIZES.lg,
      textAlign: 'center',
    },

    // Content sections
    contentSection: {
      marginBottom: SIZES.lg,
    },
    historySection: {
      marginBottom: SIZES.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SIZES.md,
    },
    sectionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SIZES.sm,
    },
    sectionTitle: {
      fontSize: SIZES.md,
      fontWeight: '600',
      color: colors.textPrimary,
      flex: 1,
    },
    dataCount: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
      fontWeight: '500',
    },

    // Content card
    contentCard: {
      backgroundColor: colors.cardBackground,
      borderRadius: SIZES.md,
      padding: SIZES.lg,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.05,
      shadowRadius: 4,
      elevation: 3,
    },
    historyText: {
      fontSize: SIZES.md,
      color: colors.textSecondary,
      lineHeight: SIZES.md * 1.4,
      marginBottom: SIZES.md,
    },
    readHistoryButton: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primary + '15',
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.md,
      borderRadius: SIZES.radiusMedium,
      borderWidth: 1,
      borderColor: colors.primary + '40',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.2 : 0.05,
      shadowRadius: 2,
      elevation: 1,
      marginTop: SIZES.sm,
    },
    readHistoryText: {
      color: colors.primary,
      fontSize: SIZES.body,
      fontWeight: '600',
    },

    // Loading section
    loadingSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SIZES.md,
    },

    // Data section
    dataSection: {
      gap: SIZES.sm,
    },
    dataItem: {
      paddingVertical: SIZES.xs,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dataItemTitle: {
      fontSize: SIZES.md,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: SIZES.xxs,
    },
    dataItemSubtitle: {
      fontSize: SIZES.caption,
      color: colors.textSecondary,
    },

    // View all button
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: SIZES.md,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      borderRadius: SIZES.radiusMedium,
      backgroundColor: colors.secondary + '15',
      borderWidth: 1,
      borderColor: colors.secondary + '40',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.2 : 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    viewAllText: {
      fontSize: SIZES.body,
      fontWeight: '600',
      color: colors.primary,
      marginRight: SIZES.xs,
    },

    // No data state
    noDataSection: {
      alignItems: 'center',
      paddingVertical: SIZES.lg,
    },
    noDataText: {
      fontSize: SIZES.md,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
  });
};
