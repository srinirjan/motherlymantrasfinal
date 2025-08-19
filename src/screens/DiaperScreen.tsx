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
import { User, Baby, DiaperLog } from '../types';
import { useTheme } from '../context/ThemeContext';

interface DiaperScreenProps {
  user: User;
  baby: Baby;
  onBack: () => void;
}

export const DiaperScreen: React.FC<DiaperScreenProps> = ({ user, baby, onBack }) => {
  const { theme, isDarkMode } = useTheme();
  const { colors, typography, spacing, shadows, clayStyles } = theme;
  
  const [diaperLogs, setDiaperLogs] = useState<DiaperLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiaperLogs();
  }, [user.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDiaperLogs();
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

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayLogs = diaperLogs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    );
    
    const peeCount = todayLogs.filter(log => log.type === 'pee' || log.type === 'both').length;
    const poopCount = todayLogs.filter(log => log.type === 'poop' || log.type === 'both').length;
    
    return { peeCount, poopCount, totalCount: todayLogs.length };
  };

  const { peeCount, poopCount, totalCount } = getTodayStats();

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
    refreshButton: {
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

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'pee':
        return { name: 'water' as const, color: colors.babyBlue };
      case 'poop':
        return { name: 'ellipse' as const, color: colors.softPeach };
      case 'both':
        return { name: 'checkmark-circle' as const, color: colors.mintGreen };
      default:
        return { name: 'help-circle' as const, color: colors.lightText };
    }
  };

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
              <Text style={styles.headerTitle}>Diaper Logs</Text>
              <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
                <Ionicons name="refresh" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Today's Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Today's Summary</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{peeCount}</Text>
                <Text style={styles.statLabel}>Pee</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{poopCount}</Text>
                <Text style={styles.statLabel}>Poop</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalCount}</Text>
                <Text style={styles.statLabel}>Total Changes</Text>
              </View>
            </View>
          </View>

          {/* Logs List */}
          <View style={styles.logsList}>
            <Text style={styles.logsTitle}>Recent Activity</Text>
            {loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Loading...</Text>
              </View>
            ) : diaperLogs.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="happy-outline" size={30} color={colors.lightText} />
                </View>
                <Text style={styles.emptyTitle}>No diaper changes yet</Text>
                <Text style={styles.emptySubtitle}>
                  Start tracking {baby.name}'s diaper changes from the dashboard
                </Text>
              </View>
            ) : (
              diaperLogs.map((log) => {
                const icon = getLogIcon(log.type);
                return (
                  <View key={log.id} style={styles.logItem}>
                    <View style={styles.logHeader}>
                      <View style={styles.logType}>
                        <Ionicons name={icon.name} size={24} color={icon.color} />
                        <Text style={styles.logTypeText}>{log.type}</Text>
                      </View>
                      <Text style={styles.logTime}>{formatTime(log.timestamp)}</Text>
                    </View>
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