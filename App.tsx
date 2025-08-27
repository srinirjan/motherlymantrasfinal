import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { BabySetupScreen } from './src/screens/BabySetupScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { FeedingScreen } from './src/screens/FeedingScreen';
import { AllLogsScreen } from './src/screens/AllLogsScreen';
import { AddLogScreen } from './src/screens/AddLogScreen';
import { DiaperScreen } from './src/screens/DiaperScreen';
import { BottomNavigation } from './src/components/BottomNavigation';
import { authService } from './src/services/authService';
import { User, Baby } from './src/types';

type AppState = 'loading' | 'welcome' | 'setup' | 'dashboard' | 'feeding' | 'logs' | 'add-log' | 'diaper' | 'profile' | 'ai-analyzer';

function AppContent() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [baby, setBaby] = useState<Baby | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTab, setCurrentTab] = useState<'home' | 'logs' | 'profile' | 'ai-analyzer'>('home');

  useEffect(() => {
    initializeApp();
  }, []); // Only run once on mount

  const initializeApp = async () => {
    try {
      // Prevent multiple initializations
      if (isInitialized) {
        return;
      }
      
      // Check authentication status
      const isAuthenticated = await authService.isAuthenticated();
      
            if (!isAuthenticated) {
        setAppState('welcome');
        setIsInitialized(true);
        return;
      }

      // Get user data
      const userData = await authService.getCurrentUser();
      if (!userData) {
        setAppState('welcome');
        setIsInitialized(true);
        return;
      }

      // Get baby data for this specific user BEFORE setting user
      const babyKey = `baby_data_${userData.id}`;
      let babyData = await AsyncStorage.getItem(babyKey);
      
      // Migration: Check for old global baby data if user-specific data doesn't exist
      if (!babyData) {
        const oldBabyData = await AsyncStorage.getItem('baby_data');
        if (oldBabyData) {
          // Migrate old data to user-specific storage
          await AsyncStorage.setItem(`baby_data_${userData.id}`, oldBabyData);
          // Remove old global data
          await AsyncStorage.removeItem('baby_data');
          await AsyncStorage.removeItem('setup_complete');
          babyData = oldBabyData;
        }
      }
      
      if (!babyData) {
        // No baby data found for this user, go to setup
        setUser(userData);
        setAppState('setup');
        setIsInitialized(true);
        return;
      }

      // Parse baby data
      const parsedBabyData = JSON.parse(babyData);
      // Convert dateOfBirth string back to Date object
      parsedBabyData.dateOfBirth = new Date(parsedBabyData.dateOfBirth);

      // Set both user and baby data together BEFORE changing app state
      setUser(userData);
      setBaby(parsedBabyData);
      
      // Small delay to ensure state is set before changing app state
      setTimeout(() => {
        setAppState('dashboard');
        setIsInitialized(true);
      }, 100);
    } catch (error) {
      console.error('App initialization error:', error);
      setAppState('welcome');
      setIsInitialized(true);
    }
  };

  const handleAuthSuccess = async (userData: User) => {
    setUser(userData);
    
    // Check if this user already has baby data
    const babyKey = `baby_data_${userData.id}`;
    const existingBabyData = await AsyncStorage.getItem(babyKey);
    
    if (existingBabyData) {
      // User has baby data, go directly to dashboard
      const parsedBabyData = JSON.parse(existingBabyData);
      parsedBabyData.dateOfBirth = new Date(parsedBabyData.dateOfBirth);
      setBaby(parsedBabyData);
      setAppState('dashboard');
    } else {
      // No baby data, go to setup
      setAppState('setup');
    }
    setIsInitialized(true);
  };

  const handleSetupComplete = (babyData: Baby) => {
    setBaby(babyData);
    setAppState('dashboard');
  };

  const handleFeedingPress = () => {
    setAppState('feeding');
  };

  const handleLogsPress = () => {
    setAppState('logs');
    setCurrentTab('logs');
  };

  const handleAddFeedPress = () => {
    setAppState('feeding');
  };

  const handleAddLogPress = () => {
    setAppState('add-log');
  };

  const handleDiaperPress = () => {
    setAppState('diaper');
    setCurrentTab('logs'); // Set tab to logs since diaper is part of tracking
  };

  const handleBackToDashboard = () => {
    setAppState('dashboard');
    setCurrentTab('home');
  };

  const handleTabPress = (tab: 'home' | 'logs' | 'profile' | 'ai-analyzer') => {
    setCurrentTab(tab);
    switch (tab) {
      case 'home':
        setAppState('dashboard');
        break;
      case 'logs':
        setAppState('logs');
        break;
      case 'profile':
        // TODO: Create profile screen
        setAppState('dashboard');
        break;
      case 'ai-analyzer':
        // TODO: Create AI analyzer screen
        setAppState('dashboard');
        break;
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setBaby(null);
      setAppState('welcome');
      setIsInitialized(false); // Allow re-initialization after sign out
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderScreen = () => {
    
    switch (appState) {
      case 'loading':
        console.log('Rendering: Loading screen');
        return (
          <View style={styles.loadingContainer}>
            {/* You can add a loading spinner here */}
          </View>
        );
      
      case 'welcome':
        console.log('Rendering: Login screen (welcome)');
        return (
          <LoginScreen onAuthSuccess={handleAuthSuccess} />
        );
      
      case 'setup':
        console.log('Rendering: Baby setup screen');
        return user ? (
          <BabySetupScreen 
            user={user} 
            onSetupComplete={handleSetupComplete} 
          />
        ) : (
          <LoginScreen onAuthSuccess={handleAuthSuccess} />
        );
      
      case 'dashboard':
        console.log('Rendering: Dashboard screen');
        return user && baby ? (
          <View style={styles.screenWithNavigation}>
                        <DashboardScreen
              user={user}
              baby={baby}
              onSignOut={handleSignOut}
              onFeedingPress={handleFeedingPress}
              onLogsPress={handleLogsPress}
              onDiaperPress={handleDiaperPress}
            />
            <BottomNavigation
              activeTab={currentTab}
              onTabPress={handleTabPress}
            />
          </View>
        ) : (
          <LoginScreen onAuthSuccess={handleAuthSuccess} />
        );
      
      case 'feeding':
        console.log('Rendering: Feeding screen');
        return user && baby ? (
          <FeedingScreen
            user={user}
            baby={baby}
            onBack={handleBackToDashboard}
          />
        ) : (
          <LoginScreen onAuthSuccess={handleAuthSuccess} />
        );
      
      case 'logs':
        console.log('Rendering: Logs screen');
        return user && baby ? (
          <View style={styles.screenWithNavigation}>
            <AllLogsScreen
              user={user}
              baby={baby}
              onBack={handleBackToDashboard}
              onAddLog={handleAddLogPress}
            />
            <BottomNavigation
              activeTab={currentTab}
              onTabPress={handleTabPress}
            />
          </View>
        ) : (
          <LoginScreen onAuthSuccess={handleAuthSuccess} />
        );
      
      case 'add-log':
        console.log('Rendering: Add Log screen');
        return user && baby ? (
          <AddLogScreen
            user={user}
            baby={baby}
            onBack={() => setAppState('logs')}
          />
        ) : (
          <LoginScreen onAuthSuccess={handleAuthSuccess} />
        );
      
      case 'diaper':
        console.log('Rendering: Diaper screen');
        return user && baby ? (
          <DiaperScreen
            user={user}
            baby={baby}
            onBack={handleBackToDashboard}
          />
        ) : (
          <LoginScreen onAuthSuccess={handleAuthSuccess} />
        );
      
      default:
        console.log('Rendering: Default login screen');
        return (
          <LoginScreen onAuthSuccess={handleAuthSuccess} />
        );
    }
  };

  const { theme, isDarkMode } = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      {renderScreen()}
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashboardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenWithNavigation: {
    flex: 1,
  },
});
