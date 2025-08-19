import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ViewStyle, TextStyle } from 'react-native';

// Light theme colors
const lightColors = {
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
  softRed: '#F56565',
  
  // Premium specific colors
  cardBackground: '#FFFFFF',
  inputBackground: '#F7FAFC',
  shadowColor: '#4A5568',
  gold: '#D69E2E',
  silver: '#A0AEC0',
};

// Dark theme colors
const darkColors = {
  // Dark mode pastels - muted but still colorful
  lavender: '#9F7AEA',
  mintGreen: '#68D391',
  babyBlue: '#63B3ED',
  softPeach: '#F6AD55',
  blushPink: '#F687B3',
  
  // Dark background gradients
  backgroundStart: '#1A202C',
  backgroundEnd: '#2D3748',
  
  // Dark text colors
  darkText: '#F7FAFC',
  lightText: '#A0AEC0',
  white: '#FFFFFF',
  
  // Dark accent colors
  success: '#68D391',
  warning: '#F6E05E',
  error: '#FC8181',
  softRed: '#F56565',
  
  // Dark specific colors
  cardBackground: '#2D3748',
  inputBackground: '#4A5568',
  shadowColor: '#000000',
  gold: '#D69E2E',
  silver: '#718096',
};

// Premium Claymorphism shadow styles
const lightShadows = {
  subtle: {
    shadowColor: lightColors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  soft: {
    shadowColor: lightColors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  medium: {
    shadowColor: lightColors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  premium: {
    shadowColor: lightColors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  goldGlow: {
    shadowColor: lightColors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

const darkShadows = {
  subtle: {
    shadowColor: darkColors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 2,
  },
  soft: {
    shadowColor: darkColors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  medium: {
    shadowColor: darkColors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
  premium: {
    shadowColor: darkColors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  goldGlow: {
    shadowColor: darkColors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
};

// Typography (same for both themes)
const typography = {
  displayLarge: {
    fontSize: 32,
    fontWeight: '300' as const,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
  },
  captionMedium: {
    fontSize: 13,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
};

// Spacing (same for both themes)
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// Clay styles function that adapts to theme
const createClayStyles = (colors: typeof lightColors, shadows: typeof lightShadows) => ({
  cardPremium: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: spacing.lg,
    ...shadows.soft,
  } as ViewStyle,
  
  buttonPrimary: {
    backgroundColor: colors.mintGreen,
    borderRadius: 25,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    ...shadows.medium,
  } as ViewStyle,
  
  hero: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: spacing.xxl,
    ...shadows.premium,
  } as ViewStyle,
});

interface Theme {
  colors: typeof lightColors;
  shadows: typeof lightShadows;
  typography: typeof typography;
  spacing: typeof spacing;
  clayStyles: ReturnType<typeof createClayStyles>;
}

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme_mode');
        if (savedTheme === 'dark') {
          setIsDarkMode(true);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('theme_mode', newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = isDarkMode ? darkColors : lightColors;
  const shadows = isDarkMode ? darkShadows : lightShadows;
  const clayStyles = createClayStyles(colors, shadows);

  const theme: Theme = {
    colors,
    shadows,
    typography,
    spacing,
    clayStyles,
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 