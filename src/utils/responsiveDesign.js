import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Screen size categories
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const IS_SMALL_DEVICE = SCREEN_WIDTH < 375;
export const IS_LARGE_DEVICE = SCREEN_WIDTH > 500;
export const IS_TABLET = SCREEN_WIDTH > 600;
export const IS_MOBILE = Platform.OS === 'ios' || Platform.OS === 'android';
export const IS_WEB = Platform.OS === 'web';

// Responsive sizing helper
export const getResponsiveSize = (baseSize, smallSize = null, largeSize = null) => {
  if (IS_SMALL_DEVICE && smallSize) return smallSize;
  if (IS_LARGE_DEVICE && largeSize) return largeSize;
  return baseSize;
};

// Card width for horizontal scrolls
export const getCardWidth = () => {
  if (IS_TABLET) return SCREEN_WIDTH * 0.4;
  if (IS_LARGE_DEVICE) return SCREEN_WIDTH * 0.75;
  return SCREEN_WIDTH * 0.85;
};

// Responsive spacing
export const spacing = {
  xs: getResponsiveSize(4, 3, 6),
  sm: getResponsiveSize(8, 6, 10),
  md: getResponsiveSize(16, 12, 20),
  lg: getResponsiveSize(24, 18, 32),
  xl: getResponsiveSize(32, 24, 40),
  xxl: getResponsiveSize(48, 36, 64),
};

// Responsive font sizes
export const fontSizes = {
  xs: getResponsiveSize(10, 9, 12),
  sm: getResponsiveSize(12, 11, 14),
  base: getResponsiveSize(14, 13, 16),
  lg: getResponsiveSize(16, 15, 18),
  xl: getResponsiveSize(20, 18, 22),
  '2xl': getResponsiveSize(24, 20, 28),
  '3xl': getResponsiveSize(32, 28, 36),
};

// Responsive border radius
export const borderRadius = {
  sm: getResponsiveSize(8, 6, 10),
  md: getResponsiveSize(12, 10, 14),
  lg: getResponsiveSize(16, 14, 18),
  xl: getResponsiveSize(24, 20, 28),
  full: 999,
};

// Image height for cards
export const imageHeights = {
  small: getResponsiveSize(150, 120, 180),
  medium: getResponsiveSize(200, 160, 240),
  large: getResponsiveSize(280, 220, 320),
};

// Shadow presets optimized for mobile
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
};

// Touch target minimum size for accessibility (44x44 on mobile)
export const TOUCH_TARGET_SIZE = IS_MOBILE ? 44 : 40;

// Optimization constants
export const ANIMATION_DURATION = IS_SMALL_DEVICE ? 300 : 400;
export const IMAGE_LOADING_TIMEOUT = 10000; // 10 seconds
export const API_TIMEOUT = 8000; // 8 seconds for API calls

export default {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  IS_SMALL_DEVICE,
  IS_LARGE_DEVICE,
  IS_TABLET,
  IS_MOBILE,
  IS_WEB,
  getCardWidth,
  getResponsiveSize,
  spacing,
  fontSizes,
  borderRadius,
  imageHeights,
  shadows,
  TOUCH_TARGET_SIZE,
  ANIMATION_DURATION,
  IMAGE_LOADING_TIMEOUT,
  API_TIMEOUT,
};
