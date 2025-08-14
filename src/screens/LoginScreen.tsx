import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ClayButton } from '../components/ClayButton';
import { ClayInput } from '../components/ClayInput';
import { colors, typography, spacing, shadows, clayStyles } from '../styles/theme';
import { authService } from '../services/authService';
import { User } from '../types';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  onAuthSuccess: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; name?: string }>({});
  const [isNewUser, setIsNewUser] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; name?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (isNewUser && !name.trim()) {
      newErrors.name = 'Name is required for new accounts';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const user = await authService.signInWithEmail(email.trim(), name.trim() || undefined);
      
      if (user) {
        onAuthSuccess(user);
      } else {
        Alert.alert('Sign In Failed', 'Unable to sign in. Please try again.');
      }
    } catch (error: any) {
      console.error('Sign-In Error:', error);
      
      if (error.message === 'Please enter a valid email address') {
        setErrors({ email: error.message });
      } else {
        Alert.alert(
          'Sign In Error',
          error.message || 'An error occurred while signing in. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserType = () => {
    setIsNewUser(!isNewUser);
    setErrors({});
    setName('');
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
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <View style={styles.iconContainer}>
                <Ionicons name="heart" size={70} color={colors.blushPink} />
              </View>
              <Text style={styles.title}>Motherly Mantras</Text>
              <Text style={styles.subtitle}>
                Your premium companion for tracking your baby's precious moments with elegance
              </Text>
            </View>

            {/* Login Form */}
            <View style={styles.formSection}>
              <View style={styles.formCard}>
                <View style={styles.formHeader}>
                  <Text style={styles.formTitle}>
                    {isNewUser ? 'Create Account' : 'Welcome Back'}
                  </Text>
                  <Text style={styles.formSubtitle}>
                    {isNewUser 
                      ? 'Join thousands of loving parents' 
                      : 'Sign in to continue your journey'
                    }
                  </Text>
                </View>

                <ClayInput
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setErrors({ ...errors, email: undefined });
                  }}
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType={isNewUser ? 'next' : 'done'}
                />

                {isNewUser && (
                  <ClayInput
                    label="Your Name"
                    placeholder="Enter your full name"
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      setErrors({ ...errors, name: undefined });
                    }}
                    error={errors.name}
                    autoCapitalize="words"
                    returnKeyType="done"
                  />
                )}

                <ClayButton
                  title={isNewUser ? 'Create Account' : 'Sign In'}
                  onPress={handleSignIn}
                  variant="primary"
                  size="large"
                  loading={isLoading}
                  style={styles.signInButton}
                />

                <View style={styles.toggleSection}>
                  <Text style={styles.toggleText}>
                    {isNewUser ? 'Already have an account?' : "Don't have an account?"}
                  </Text>
                  <ClayButton
                    title={isNewUser ? 'Sign In' : 'Create Account'}
                    onPress={toggleUserType}
                    variant="secondary"
                    size="small"
                    style={styles.toggleButton}
                  />
                </View>
              </View>
            </View>

            {/* Features Preview */}
            <View style={styles.featuresSection}>
              <Text style={styles.featuresTitle}>What awaits you</Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="restaurant" size={20} color={colors.success} />
                  <Text style={styles.featureText}>Feed Tracking</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="time" size={20} color={colors.lavender} />
                  <Text style={styles.featureText}>Nap Logging</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="camera" size={20} color={colors.babyBlue} />
                  <Text style={styles.featureText}>AI Analysis</Text>
                </View>
              </View>
            </View>

            <Text style={styles.privacyText}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
              Your data is secure and private.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadows.goldGlow,
  },
  title: {
    ...typography.displayLarge,
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: colors.darkText,
  },
  subtitle: {
    ...typography.bodyLarge,
    textAlign: 'center',
    color: colors.lightText,
    lineHeight: 28,
    paddingHorizontal: spacing.lg,
  },
  formSection: {
    paddingVertical: spacing.lg,
  },
  formCard: {
    ...clayStyles.hero,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  formTitle: {
    ...typography.h1,
    marginBottom: spacing.sm,
    color: colors.darkText,
  },
  formSubtitle: {
    ...typography.body,
    color: colors.lightText,
    textAlign: 'center',
  },
  signInButton: {
    width: '100%',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  toggleSection: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  toggleText: {
    ...typography.body,
    color: colors.lightText,
    marginBottom: spacing.sm,
  },
  toggleButton: {
    paddingHorizontal: spacing.xl,
  },
  featuresSection: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  featuresTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
    color: colors.darkText,
  },
  featuresList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    ...typography.caption,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  privacyText: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.lightText,
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
}); 