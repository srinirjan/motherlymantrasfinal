import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ClayButton } from '../components/ClayButton';
import { colors, typography, spacing, shadows, clayStyles } from '../styles/theme';
import { authService } from '../services/authService';
import { User } from '../types';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onAuthSuccess: (user: User) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onAuthSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const user = await authService.signInWithGoogle();
      if (user) {
        onAuthSuccess(user);
      } else {
        Alert.alert('Sign In Failed', 'Unable to sign in with Google. Please try again.');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert(
        'Sign In Error',
        'An error occurred while signing in. Please check your internet connection and try again.'
      );
    } finally {
      setIsLoading(false);
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
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <Ionicons name="heart" size={60} color={colors.blushPink} />
            </View>
            <Text style={styles.title}>Motherly Mantras</Text>
            <Text style={styles.subtitle}>
              Your premium companion for tracking your baby's precious moments with elegance
            </Text>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="restaurant" size={24} color={colors.success} />
              </View>
              <Text style={styles.featureTitle}>Feed Tracking</Text>
              <Text style={styles.featureDescription}>
                Log feeding times and amounts with ease
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="time" size={24} color={colors.lavender} />
              </View>
              <Text style={styles.featureTitle}>Nap Logging</Text>
              <Text style={styles.featureDescription}>
                Track sleep patterns and duration
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="camera" size={24} color={colors.babyBlue} />
              </View>
              <Text style={styles.featureTitle}>AI Analysis</Text>
              <Text style={styles.featureDescription}>
                Smart photo analysis for health insights
              </Text>
            </View>
          </View>

          {/* Call to Action */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaText}>
              Join thousands of loving parents tracking their baby's journey
            </Text>
            
            <ClayButton
              title="Continue with Google"
              onPress={handleGoogleSignIn}
              variant="google"
              size="large"
              loading={isLoading}
              style={styles.signInButton}
            />
            
            <Text style={styles.privacyText}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
              Your data is secure and private.
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
  featuresSection: {
    paddingVertical: spacing.xl,
  },
  featureCard: {
    ...clayStyles.cardPremium,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundStart,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  featureTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  featureDescription: {
    ...typography.body,
    color: colors.lightText,
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaSection: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  ctaText: {
    ...typography.body,
    textAlign: 'center',
    color: colors.darkText,
    marginBottom: spacing.xl,
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  signInButton: {
    width: width - (spacing.lg * 2),
    marginBottom: spacing.lg,
  },
  privacyText: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.lightText,
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
  },
}); 