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

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check authentication status
      const isAuthenticated = await authService.isAuthenticated();
      
      if (!isAuthenticated) {
        setAppState('welcome');
        return;
      }

      // Get user data
      const userData = await authService.getCurrentUser();
      if (!userData) {
        setAppState('welcome');
        return;
      }
      
      setUser(userData);

      // Check if setup is complete
      const setupComplete = await AsyncStorage.getItem('setup_complete');
      if (setupComplete !== 'true') {
        setAppState('setup');
        return;
      }

      // Get baby data
      const babyData = await AsyncStorage.getItem('baby_data');
      if (babyData) {
        setBaby(JSON.parse(babyData));
      }

      setAppState('dashboard');
    } catch (error) {
      console.error('App initialization error:', error);
      setAppState('welcome');
    }
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setAppState('setup');
  };

  const handleSetupComplete = (babyData: Baby) => {
    setBaby(babyData);
    setAppState('dashboard');
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setBaby(null);
      setAppState('welcome');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderScreen = () => {
    switch (appState) {
      case 'loading':
        return (
          <View style={styles.loadingContainer}>
            {/* You can add a loading spinner here */}
          </View>
        );
      
      case 'welcome':
        return (
          <LoginScreen onAuthSuccess={handleAuthSuccess} />
        );
      
      case 'setup':
        return user ? (
          <BabySetupScreen 
            user={user} 
            onSetupComplete={handleSetupComplete} 
          />
        ) : (
          <LoginScreen onAuthSuccess={handleAuthSuccess} />
        );
      
      case 'dashboard':
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
