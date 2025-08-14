import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ClayButton } from '../components/ClayButton';
import { ClayInput } from '../components/ClayInput';
import { colors, typography, spacing, shadows, clayStyles } from '../styles/theme';
import { Baby, User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface BabySetupScreenProps {
  user: User;
  onSetupComplete: (baby: Baby) => void;
}

export const BabySetupScreen: React.FC<BabySetupScreenProps> = ({
  user,
  onSetupComplete,
}) => {
  const [babyName, setBabyName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; date?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; date?: string } = {};
    
    if (!babyName.trim()) {
      newErrors.name = 'Baby name is required';
    } else if (babyName.trim().length < 2) {
      newErrors.name = 'Baby name must be at least 2 characters';
    }
    
    if (dateOfBirth > new Date()) {
      newErrors.date = 'Date of birth cannot be in the future';
    }
    
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 3);
    if (dateOfBirth < oneYearAgo) {
      newErrors.date = 'Please check the date - seems too far in the past';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSetupComplete = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      const baby: Baby = {
        id: `baby_${Date.now()}`,
        name: babyName.trim(),
        dateOfBirth,
        userId: user.id,
      };

      // Store baby data
      await AsyncStorage.setItem('baby_data', JSON.stringify(baby));
      await AsyncStorage.setItem('setup_complete', 'true');
      
      onSetupComplete(baby);
    } catch (error) {
      console.error('Setup error:', error);
      Alert.alert(
        'Setup Error',
        'Failed to save baby information. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      setErrors({ ...errors, date: undefined });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days old`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} old`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''} old`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={[colors.backgroundStart, colors.backgroundEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeText}>
                Welcome, {user.name}! 👋
              </Text>
              <Text style={styles.setupTitle}>
                Let's set up your baby's profile
              </Text>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.formCard}>
              <View style={styles.babyIconContainer}>
                <Ionicons name="person" size={40} color={colors.blushPink} />
              </View>
              
              <ClayInput
                label="Baby's Name"
                placeholder="Enter your baby's name"
                value={babyName}
                onChangeText={(text) => {
                  setBabyName(text);
                  setErrors({ ...errors, name: undefined });
                }}
                error={errors.name}
                autoCapitalize="words"
                returnKeyType="done"
              />

              <View style={styles.dateSection}>
                <Text style={styles.dateLabel}>Date of Birth</Text>
                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    errors.date && styles.dateButtonError,
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <View style={styles.dateContent}>
                    <Ionicons name="calendar" size={20} color={colors.lavender} />
                    <Text style={styles.dateText}>
                      {formatDate(dateOfBirth)}
                    </Text>
                  </View>
                  <Text style={styles.ageText}>
                    {calculateAge(dateOfBirth)}
                  </Text>
                </TouchableOpacity>
                {errors.date && (
                  <Text style={styles.errorText}>
                    {errors.date}
                  </Text>
                )}
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(new Date().getFullYear() - 3, 0, 1)}
                />
              )}
            </View>
          </View>

          {/* Action Section */}
          <View style={styles.actionSection}>
            <ClayButton
              title="Complete Setup"
              onPress={handleSetupComplete}
              variant="primary"
              size="large"
              loading={isLoading}
              style={styles.setupButton}
            />
            
            <Text style={styles.noteText}>
              You can always update this information later in your baby's profile.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  welcomeCard: {
    ...clayStyles.hero,
    alignItems: 'center',
  },
  welcomeText: {
    ...typography.body,
    color: colors.darkText,
    marginBottom: spacing.sm,
  },
  setupTitle: {
    ...typography.h1,
    textAlign: 'center',
    color: colors.darkText,
  },
  formSection: {
    paddingVertical: spacing.lg,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    ...shadows.soft,
  },
  babyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundStart,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
    ...shadows.soft,
  },
  dateSection: {
    marginVertical: spacing.sm,
  },
  dateLabel: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
    color: colors.darkText,
  },
  dateButton: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    ...shadows.soft,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateButtonError: {
    borderColor: colors.error,
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  dateText: {
    ...typography.body,
    color: colors.darkText,
    marginLeft: spacing.sm,
  },
  ageText: {
    ...typography.caption,
    color: colors.lightText,
    fontStyle: 'italic',
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  actionSection: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  setupButton: {
    width: width - (spacing.lg * 2),
    marginBottom: spacing.lg,
  },
  noteText: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.lightText,
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
  },
}); 