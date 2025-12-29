// Dynamic theme colors
export const LIGHT_THEME = {
  // Primary colors
  primary: 'hsl(12, 55%, 26%)',
  primaryDark: 'hsl(12, 55%, 20%)',
  primaryLight: 'hsl(12, 55%, 32%)',
  secondary: 'hsl(190, 60%, 10%)',
  
  // Background colors
  background: 'hsl(12, 60%, 97%)',
  backgroundSecondary: 'hsl(12, 60%, 92%)',
  backgroundAccent: 'hsl(12, 60%, 95%)',
  lightBackground: 'hsl(12, 60%, 100%)',
  
  // Text colors
  textPrimary: 'hsl(349, 60%, 6%)',
  textSecondary: 'hsl(12, 55%, 26%)',
  textMuted: 'hsl(11, 45%, 65%)',
  textWhite: '#FFFFFF',
    // Accent colors
  accent: 'hsl(11, 60%, 100%)',
  success: 'hsl(161, 60%, 15%)',
  warning: 'hsl(53, 60%, 14%)',
  error: 'hsl(7, 35%, 41%)',
  info: 'hsl(217, 40%, 44%)',
  
  // Gradient colors
  gradientStart: 'hsl(12, 55%, 26%)',
  gradientEnd: 'hsl(190, 60%, 10%)',
    // Card and border colors
  cardBackground: 'hsl(12, 60%, 100%)',
  borderLight: 'hsl(11, 45%, 65%)',
  border: 'hsl(11, 35%, 52%)',
  shadow: 'rgba(0, 0, 0, 0.08)',
};

export const DARK_THEME = {
  // Primary colors (keep vibrant for good contrast)
  primary: 'hsl(11, 55%, 72%)',
  primaryDark: 'hsl(11, 55%, 62%)',
  primaryLight: 'hsl(11, 55%, 82%)',
  secondary: 'hsl(187, 55%, 38%)',
  
  // Background colors
  background: 'hsl(1, 55%, 6%)',
  backgroundSecondary: 'hsl(355, 55%, 3%)',
  backgroundAccent: 'hsl(6, 50%, 9%)',
  lightBackground: 'hsl(6, 50%, 9%)',
  
  // Text colors
  textPrimary: 'hsl(12, 60%, 98%)',
  textSecondary: 'hsl(12, 45%, 72%)',
  textMuted: 'hsl(12, 40%, 62%)',
  textWhite: '#FFFFFF',
    // Accent colors
  accent: 'hsl(11, 40%, 40%)',
  success: 'hsl(154, 35%, 47%)',
  warning: 'hsl(52, 45%, 40%)',
  error: 'hsl(8, 50%, 66%)',
  info: 'hsl(217, 55%, 69%)',
  
  // Gradient colors
  gradientStart: 'hsl(11, 55%, 72%)',
  gradientEnd: 'hsl(187, 55%, 38%)',
  
  // Card and border colors
  cardBackground: 'hsl(6, 50%, 9%)',
  borderLight: 'hsl(1, 55%, 16%)',
  border: 'hsl(12, 55%, 26%)',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

// Legacy COLORS export for backward compatibility
export const COLORS = LIGHT_THEME;

export const SIZES = {
  // Font sizes
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  body: 16,
  caption: 15,
  small: 12,
  
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Border radius
  radiusSmall: 8,
  radiusMedium: 12,
  radiusLarge: 20,
  
  // Icon sizes
  iconSmall: 16,
  iconMedium: 24,
  iconLarge: 32,
};
