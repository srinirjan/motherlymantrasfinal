import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface ClayButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'google';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ClayButton: React.FC<ClayButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  const { colors, clayStyles, typography, shadows } = theme;

  const styles = StyleSheet.create({
    buttonContainer: {
      borderRadius: 16,
      overflow: 'hidden',
      ...shadows.soft,
    },
    gradient: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
    },
    buttonText: {
      ...typography.button,
      color: colors.darkText,
      textAlign: 'center',
    },
    disabled: {
      opacity: 0.6,
    },
  });
  const getButtonColors = () => {
    switch (variant) {
      case 'primary':
        return [colors.lavender, colors.babyBlue];
      case 'secondary':
        return [colors.mintGreen, colors.softPeach];
      case 'success':
        return [colors.success, colors.mintGreen];
      case 'google':
        return [colors.cardBackground, colors.inputBackground];
      default:
        return [colors.lavender, colors.babyBlue];
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          minHeight: 44,
        };
      case 'medium':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          minHeight: 52,
        };
      case 'large':
        return {
          paddingVertical: 20,
          paddingHorizontal: 32,
          minHeight: 60,
        };
      default:
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          minHeight: 52,
        };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return { fontSize: 14, fontWeight: '600' as const };
      case 'medium':
        return { fontSize: 16, fontWeight: '600' as const };
      case 'large':
        return { fontSize: 18, fontWeight: '700' as const };
      default:
        return { fontSize: 16, fontWeight: '600' as const };
    }
  };

  const buttonColors = getButtonColors();
  const sizeStyles = getSizeStyles();
  const textSizeStyle = getTextSize();

  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        variant === 'primary' && clayStyles.buttonPrimary,
        sizeStyles,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={buttonColors as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, sizeStyles]}
      >
        {loading ? (
          <ActivityIndicator
            color={colors.darkText}
            size="small"
          />
        ) : (
          <Text
            style={[
              styles.buttonText,
              textSizeStyle,
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

 