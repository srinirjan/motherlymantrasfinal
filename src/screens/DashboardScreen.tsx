import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, shadows, clayStyles } from '../styles/theme';
import { User, Baby } from '../types';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  user: User;
  baby: Baby;
  onSignOut: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  baby,
  onSignOut,
}) => {
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const diffTime = Math.abs(today.getTime() - birth.getTime());
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

  const trackingOptions = [
    {
      id: 'feeding',
      title: 'Feeding',
      subtitle: 'Track meals & bottles',
      icon: 'restaurant',
      color: colors.success,
      comingSoon: true,
    },
    {
      id: 'diaper',
      title: 'Diaper',
      subtitle: 'Log diaper changes',
      icon: 'fitness',
      color: colors.babyBlue,
      comingSoon: true,
    },
    {
      id: 'sleep',
      title: 'Sleep',
      subtitle: 'Monitor nap times',
      icon: 'moon',
      color: colors.lavender,
      comingSoon: true,
    },
    {
      id: 'growth',
      title: 'Growth',
      subtitle: 'Track height & weight',
      icon: 'trending-up',
      color: colors.softPeach,
      comingSoon: true,
    },
    {
      id: 'health',
      title: 'Health',
      subtitle: 'Medical records',
      icon: 'medical',
      color: colors.blushPink,
      comingSoon: true,
    },
    {
      id: 'milestones',
      title: 'Milestones',
      subtitle: 'First moments',
      icon: 'star',
      color: colors.gold,
      comingSoon: true,
    },
  ];

  const handleTrackingPress = (option: any) => {
    // TODO: Navigate to specific tracking screen
    console.log('Tracking option pressed:', option.id);
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Good day, {user.name}! 👋</Text>
              <TouchableOpacity onPress={onSignOut} style={styles.signOutButton}>
                <Ionicons name="log-out-outline" size={20} color={colors.lightText} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Baby Profile Card */}
          <View style={styles.babyProfileSection}>
            <View style={styles.babyCard}>
              <View style={styles.babyHeader}>
                <View style={styles.babyIconContainer}>
                  <Ionicons name="person" size={32} color={colors.blushPink} />
                </View>
                <View style={styles.babyInfo}>
                  <Text style={styles.babyName}>{baby.name}</Text>
                  <Text style={styles.babyAge}>{calculateAge(baby.dateOfBirth)}</Text>
                </View>
              </View>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Feedings Today</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Naps Today</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Diapers Today</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Quick Tracking</Text>
            <View style={styles.actionsGrid}>
              {trackingOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.actionCard}
                  onPress={() => handleTrackingPress(option)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.actionIcon, { backgroundColor: `${option.color}20` }]}>
                    <Ionicons name={option.icon as any} size={24} color={option.color} />
                  </View>
                  <Text style={styles.actionTitle}>{option.title}</Text>
                  <Text style={styles.actionSubtitle}>{option.subtitle}</Text>
                  {option.comingSoon && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>Soon</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="time-outline" size={40} color={colors.lightText} />
              </View>
              <Text style={styles.emptyTitle}>No activities yet</Text>
              <Text style={styles.emptySubtitle}>
                Start tracking {baby.name}'s daily activities to see them here
              </Text>
            </View>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    ...typography.h2,
    color: colors.darkText,
  },
  signOutButton: {
    padding: spacing.sm,
  },
  babyProfileSection: {
    paddingVertical: spacing.md,
  },
  babyCard: {
    ...clayStyles.cardPremium,
  },
  babyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  babyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundStart,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    ...shadows.soft,
  },
  babyInfo: {
    flex: 1,
  },
  babyName: {
    ...typography.h1,
    color: colors.darkText,
    marginBottom: spacing.xs,
  },
  babyAge: {
    ...typography.body,
    color: colors.lightText,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h1,
    color: colors.darkText,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.lightText,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.lightText,
    opacity: 0.2,
  },
  actionsSection: {
    paddingVertical: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.darkText,
    marginBottom: spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    ...clayStyles.card,
    alignItems: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionTitle: {
    ...typography.h3,
    color: colors.darkText,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  actionSubtitle: {
    ...typography.caption,
    color: colors.lightText,
    textAlign: 'center',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  comingSoonText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.white,
    fontWeight: '600',
  },
  activitySection: {
    paddingVertical: spacing.lg,
  },
  emptyState: {
    ...clayStyles.card,
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.darkText,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.lightText,
    textAlign: 'center',
    lineHeight: 24,
  },
}); 