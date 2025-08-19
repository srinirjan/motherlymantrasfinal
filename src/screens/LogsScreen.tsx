import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { User, Baby, FeedingLog, DiaperLog } from '../types';
import { useTheme } from '../context/ThemeContext';

interface LogsScreenProps {
  user: User;
  baby: Baby;
  onBack: () => void;
  onAddFeed: () => void;
}

export const LogsScreen: React.FC<LogsScreenProps> = ({
  user,
  baby,
  onBack,
  onAddFeed,
}) => {
  const { theme } = useTheme();
  const { colors, typography, spacing, shadows, clayStyles } = theme;
  
  const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>([]);
  const [diaperLogs, setDiaperLogs] = useState<DiaperLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'feeding' | 'diaper'>('all');

  const loadFeedingLogs = async () => {
    try {
      const storedFeedings = await AsyncStorage.getItem(`feedings_${user.id}`);
      if (storedFeedings) {
        const logs = JSON.parse(storedFeedings);
        setFeedingLogs(logs);
      } else {
        setFeedingLogs([]);
      }
    } catch (error) {
      console.error('Error loading feeding logs:', error);
      setFeedingLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDiaperLogs = async () => {
    try {
      const storedDiapers = await AsyncStorage.getItem(`diapers_${user.id}`);
      if (storedDiapers) {
        const logs = JSON.parse(storedDiapers);
        setDiaperLogs(logs);
      } else {
        setDiaperLogs([]);
      }
    } catch (error) {
      console.error('Error loading diaper logs:', error);
      setDiaperLogs([]);
    }
  };

  useEffect(() => {
    loadFeedingLogs();
    loadDiaperLogs();
  }, [user.id]);

  // Reload data when component becomes visible
  useEffect(() => {
    const interval = setInterval(() => {
      loadFeedingLogs();
    }, 2000); // Refresh every 2 seconds when on logs screen

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeedingLogs();
    await loadDiaperLogs();
    setRefreshing(false);
  };

  const formatDuration = (log: FeedingLog) => {
    if (log.type === 'formula' && log.formulaAmount) {
      return `${log.formulaAmount} oz`;
    }
    if (log.duration === 0) {
      return 'Manual';
    }
    const mins = Math.floor(log.duration / 60);
    const secs = log.duration % 60;
    if (mins > 0) {
      return `${mins}m ${secs > 0 ? ` ${secs}s` : ''}`;
    }
    return `${secs}s`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  const getSideIcon = (side?: string) => {
    switch (side) {
      case 'left':
        return 'chevron-back';
      case 'right':
        return 'chevron-forward';
      case 'both':
        return 'swap-horizontal';
      default:
        return 'heart';
    }
  };

  const getSideColor = (side?: string) => {
    switch (side) {
      case 'left':
        return colors.babyBlue;
      case 'right':
        return colors.lavender;
      case 'both':
        return colors.mintGreen;
      default:
        return colors.blushPink;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={[colors.backgroundStart, colors.backgroundEnd]}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.darkText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Feeding Logs</Text>
          <TouchableOpacity onPress={onAddFeed} style={styles.addButton}>
            <Ionicons name="add" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsSection}>
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Today's Summary</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {feedingLogs.filter(log => {
                    const logDate = new Date(log.timestamp);
                    const today = new Date();
                    return logDate.toDateString() === today.toDateString();
                  }).length}
                </Text>
                <Text style={styles.statLabel}>Feeds</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {Math.round(
                    feedingLogs
                      .filter(log => {
                        const logDate = new Date(log.timestamp);
                        const today = new Date();
                        return logDate.toDateString() === today.toDateString();
                      })
                      .reduce((total, log) => total + log.duration, 0) / 60
                  )}m
                </Text>
                <Text style={styles.statLabel}>Total Time</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Feeding Logs */}
        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.emptyState}>
              <Ionicons name="time" size={40} color={colors.lightText} />
              <Text style={styles.emptyTitle}>Loading...</Text>
            </View>
          ) : feedingLogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={40} color={colors.lightText} />
              <Text style={styles.emptyTitle}>No feeding logs yet</Text>
              <Text style={styles.emptySubtitle}>
                Start tracking {baby.name}'s feedings to see them here
              </Text>
            </View>
          ) : (
            <View style={styles.logsContainer}>
              {feedingLogs.map((log) => (
                <View key={log.id} style={styles.logCard}>
                  <View style={styles.logHeader}>
                    <View style={[
                      styles.logIcon,
                      { backgroundColor: getSideColor(log.side) }
                    ]}>
                      <Ionicons 
                        name={getSideIcon(log.side) as any} 
                        size={20} 
                        color={colors.white} 
                      />
                    </View>
                    <View style={styles.logInfo}>
                                           <Text style={styles.logTitle}>
                       {log.type === 'breast' ? `${log.side} Breast` : 
                        log.type === 'formula' ? 'Formula' :
                        log.type === 'solid' ? 'Solid Food' : 
                        log.type}
                     </Text>
                      <Text style={styles.logTime}>{formatDate(log.timestamp)}</Text>
                    </View>
                                         <View style={styles.logDuration}>
                       <Text style={styles.durationText}>{formatDuration(log)}</Text>
                     </View>
                  </View>
                </View>
              ))}
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    ...clayStyles.cardPremium,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.darkText,
    fontWeight: '600',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.mintGreen,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  statsCard: {
    ...clayStyles.cardPremium,
    padding: spacing.lg,
  },
  statsTitle: {
    ...typography.h3,
    color: colors.darkText,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    ...typography.h2,
    color: colors.darkText,
    fontWeight: '300',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.lightText,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.inputBackground,
    marginHorizontal: spacing.md,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: 100, // Space for bottom navigation
  },
  
  // Logs Container
  logsContainer: {
    paddingBottom: spacing.xl,
  },
  logCard: {
    ...clayStyles.cardPremium,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  logInfo: {
    flex: 1,
  },
  logTitle: {
    ...typography.bodyLarge,
    color: colors.darkText,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  logTime: {
    ...typography.caption,
    color: colors.lightText,
  },
  logDuration: {
    alignItems: 'flex-end',
  },
  durationText: {
    ...typography.bodyLarge,
    color: colors.darkText,
    fontWeight: '600',
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.darkText,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.lightText,
    textAlign: 'center',
    lineHeight: 24,
  },
}); 