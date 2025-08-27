import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

interface SwipeableLogItemProps {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  logType: string;
  logDetails: string;
}

export const SwipeableLogItem: React.FC<SwipeableLogItemProps> = ({
  children,
  onEdit,
  onDelete,
  logType,
  logDetails,
}) => {
  const { theme } = useTheme();
  const { colors, typography, spacing, shadows } = theme;
  
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderGrant: () => {
        translateX.setOffset((translateX as any)._value);
      },
      onPanResponderMove: (evt, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        translateX.flattenOffset();
        
        const { dx } = gestureState;
        
        if (dx > 100) {
          // Right swipe - Edit
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
          onEdit();
        } else if (dx < -100) {
          // Left swipe - Delete
          Alert.alert(
            'Delete Log',
            `Are you sure you want to delete this ${logType} log?\n\n${logDetails}`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                  Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: false,
                  }).start();
                },
              },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                  Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                  }).start(() => {
                    onDelete();
                  });
                },
              },
            ]
          );
        } else {
          // Snap back to center
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const styles = {
    container: {
      marginBottom: spacing.md,
    },
    swipeContainer: {
      position: 'relative' as const,
    },
    backgroundActions: {
      position: 'absolute' as const,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.inputBackground,
      borderRadius: 16,
    },
    editAction: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.babyBlue,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 12,
      gap: spacing.xs,
    },
    deleteAction: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.softRed,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 12,
      gap: spacing.xs,
    },
    actionText: {
      ...typography.caption,
      color: colors.white,
      fontWeight: '600' as const,
    },
    swipeableContent: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      ...shadows.soft,
    },
    swipeHint: {
      position: 'absolute' as const,
      top: -spacing.xs,
      right: spacing.sm,
      backgroundColor: colors.lightText,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: 8,
      opacity: 0.7,
    },
    swipeHintText: {
      ...typography.caption,
      fontSize: 10,
      color: colors.white,
    },
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.swipeContainer, { opacity }]}>
        {/* Background Actions */}
        <View style={styles.backgroundActions}>
          <View style={styles.editAction}>
            <Ionicons name="pencil" size={16} color={colors.white} />
            <Text style={styles.actionText}>Edit</Text>
          </View>
          <View style={styles.deleteAction}>
            <Ionicons name="trash" size={16} color={colors.white} />
            <Text style={styles.actionText}>Delete</Text>
          </View>
        </View>

        {/* Swipeable Content */}
        <Animated.View
          style={[
            styles.swipeableContent,
            {
              transform: [{ translateX }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {children}
          
          {/* Swipe Hint */}
          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>← → </Text>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}; 