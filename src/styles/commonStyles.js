import { StyleSheet } from 'react-native';
import { SIZES } from '../constants/colors';

/**
 * Creates common style helper functions that return partial style objects
 * for composition across screens. All helpers are theme-aware.
 * 
 * @param {Object} colors - Theme colors object from useAppTheme
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @returns {Object} Object containing style helper functions
 */
export const createCommonStyles = (colors, isDarkMode) => {
  // Base shadow configuration
  const baseShadow = {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.05,
    shadowRadius: 4,
    elevation: 3,
  };

  const lightShadow = {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDarkMode ? 0.2 : 0.05,
    shadowRadius: 2,
    elevation: 1,
  };

  return {
    /**
     * Returns base container style
     */
    container: () => ({
      flex: 1,
      backgroundColor: colors.background,
    }),

    /**
     * Returns gradient header bar styles
     */
    gradientHeader: () => ({
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.md,
        paddingTop: SIZES.xl,
      },
      backButton: {
        padding: SIZES.sm,
      },
      headerTitle: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        color: colors.textWhite,
        flex: 1,
        textAlign: 'center',
      },
      headerRight: {
        padding: SIZES.sm,
      },
    }),

    /**
     * Returns stats card container and items styles
     */
    statsCard: () => ({
      statsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.cardBackground,
        marginHorizontal: SIZES.md,
        marginTop: SIZES.md,
        borderRadius: SIZES.radiusMedium,
        paddingVertical: SIZES.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...baseShadow,
      },
      statItem: {
        flex: 1,
        alignItems: 'center',
      },
      statNumber: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        color: colors.primary,
      },
      statLabel: {
        fontSize: SIZES.caption,
        color: colors.textSecondary,
        marginTop: SIZES.xs,
      },
      statDivider: {
        width: 1,
        backgroundColor: colors.border,
        marginHorizontal: SIZES.sm,
      },
    }),

    /**
     * Returns section header styles (title + optional subtitle)
     */
    sectionHeader: () => ({
      sectionHeader: {
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.md,
      },
      sectionTitle: {
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        color: colors.textPrimary,
      },
      sectionSubtitle: {
        fontSize: SIZES.body,
        color: colors.textSecondary,
        marginTop: SIZES.xs,
      },
    }),

    /**
     * Returns content card styles (generic card with border and shadow)
     */
    contentCard: () => ({
      contentCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: SIZES.radiusMedium,
        padding: SIZES.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...baseShadow,
        elevation: 2,
      },
    }),

    /**
     * Returns item card styles (list item cards)
     */
    itemCard: () => ({
      itemCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: SIZES.radiusMedium,
        padding: SIZES.md,
        marginHorizontal: SIZES.md,
        marginBottom: SIZES.sm,
        borderWidth: 1,
        borderColor: colors.border,
        ...baseShadow,
        elevation: 2,
      },
      itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SIZES.sm,
      },
      itemInfo: {
        flex: 1,
      },
      itemName: {
        fontSize: SIZES.body,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: SIZES.xs,
      },
      itemDescription: {
        fontSize: SIZES.caption,
        color: colors.textSecondary,
        marginBottom: SIZES.xs,
      },
      itemDetails: {
        marginTop: SIZES.sm,
      },
    }),

    /**
     * Returns chip/tag styles with optional tint color
     * @param {string} tintColor - Optional hex color for the chip
     */
    chip: (tintColor = colors.primary) => ({
      chip: {
        backgroundColor: tintColor + '15',
        paddingHorizontal: SIZES.sm,
        paddingVertical: SIZES.xxs,
        borderRadius: SIZES.radiusSmall,
        borderWidth: 1,
        borderColor: tintColor + '40',
      },
      chipText: {
        fontSize: SIZES.caption,
        color: tintColor,
        fontWeight: '500',
      },
    }),

    /**
     * Returns icon container styles (circular icon backgrounds)
     * @param {number} size - Size of the container (default 40)
     */
    iconContainer: (size = 40) => ({
      iconContainer: {
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SIZES.md,
      },
    }),

    /**
     * Returns empty state styles
     */
    emptyState: () => ({
      emptyState: {
        alignItems: 'center',
        paddingVertical: SIZES.xxl,
        paddingHorizontal: SIZES.lg,
      },
      emptyTitle: {
        fontSize: SIZES.h3,
        fontWeight: '600',
        color: colors.textPrimary,
        marginTop: SIZES.lg,
        marginBottom: SIZES.sm,
      },
      emptyDescription: {
        fontSize: SIZES.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
      },
    }),

    /**
     * Returns distance display styles
     */
    distance: () => ({
      distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary + '15',
        paddingHorizontal: SIZES.sm,
        paddingVertical: SIZES.xs,
        borderRadius: SIZES.radiusSmall,
      },
      distanceText: {
        fontSize: SIZES.caption,
        color: colors.textSecondary,
        marginLeft: SIZES.xs,
      },
    }),

    /**
     * Returns coordinates row styles
     */
    coordinates: () => ({
      coordinatesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SIZES.xs,
        flex: 1,
      },
      coordinatesText: {
        fontSize: SIZES.caption,
        color: colors.textSecondary,
        marginLeft: SIZES.xs,
        flex: 1,
      },
    }),

    /**
     * Returns address row styles
     */
    address: () => ({
      addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.xs,
      },
      addressText: {
        fontSize: SIZES.caption,
        color: colors.textSecondary,
        marginLeft: SIZES.xs,
        flex: 1,
      },
    }),

    /**
     * Returns rating display styles
     */
    rating: () => ({
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
      ratingText: {
        fontSize: SIZES.caption,
        color: colors.warning,
        marginLeft: SIZES.xxs,
        fontWeight: '600',
      },
    }),

    /**
     * Returns primary action button styles
     */
    primaryButton: () => ({
      button: {
        backgroundColor: colors.primary,
        paddingHorizontal: SIZES.lg,
        paddingVertical: SIZES.md,
        borderRadius: SIZES.radiusMedium,
        ...lightShadow,
      },
      buttonText: {
        fontSize: SIZES.body,
        color: colors.textWhite,
        fontWeight: '600',
      },
    }),

    /**
     * Returns secondary/outline button styles
     */
    secondaryButton: () => ({
      button: {
        backgroundColor: colors.primary + '15',
        paddingHorizontal: SIZES.lg,
        paddingVertical: SIZES.md,
        borderRadius: SIZES.radiusMedium,
        borderWidth: 1,
        borderColor: colors.primary + '40',
        ...lightShadow,
      },
      buttonText: {
        fontSize: SIZES.body,
        color: colors.primary,
        fontWeight: '600',
      },
    }),

    /**
     * Returns loading state styles
     */
    loading: () => ({
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      },
      loadingText: {
        color: colors.textSecondary,
        fontSize: SIZES.md,
        marginTop: SIZES.sm,
        fontWeight: '500',
      },
    }),

    /**
     * Returns scrollable content wrapper style
     */
    content: () => ({
      content: {
        flex: 1,
      },
    }),

    /**
     * Returns source/attribution section styles
     */
    sourceSection: () => ({
      sourceSection: {
        marginHorizontal: SIZES.md,
        marginBottom: SIZES.lg,
        backgroundColor: colors.cardBackground,
        borderRadius: SIZES.radiusMedium,
        padding: SIZES.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...baseShadow,
        elevation: 2,
      },
      sourceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.md,
      },
      sourceTitle: {
        fontSize: SIZES.body,
        fontWeight: '600',
        color: colors.textPrimary,
        marginLeft: SIZES.sm,
      },
      sourceText: {
        fontSize: SIZES.caption,
        color: colors.textSecondary,
        lineHeight: 18,
      },
    }),
  };
};
