import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { User, Baby, DiaperLog } from '../types';
import { debugStorage, clearAllStorage } from '../utils/debugStorage';
import { useTheme } from '../context/ThemeContext';
import { useStyles } from '../hooks/useStyles';

const { width } = Dimensions.get('window');

interface DashboardScreenProps {
  user: User;
  baby: Baby;
  onSignOut: () => void;
  onFeedingPress: () => void;
  onLogsPress: () => void;
  onDiaperPress: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  baby,
  onSignOut,
  onFeedingPress,
  onLogsPress,
  onDiaperPress,
}) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { colors, typography, spacing, shadows, clayStyles } = theme;
  const styles = useStyles();

  // Feeding timer states
  const [leftTimer, setLeftTimer] = useState(0);
  const [rightTimer, setRightTimer] = useState(0);
  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(false);
  const [leftInterval, setLeftInterval] = useState<NodeJS.Timeout | null>(null);
  const [rightInterval, setRightInterval] = useState<NodeJS.Timeout | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastOpacity = useState(new Animated.Value(0))[0];

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (leftInterval) clearInterval(leftInterval);
      if (rightInterval) clearInterval(rightInterval);
    };
  }, [leftInterval, rightInterval]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastVisible(false);
    });
  };

  const logDiaper = async (type: 'pee' | 'poop' | 'both') => {
    try {
      const diaperData: DiaperLog = {
        id: `diaper_${Date.now()}`,
        type: type,
        timestamp: new Date().toISOString(),
        babyId: baby.id,
        userId: user.id,
      };

      // Store in diaper logs
      const existingDiaperLogs = await AsyncStorage.getItem(`diapers_${user.id}`);
      const diaperLogs = existingDiaperLogs ? JSON.parse(existingDiaperLogs) : [];
      diaperLogs.unshift(diaperData);
      
      // Keep only last 100 entries
      if (diaperLogs.length > 100) {
        diaperLogs.splice(100);
      }
      
      await AsyncStorage.setItem(`diapers_${user.id}`, JSON.stringify(diaperLogs));
      
      console.log('Diaper logged:', diaperData);
      
      const typeText = type === 'both' ? 'Pee & Poop' : type.charAt(0).toUpperCase() + type.slice(1);
      showToast(`${typeText} logged successfully! 💩`);
    } catch (error) {
      console.error('Error logging diaper:', error);
      showToast('Error logging diaper');
    }
  };

  const saveFeedingSession = async (side: 'left' | 'right', duration: number) => {
    try {
      const feedingData = {
        id: `feeding_${Date.now()}`,
        type: 'breast',
        side: side,
        duration: duration,
        timestamp: new Date().toISOString(),
        babyId: baby.id,
        userId: user.id,
      };

      // Get existing feedings
      const existingFeedings = await AsyncStorage.getItem(`feedings_${user.id}`);
      const feedings = existingFeedings ? JSON.parse(existingFeedings) : [];
      
      // Add new feeding
      feedings.unshift(feedingData);
      
      // Keep only last 50 feedings
      if (feedings.length > 50) {
        feedings.splice(50);
      }
      
      // Save back to storage
      await AsyncStorage.setItem(`feedings_${user.id}`, JSON.stringify(feedings));
      
      console.log('Feeding saved:', feedingData);
      showToast('Feed successfully added!');
      
    } catch (error) {
      console.error('Error saving feeding:', error);
      showToast('Error saving feed');
    }
  };

  const startLeftTimer = async () => {
    if (leftActive) {
      // Stop timer and save if there's duration
      if (leftInterval) clearInterval(leftInterval);
      setLeftInterval(null);
      setLeftActive(false);
      
      // Save feeding session if timer was running for more than 30 seconds
      if (leftTimer > 30) {
        await saveFeedingSession('left', leftTimer);
        // Reset timer after successful save
        setLeftTimer(0);
      }
    } else {
      // Stop right timer if it's running (only one side active at a time)
      if (rightActive) {
        if (rightInterval) clearInterval(rightInterval);
        setRightInterval(null);
        setRightActive(false);
        
        // Save right session if it was running for more than 30 seconds
        if (rightTimer > 30) {
          await saveFeedingSession('right', rightTimer);
          setRightTimer(0);
        }
      }
      
      // Start left timer
      setLeftActive(true);
      const interval = setInterval(() => {
        setLeftTimer(prev => prev + 1);
      }, 1000);
      setLeftInterval(interval);
    }
  };

  const startRightTimer = async () => {
    if (rightActive) {
      // Stop timer and save if there's duration
      if (rightInterval) clearInterval(rightInterval);
      setRightInterval(null);
      setRightActive(false);
      
      // Save feeding session if timer was running for more than 30 seconds
      if (rightTimer > 30) {
        await saveFeedingSession('right', rightTimer);
        // Reset timer after successful save
        setRightTimer(0);
      }
    } else {
      // Stop left timer if it's running (only one side active at a time)
      if (leftActive) {
        if (leftInterval) clearInterval(leftInterval);
        setLeftInterval(null);
        setLeftActive(false);
        
        // Save left session if it was running for more than 30 seconds
        if (leftTimer > 30) {
          await saveFeedingSession('left', leftTimer);
          setLeftTimer(0);
        }
      }
      
      // Start right timer
      setRightActive(true);
      const interval = setInterval(() => {
        setRightTimer(prev => prev + 1);
      }, 1000);
      setRightInterval(interval);
    }
  };

  const resetTimers = () => {
    // Stop all timers
    if (leftInterval) clearInterval(leftInterval);
    if (rightInterval) clearInterval(rightInterval);
    
    // Reset all states
    setLeftInterval(null);
    setRightInterval(null);
    setLeftActive(false);
    setRightActive(false);
    setLeftTimer(0);
    setRightTimer(0);
  };

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
    if (option.id === 'feeding') {
      // Navigate to feeding screen
      console.log('Opening feeding screen');
      // TODO: Add navigation to feeding screen
    } else {
      // TODO: Navigate to other tracking screens
      console.log('Tracking option pressed:', option.id);
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
          {/* Header */}
          <View style={styles.header}>
                                  <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Good day, {user.name}! 👋</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                <Ionicons 
                  name={isDarkMode ? "sunny" : "moon"} 
                  size={18} 
                  color={colors.white} 
                />
                <Text style={styles.themeButtonText}>
                  {isDarkMode ? 'Light' : 'Dark'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSignOut} style={styles.signOutButton}>
                <Ionicons name="log-out-outline" size={18} color={colors.white} />
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>

            {/* Debug buttons - can be removed in production */}
            <View style={styles.debugSection}>
              <TouchableOpacity onPress={debugStorage} style={styles.debugButton}>
                <Text style={styles.debugText}>Debug Storage</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={async () => {
                const feeds = await AsyncStorage.getItem(`feedings_${user.id}`);
                console.log('Stored feeds:', feeds ? JSON.parse(feeds) : 'No feeds found');
              }} style={styles.debugButton}>
                <Text style={styles.debugText}>Show Feeds</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={clearAllStorage} style={styles.debugButton}>
                <Text style={styles.debugText}>Clear All Data</Text>
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

          {/* Quick Feeding Section */}
          <View style={styles.quickFeedingSection}>
            <Text style={styles.sectionTitle}>Quick Feeding</Text>
            
            {/* Feeding Status */}
            {(leftActive || rightActive) && (
              <View style={[
                styles.feedingStatusCard,
                leftActive && !rightActive && styles.feedingStatusCardLeftActive,
                rightActive && !leftActive && styles.feedingStatusCardRightActive,
                leftActive && rightActive && styles.feedingStatusCardBothActive,
              ]}>
                <View style={styles.feedingStatusHeader}>
                  <View style={styles.feedingStatusLeft}>
                    <Ionicons name="time" size={20} color={colors.darkText} />
                    <Text style={styles.feedingStatusText}>Feeding in progress</Text>
                  </View>
                  <View style={styles.feedingStatusButtons}>
                    <TouchableOpacity 
                      style={styles.resetButton}
                      onPress={resetTimers}
                    >
                      <Ionicons name="refresh" size={16} color={colors.darkText} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.detailsButton}
                      onPress={() => onFeedingPress()}
                    >
                      <Text style={styles.detailsButtonText}>Details</Text>
                      <Ionicons name="chevron-forward" size={16} color={colors.darkText} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.timersRow}>
                  <View style={styles.timerDisplay}>
                    <Text style={styles.timerLabel}>Left</Text>
                    <Text style={styles.timerTime}>{formatTime(leftTimer)}</Text>
                  </View>
                  <View style={styles.timerDivider} />
                  <View style={styles.timerDisplay}>
                    <Text style={styles.timerLabel}>Right</Text>
                    <Text style={styles.timerTime}>{formatTime(rightTimer)}</Text>
                  </View>
                </View>
              </View>
            )}
            
            {/* Feeding Buttons */}
            <View style={styles.feedingButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.feedingButton,
                  leftActive && styles.feedingButtonActive
                ]}
                onPress={startLeftTimer}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="chevron-back" 
                  size={28} 
                  color={leftActive ? colors.white : colors.darkText} 
                />
                <Text style={[
                  styles.feedingButtonText,
                  leftActive && styles.feedingButtonTextActive
                ]}>
                  {leftActive ? 'Stop Left' : 'Start Left'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.feedingButton,
                  rightActive && styles.feedingButtonActive
                ]}
                onPress={startRightTimer}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="chevron-forward" 
                  size={28} 
                  color={rightActive ? colors.white : colors.darkText} 
                />
                <Text style={[
                  styles.feedingButtonText,
                  rightActive && styles.feedingButtonTextActive
                ]}>
                  {rightActive ? 'Stop Right' : 'Start Right'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {!(leftActive || rightActive) && (
              <Text style={styles.feedingHint}>Tap a button to start timing</Text>
            )}
          </View>

          {/* Quick Diaper Log */}
          <View style={styles.quickDiaperSection}>
            <Text style={styles.sectionTitle}>Quick Diaper Log</Text>
            <View style={styles.diaperButtonsRow}>
              <TouchableOpacity
                style={[styles.diaperButton, { backgroundColor: colors.babyBlue }]}
                activeOpacity={0.8}
                onPress={() => logDiaper('pee')}
              >
                <Ionicons name="water" size={32} color={colors.white} />
                <Text style={styles.diaperButtonText}>Pee</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.diaperButton, { backgroundColor: colors.softPeach }]}
                activeOpacity={0.8}
                onPress={() => logDiaper('poop')}
              >
                <Ionicons name="ellipse" size={32} color={colors.darkText} />
                <Text style={[styles.diaperButtonText, { color: colors.darkText }]}>Poop</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.viewLogsButton}
              onPress={onDiaperPress}
            >
              <Ionicons name="list" size={16} color={colors.darkText} />
              <Text style={styles.viewLogsText}>View Diaper Logs</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Nap Timer */}
          <View style={styles.quickNapSection}>
            <Text style={styles.sectionTitle}>Quick Nap Timer</Text>
            <View style={styles.napTimerContainer}>
              <Text style={styles.napTimer}>0:00</Text>
              <TouchableOpacity style={styles.napButton} activeOpacity={0.8}>
                <Ionicons name="moon" size={20} color={colors.darkText} />
                <Text style={styles.napButtonText}>Start Nap</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Additional Features */}
          <View style={styles.additionalFeaturesSection}>
            <View style={styles.featuresRow}>
              <TouchableOpacity style={styles.featureCard} activeOpacity={0.8}>
                <View style={[styles.featureIcon, { backgroundColor: colors.softPeach }]}>
                  <Ionicons name="camera" size={24} color={colors.white} />
                </View>
                <Text style={styles.featureTitle}>AI Poop Analyzer</Text>
              </TouchableOpacity>
              
                                           <TouchableOpacity style={styles.featureCard} activeOpacity={0.8} onPress={onLogsPress}>
                <View style={[styles.featureIcon, { backgroundColor: colors.babyBlue }]}>
                  <Ionicons name="time" size={24} color={colors.white} />
                </View>
                <Text style={styles.featureTitle}>Feeding History</Text>
              </TouchableOpacity>
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
        
        {/* Toast Notification */}
        {toastVisible && (
          <Animated.View 
            style={[
              styles.toastContainer,
              { opacity: toastOpacity }
            ]}
          >
            <View style={styles.toast}>
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              <Text style={styles.toastText}>{toastMessage}</Text>
            </View>
          </Animated.View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

 