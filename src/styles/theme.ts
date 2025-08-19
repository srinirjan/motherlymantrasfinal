import { ViewStyle, TextStyle } from 'react-native';

// Premium Claymorphism color palette
export const colors = {
  // Sophisticated pastels with depth
  lavender: '#D8C7E8',
  mintGreen: '#C7E8D8',
  babyBlue: '#C7D8E8',
  softPeach: '#F2E4D0',
  blushPink: '#F0D6D3',
  
  // Premium background gradients
  backgroundStart: '#FAFBFF',
  backgroundEnd: '#F0F4F8',
  
  // Premium text colors
  darkText: '#2D3748',
  lightText: '#718096',
  white: '#FFFFFF',
  
  // Premium accent colors
  success: '#68D391',
  warning: '#F6E05E',
  error: '#FC8181',
  softRed: '#F56565', // Aesthetically pleasing soft red for stop buttons
  
  // Premium specific colors
  cardBackground: '#FFFFFF',
  inputBackground: '#F7FAFC',
  shadowColor: '#4A5568',
  gold: '#D69E2E',
  silver: '#A0AEC0',
};

// Premium Claymorphism shadow styles
export const shadows = {
  subtle: {
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  soft: {
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  medium: {
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  deep: {
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  premium: {
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  glow: {
    shadowColor: colors.lavender,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  goldGlow: {
    shadowColor: colors.gold,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
};

// Premium Claymorphism styles
export const clayStyles = {
  container: {
    borderRadius: 24,
    backgroundColor: colors.cardBackground,
    ...shadows.medium,
  } as ViewStyle,
  
  button: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...shadows.soft,
  } as ViewStyle,
  
  buttonPrimary: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...shadows.medium,
  } as ViewStyle,
  
  card: {
    borderRadius: 22,
    padding: 24,
    backgroundColor: colors.cardBackground,
    ...shadows.soft,
    margin: 8,
  } as ViewStyle,
  
  cardPremium: {
    borderRadius: 24,
    padding: 28,
    backgroundColor: colors.cardBackground,
    ...shadows.premium,
    margin: 10,
  } as ViewStyle,
  
  input: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 22,
    backgroundColor: colors.inputBackground,
    ...shadows.subtle,
    borderWidth: 0,
  } as ViewStyle,
  
  hero: {
    borderRadius: 28,
    padding: 32,
    backgroundColor: colors.cardBackground,
    ...shadows.goldGlow,
  } as ViewStyle,
};

// Premium Typography System
export const typography = {
  displayLarge: {
    fontSize: 40,
    fontWeight: '800' as const,
    color: colors.darkText,
    lineHeight: 48,
    letterSpacing: -0.5,
    fontFamily: 'System' as const,
  } as TextStyle,
  
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.darkText,
    lineHeight: 40,
    letterSpacing: -0.3,
    fontFamily: 'System' as const,
  } as TextStyle,
  
  h2: {
    fontSize: 28,
    fontWeight: '600' as const,
    color: colors.darkText,
    lineHeight: 36,
    letterSpacing: -0.2,
    fontFamily: 'System' as const,
  } as TextStyle,
  
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.darkText,
    lineHeight: 28,
    letterSpacing: -0.1,
    fontFamily: 'System' as const,
  } as TextStyle,
  
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    color: colors.darkText,
    lineHeight: 28,
    letterSpacing: 0.1,
    fontFamily: 'System' as const,
  } as TextStyle,
  
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.darkText,
    lineHeight: 24,
    letterSpacing: 0.1,
    fontFamily: 'System' as const,
  } as TextStyle,
  
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.darkText,
    lineHeight: 24,
    letterSpacing: 0.1,
    fontFamily: 'System' as const,
  } as TextStyle,
  
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.lightText,
    lineHeight: 20,
    letterSpacing: 0.2,
    fontFamily: 'System' as const,
  } as TextStyle,
  
  captionMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.lightText,
    lineHeight: 20,
    letterSpacing: 0.3,
    fontFamily: 'System' as const,
  } as TextStyle,
  
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    fontFamily: 'System' as const,
  } as TextStyle,
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}; 