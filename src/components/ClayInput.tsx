import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { colors, clayStyles, typography, shadows, spacing } from '../styles/theme';

interface ClayInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export const ClayInput: React.FC<ClayInputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      <View style={[
        styles.inputContainer,
        isFocused && styles.focusedContainer,
        error && styles.errorContainer,
      ]}>
        <TextInput
          style={[styles.input, inputStyle]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={colors.lightText}
          selectionColor={colors.lavender}
          {...textInputProps}
        />
      </View>
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
    color: colors.darkText,
  },
  inputContainer: {
    ...clayStyles.input,
    backgroundColor: colors.inputBackground,
  },
  focusedContainer: {
    ...shadows.deep,
    borderWidth: 2,
    borderColor: colors.lavender,
  },
  errorContainer: {
    borderWidth: 2,
    borderColor: colors.error,
  },
  input: {
    ...typography.body,
    color: colors.darkText,
    flex: 1,
    minHeight: 20,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
}); 