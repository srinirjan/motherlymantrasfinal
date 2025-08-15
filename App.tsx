import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginScreen } from './src/screens/LoginScreen';
import { BabySetupScreen } from './src/screens/BabySetupScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { authService } from './src/services/authService';
import { User, Baby } from './src/types';

type AppState = 'loading' | 'welcome' | 'setup' | 'dashboard';

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [baby, setBaby] = useState<Baby | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []); // Only run once on mount

  const initializeApp = async () => {
    try {
      console.log('=== APP INITIALIZATION DEBUG ===');
      console.log('Is initialized:', isInitialized);
      
      // Prevent multiple initializations
      if (isInitialized) {
        console.log('Already initialized, skipping...');
        return;
      }
      
      // Check authentication status
      const isAuthenticated = await authService.isAuthenticated();
      console.log('Is authenticated:', isAuthenticated);
      
      if (!isAuthenticated) {
        console.log('Not authenticated, going to welcome');
        setAppState('welcome');
        setIsInitialized(true);
        return;
      }

      // Get user data
      const userData = await authService.getCurrentUser();
      console.log('User data:', userData);
      if (!userData) {
        console.log('No user data, going to welcome');
        setAppState('welcome');
        setIsInitialized(true);
        return;
      }
      
      // Get baby data for this specific user BEFORE setting user
      const babyKey = `baby_data_${userData.id}`;
      console.log('Looking for baby data with key:', babyKey);
      let babyData = await AsyncStorage.getItem(babyKey);
      console.log('Baby data found:', babyData);
      
      // Migration: Check for old global baby data if user-specific data doesn't exist
      if (!babyData) {
        console.log('No user-specific baby data, checking for old global data');
        const oldBabyData = await AsyncStorage.getItem('baby_data');
        console.log('Old global baby data:', oldBabyData);
        if (oldBabyData) {
          // Migrate old data to user-specific storage
          await AsyncStorage.setItem(`baby_data_${userData.id}`, oldBabyData);
          // Remove old global data
          await AsyncStorage.removeItem('baby_data');
          await AsyncStorage.removeItem('setup_complete');
          babyData = oldBabyData;
          console.log('Migrated old data to user-specific storage');
        }
      }
      
      if (!babyData) {
        // No baby data found for this user, go to setup
        console.log('No baby data found, going to setup');
        setUser(userData);
        setAppState('setup');
        setIsInitialized(true);
        return;
      }

      // Parse baby data
      const parsedBabyData = JSON.parse(babyData);
      // Convert dateOfBirth string back to Date object
      parsedBabyData.dateOfBirth = new Date(parsedBabyData.dateOfBirth);
      console.log('Parsed baby data:', parsedBabyData);

      // Set both user and baby data together BEFORE changing app state
      console.log('Setting user and baby data together');
      console.log('About to set user:', userData);
      console.log('About to set baby:', parsedBabyData);
      setUser(userData);
      setBaby(parsedBabyData);
      console.log('User and baby states have been set');
      
      // Small delay to ensure state is set before changing app state
      setTimeout(() => {
        console.log('Going to dashboard');
        setAppState('dashboard');
        setIsInitialized(true);
      }, 100);
      console.log('=== END APP INITIALIZATION DEBUG ===');
    } catch (error) {
      console.error('App initialization error:', error);
      setAppState('welcome');
      setIsInitialized(true);
    }
  };

  const handleAuthSuccess = async (userData: User) => {
    console.log('Auth success, checking for existing baby data');
    setUser(userData);
    
    // Check if this user already has baby data
    const babyKey = `baby_data_${userData.id}`;
    console.log('Looking for existing baby data with key:', babyKey);
    const existingBabyData = await AsyncStorage.getItem(babyKey);
    console.log('Existing baby data found:', existingBabyData);
    
    if (existingBabyData) {
      // User has baby data, go directly to dashboard
      const parsedBabyData = JSON.parse(existingBabyData);
      parsedBabyData.dateOfBirth = new Date(parsedBabyData.dateOfBirth);
      console.log('Setting existing baby data and going to dashboard');
      setBaby(parsedBabyData);
      setAppState('dashboard');
    } else {
      // No baby data, go to setup
      console.log('No baby data found, going to setup');
      setAppState('setup');
    }
    setIsInitialized(true);
  };

  const handleSetupComplete = (babyData: Baby) => {
    console.log('Setup complete, setting baby and going to dashboard');
    setBaby(babyData);
    setAppState('dashboard');
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
    console.log('=== RENDER SCREEN DEBUG ===');
    console.log('App State:', appState);
    console.log('User exists:', !!user);
    console.log('User value:', user);
    console.log('Baby exists:', !!baby);
    console.log('Baby value:', baby);
    console.log('=== END RENDER DEBUG ===');
    
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
          <DashboardScreen 
            user={user} 
            baby={baby} 
            onSignOut={handleSignOut}
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

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {renderScreen()}
    </View>
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
});
