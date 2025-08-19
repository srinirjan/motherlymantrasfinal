import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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

interface AllLogsScreenProps {
  user: User;
  baby: Baby;
  onBack: () => void;
  onAddFeed: () => void;
}

type LogEntry = (FeedingLog & { logType: 'feeding' }) | (DiaperLog & { logType: 'diaper' });

export const AllLogsScreen: React.FC<AllLogsScreenProps> = ({ user, baby, onBack, onAddFeed }) => {
  const { theme, isDarkMode } = useTheme();
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
    const loadAllLogs = async () => {
      await Promise.all([loadFeedingLogs(), loadDiaperLogs()]);
      setLoading(false);
    };
    loadAllLogs();
  }, [user.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadFeedingLogs(), loadDiaperLogs()]);
    setRefreshing(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m ago`;
    } else if (diffMins > 0) {
      return `${diffMins}m ago`;
    } else {
      return 'Just now';
    }
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
      return `${mins}m${secs > 0 ? ` ${secs}s` : ''}`;
    }
    return `${secs}s`;
  };

  const getCombinedLogs = (): LogEntry[] => {
    const feeding: LogEntry[] = feedingLogs.map(log => ({ ...log, logType: 'feeding' as const }));
    const diaper: LogEntry[] = diaperLogs.map(log => ({ ...log, logType: 'diaper' as const }));
    
    const combined = [...feeding, ...diaper];
    return combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getFilteredLogs = () => {
    const allLogs = getCombinedLogs();
    switch (activeFilter) {
      case 'feeding':
        return allLogs.filter(log => log.logType === 'feeding');
      case 'diaper':
        return allLogs.filter(log => log.logType === 'diaper');
      default:
        return allLogs;
    }
  };

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayFeedings = feedingLogs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    );
    const todayDiapers = diaperLogs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    );
    
    const feedCount = todayFeedings.length;
    const totalFeedTime = todayFeedings.reduce((sum, log) => sum + log.duration, 0);
    const diaperCount = todayDiapers.length;
    
    const formatFeedTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      return mins > 0 ? `${mins}m` : '0m';
    };
    
    return { feedCount, totalFeedTime: formatFeedTime(totalFeedTime), diaperCount };
  };

  const { feedCount, totalFeedTime, diaperCount } = getTodayStats();

  const styles = {
    container: {
      flex: 1,
    },
    background: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.lg,
      paddingBottom: 100,
    },
    header: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
    },
    headerRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.inputBackground,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...shadows.soft,
    },
    headerTitle: {
      ...typography.h1,
      color: colors.darkText,
      fontWeight: '600' as const,
    },
    addButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.mintGreen,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...shadows.soft,
    },
    summaryCard: {
      ...clayStyles.cardPremium,
      marginBottom: spacing.lg,
    },
    summaryTitle: {
      ...typography.h2,
      color: colors.darkText,
      marginBottom: spacing.md,
      fontWeight: '600' as const,
    },
    statsRow: {
      flexDirection: 'row' as const,
      justifyContent: 'space-around' as const,
    },
    statItem: {
      alignItems: 'center' as const,
      flex: 1,
    },
    statNumber: {
      ...typography.displayLarge,
      color: colors.darkText,
      fontWeight: '300' as const,
      marginBottom: spacing.xs,
    },
    statLabel: {
      ...typography.caption,
      color: colors.lightText,
      textAlign: 'center' as const,
    },
    statDivider: {
      width: 1,
      height: 30,
      backgroundColor: colors.inputBackground,
      marginHorizontal: spacing.sm,
    },
    filterContainer: {
      marginBottom: spacing.lg,
    },
    filterRow: {
      flexDirection: 'row' as const,
      gap: spacing.sm,
    },
    filterButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 20,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: colors.inputBackground,
    },
    filterButtonActive: {
      backgroundColor: colors.mintGreen,
      ...shadows.soft,
    },
    filterText: {
      ...typography.bodyMedium,
      color: colors.darkText,
      fontWeight: '600' as const,
    },
    filterTextActive: {
      color: colors.white,
    },
    logsList: {
      marginTop: spacing.lg,
    },
    logsTitle: {
      ...typography.h2,
      color: colors.darkText,
      marginBottom: spacing.md,
      fontWeight: '600' as const,
    },
    logItem: {
      ...clayStyles.cardPremium,
      marginBottom: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    logHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      marginBottom: spacing.sm,
    },
    logType: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    logTypeText: {
      ...typography.bodyLarge,
      color: colors.darkText,
      fontWeight: '600' as const,
      marginLeft: spacing.sm,
      textTransform: 'capitalize' as const,
    },
    logTime: {
      ...typography.body,
      color: colors.lightText,
    },
    logDetails: {
      ...typography.body,
      color: colors.lightText,
      marginTop: spacing.xs,
    },
    emptyState: {
      alignItems: 'center' as const,
      paddingVertical: spacing.xxl,
      marginTop: spacing.lg,
    },
    emptyIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.inputBackground,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
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
      textAlign: 'center' as const,
      lineHeight: 24,
    },
  };

  const getLogIcon = (log: LogEntry) => {
    if (log.logType === 'feeding') {
      const feedLog = log as FeedingLog & { logType: 'feeding' };
      switch (feedLog.type) {
        case 'breast':
          return { name: 'heart' as const, color: colors.blushPink };
        case 'formula':
          return { name: 'nutrition' as const, color: colors.babyBlue };
        case 'solid':
          return { name: 'restaurant' as const, color: colors.softPeach };
        default:
          return { name: 'help-circle' as const, color: colors.lightText };
      }
    } else {
      const diaperLog = log as DiaperLog & { logType: 'diaper' };
      switch (diaperLog.type) {
        case 'pee':
          return { name: 'water' as const, color: colors.babyBlue };
        case 'poop':
          return { name: 'ellipse' as const, color: colors.softPeach };
        case 'both':
          return { name: 'checkmark-circle' as const, color: colors.mintGreen };
        default:
          return { name: 'help-circle' as const, color: colors.lightText };
      }
    }
  };

  const getLogDetails = (log: LogEntry) => {
    if (log.logType === 'feeding') {
      const feedLog = log as FeedingLog & { logType: 'feeding' };
      if (feedLog.type === 'breast') {
        return `${feedLog.side} breast • ${formatDuration(feedLog)}`;
      } else if (feedLog.type === 'formula') {
        return `${feedLog.formulaAmount || 'Formula'}`;
      } else {
        return 'Solid food';
      }
    } else {
      const diaperLog = log as DiaperLog & { logType: 'diaper' };
      return `Diaper change`;
    }
  };

  const filteredLogs = getFilteredLogs();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <LinearGradient
        colors={[colors.backgroundStart, colors.backgroundEnd]}
        style={styles.background}
      >
        <ScrollView
          style={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color={colors.darkText} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>All Logs</Text>
              <TouchableOpacity onPress={onAddFeed} style={styles.addButton}>
                <Ionicons name="add" size={24} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Today's Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Today's Summary</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{feedCount}</Text>
                <Text style={styles.statLabel}>Feeds</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalFeedTime}</Text>
                <Text style={styles.statLabel}>Feed Time</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{diaperCount}</Text>
                <Text style={styles.statLabel}>Diapers</Text>
              </View>
            </View>
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'all' && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter('all')}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === 'all' && styles.filterTextActive,
                ]}>
                  All Logs
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'feeding' && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter('feeding')}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === 'feeding' && styles.filterTextActive,
                ]}>
                  Feeding
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'diaper' && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter('diaper')}
              >
                <Text style={[
                  styles.filterText,
                  activeFilter === 'diaper' && styles.filterTextActive,
                ]}>
                  Diaper
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logs List */}
          <View style={styles.logsList}>
            <Text style={styles.logsTitle}>Recent Activity</Text>
            {loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Loading...</Text>
              </View>
            ) : filteredLogs.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="happy-outline" size={30} color={colors.lightText} />
                </View>
                <Text style={styles.emptyTitle}>No logs yet</Text>
                <Text style={styles.emptySubtitle}>
                  Start tracking {baby.name}'s activities to see them here
                </Text>
              </View>
            ) : (
              filteredLogs.map((log) => {
                const icon = getLogIcon(log);
                return (
                  <View key={log.id} style={styles.logItem}>
                    <View style={styles.logHeader}>
                      <View style={styles.logType}>
                        <Ionicons name={icon.name} size={24} color={icon.color} />
                        <Text style={styles.logTypeText}>
                          {log.logType === 'feeding' 
                            ? (log as FeedingLog).type 
                            : (log as DiaperLog).type
                          }
                        </Text>
                      </View>
                      <Text style={styles.logTime}>{formatTime(log.timestamp)}</Text>
                    </View>
                    <Text style={styles.logDetails}>{getLogDetails(log)}</Text>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}; 