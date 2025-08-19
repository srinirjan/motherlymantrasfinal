import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, shadows, clayStyles } from '../styles/theme';

interface BottomNavigationProps {
  activeTab: 'home' | 'logs' | 'profile' | 'ai-analyzer';
  onTabPress: (tab: 'home' | 'logs' | 'profile' | 'ai-analyzer') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabPress,
}) => {
  const tabs = [
    {
      id: 'home' as const,
      label: 'Home',
      icon: 'home',
      activeIcon: 'home',
    },
    {
      id: 'logs' as const,
      label: 'Logs',
      icon: 'list-outline',
      activeIcon: 'list',
    },
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: 'person-outline',
      activeIcon: 'person',
    },
    {
      id: 'ai-analyzer' as const,
      label: 'AI Analyzer',
      icon: 'analytics-outline',
      activeIcon: 'analytics',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                isActive && styles.activeTab
              ]}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.tabIconContainer,
                isActive && styles.activeTabIconContainer
              ]}>
                <Ionicons
                  name={isActive ? tab.activeIcon as any : tab.icon as any}
                  size={isActive ? 24 : 20}
                  color={isActive ? colors.white : colors.lightText}
                />
              </View>
              <Text style={[
                styles.tabLabel,
                isActive && styles.activeTabLabel
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
    ...shadows.premium,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  activeTab: {
    // Active tab styling handled by icon container
  },
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  activeTabIconContainer: {
    backgroundColor: colors.mintGreen,
    ...shadows.medium,
  },
  tabLabel: {
    ...typography.caption,
    color: colors.lightText,
    fontSize: 10,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: colors.darkText,
    fontWeight: '600',
  },
}); 