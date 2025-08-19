import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, shadows, clayStyles } from '../styles/theme';
import { User, Baby } from '../types';

const { width } = Dimensions.get('window');

interface FeedingScreenProps {
  user: User;
  baby: Baby;
  onBack: () => void;
}

export const FeedingScreen: React.FC<FeedingScreenProps> = ({
  user,
  baby,
  onBack,
}) => {
  const [formulaAmount, setFormulaAmount] = useState('');
  const [breastDuration, setBreastDuration] = useState('');
  const [selectedFeedType, setSelectedFeedType] = useState<'breast' | 'formula' | 'solid'>('breast');
  const [selectedBreastSide, setSelectedBreastSide] = useState<'left' | 'right' | 'both'>('left');
  const [feedTime, setFeedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastOpacity = useState(new Animated.Value(0))[0];

  // Mock last feed data - in real app, this would come from storage
  const lastFeed = {
    time: '2 hours ago',
    type: 'Breast (Left)',
    duration: '15 minutes',
    amount: null,
  };

  const handleSaveFeeding = async () => {
    try {
      // Calculate duration for breast feeding (convert minutes to seconds)
      const duration = selectedFeedType === 'breast' && breastDuration 
        ? parseInt(breastDuration) * 60 
        : 0;

      const feedingData = {
        id: `feeding_${Date.now()}`,
        type: selectedFeedType,
        side: selectedFeedType === 'breast' ? selectedBreastSide : null,
        formulaAmount: selectedFeedType === 'formula' ? formulaAmount : null,
        duration: duration,
        timestamp: feedTime.toISOString(),
        babyId: baby.id,
        userId: user.id,
        notes: notes || null,
        isManualEntry: true,
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
      
      // Show success toast
      showToast('Feed successfully added!');
      
      // Wait a bit for toast to show, then go back
      setTimeout(() => {
        onBack();
      }, 1000);
      
    } catch (error) {
      console.error('Error saving feeding:', error);
      showToast('Error saving feed');
    }
  };

  const feedTypeOptions = [
    { id: 'breast', label: 'Breast', icon: 'heart' },
    { id: 'formula', label: 'Formula', icon: 'nutrition' },
    { id: 'solid', label: 'Solid', icon: 'restaurant' },
  ];

  const breastSideOptions = [
    { id: 'left', label: 'Left Breast', icon: 'chevron-back' },
    { id: 'right', label: 'Right Breast', icon: 'chevron-forward' },
    { id: 'both', label: 'Both Sides', icon: 'swap-horizontal' },
  ];

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFeedTime(selectedTime);
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={[colors.backgroundStart, colors.backgroundEnd]}
        style={styles.background}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={colors.darkText} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Feeding Details</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Last Feed Info */}
          <View style={styles.lastFeedSection}>
            <Text style={styles.sectionTitle}>Last Feed</Text>
            <View style={styles.lastFeedCard}>
              <View style={styles.lastFeedHeader}>
                <Ionicons name="time" size={20} color={colors.darkText} />
                <Text style={styles.lastFeedTime}>{lastFeed.time}</Text>
              </View>
              <View style={styles.lastFeedDetails}>
                <View style={styles.lastFeedItem}>
                  <Text style={styles.lastFeedLabel}>Type</Text>
                  <Text style={styles.lastFeedValue}>{lastFeed.type}</Text>
                </View>
                <View style={styles.lastFeedItem}>
                  <Text style={styles.lastFeedLabel}>Duration</Text>
                  <Text style={styles.lastFeedValue}>{lastFeed.duration}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Feed Type Selection */}
          <View style={styles.feedTypeSection}>
            <Text style={styles.sectionTitle}>Log New Feed</Text>
            <View style={styles.feedTypeGrid}>
              {feedTypeOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.feedTypeCard,
                    selectedFeedType === option.id && styles.feedTypeCardActive
                  ]}
                  onPress={() => setSelectedFeedType(option.id as any)}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.feedTypeIcon,
                    selectedFeedType === option.id && styles.feedTypeIconActive
                  ]}>
                    <Ionicons 
                      name={option.icon as any} 
                      size={24} 
                      color={selectedFeedType === option.id ? colors.white : colors.darkText} 
                    />
                  </View>
                  <Text style={[
                    styles.feedTypeLabel,
                    selectedFeedType === option.id && styles.feedTypeLabelActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Selection */}
          <View style={styles.timeSection}>
            <Text style={styles.sectionTitle}>Feed Time</Text>
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time" size={20} color={colors.darkText} />
              <Text style={styles.timeButtonText}>
                {feedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.lightText} />
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={feedTime}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}
          </View>

          {/* Breast Side Selection */}
          {selectedFeedType === 'breast' && (
            <>
              <View style={styles.breastSideSection}>
                <Text style={styles.sectionTitle}>Breast Side</Text>
                <View style={styles.breastSideGrid}>
                  {breastSideOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.breastSideCard,
                        selectedBreastSide === option.id && styles.breastSideCardActive
                      ]}
                      onPress={() => setSelectedBreastSide(option.id as any)}
                      activeOpacity={0.8}
                    >
                      <Ionicons 
                        name={option.icon as any} 
                        size={20} 
                        color={selectedBreastSide === option.id ? colors.white : colors.darkText} 
                      />
                      <Text style={[
                        styles.breastSideLabel,
                        selectedBreastSide === option.id && styles.breastSideLabelActive
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Duration Input for Breastfeeding */}
              <View style={styles.durationSection}>
                <Text style={styles.sectionTitle}>Duration (Minutes)</Text>
                <View style={styles.durationInputContainer}>
                  <TextInput
                    style={styles.durationInput}
                    value={breastDuration}
                    onChangeText={setBreastDuration}
                    placeholder="Enter minutes (e.g., 15)"
                    placeholderTextColor={colors.lightText}
                    keyboardType="numeric"
                  />
                  <Text style={styles.durationUnit}>min</Text>
                </View>
              </View>
            </>
          )}

          {/* Formula Amount Input */}
          {selectedFeedType === 'formula' && (
            <View style={styles.formulaSection}>
              <Text style={styles.sectionTitle}>Formula Amount</Text>
              <View style={styles.formulaInputContainer}>
                <TextInput
                  style={styles.formulaInput}
                  value={formulaAmount}
                  onChangeText={setFormulaAmount}
                  placeholder="Enter amount (ml/oz)"
                  placeholderTextColor={colors.lightText}
                  keyboardType="numeric"
                />
                <View style={styles.formulaUnits}>
                  <TouchableOpacity style={styles.unitButton}>
                    <Text style={styles.unitText}>ml</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.unitButton}>
                    <Text style={styles.unitText}>oz</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Notes Section */}
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes about this feeding..."
              placeholderTextColor={colors.lightText}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveFeeding}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark" size={20} color={colors.white} />
            <Text style={styles.saveButtonText}>Save Feeding</Text>
          </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
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
  placeholder: {
    width: 44,
  },
  
  // Last Feed Section
  lastFeedSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.darkText,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  lastFeedCard: {
    ...clayStyles.cardPremium,
    padding: spacing.lg,
  },
  lastFeedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  lastFeedTime: {
    ...typography.bodyLarge,
    color: colors.darkText,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  lastFeedDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  lastFeedItem: {
    alignItems: 'center',
    flex: 1,
  },
  lastFeedLabel: {
    ...typography.caption,
    color: colors.lightText,
    marginBottom: spacing.xs,
  },
  lastFeedValue: {
    ...typography.bodyMedium,
    color: colors.darkText,
    fontWeight: '600',
  },
  
  // Feed Type Section
  feedTypeSection: {
    marginBottom: spacing.xl,
  },
  feedTypeGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  feedTypeCard: {
    ...clayStyles.cardPremium,
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xs,
    minHeight: 120,
  },
  feedTypeCardActive: {
    backgroundColor: colors.mintGreen,
    ...shadows.medium,
  },
  feedTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  feedTypeIconActive: {
    backgroundColor: colors.mintGreen,
  },
  feedTypeLabel: {
    ...typography.bodyMedium,
    color: colors.darkText,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
  },
  feedTypeLabelActive: {
    color: colors.white,
  },
  
  // Formula Section
  formulaSection: {
    marginBottom: spacing.xl,
  },
  formulaInputContainer: {
    ...clayStyles.cardPremium,
    padding: spacing.lg,
  },
  formulaInput: {
    ...typography.bodyLarge,
    color: colors.darkText,
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  formulaUnits: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  unitButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
  },
  unitText: {
    ...typography.bodyMedium,
    color: colors.darkText,
    fontWeight: '600',
  },
  
  // Notes Section
  notesSection: {
    marginBottom: spacing.xl,
  },
  notesInput: {
    ...clayStyles.cardPremium,
    ...typography.body,
    color: colors.darkText,
    padding: spacing.lg,
    minHeight: 100,
  },
  
  // Time Section
  timeSection: {
    marginBottom: spacing.xl,
  },
  timeButton: {
    ...clayStyles.cardPremium,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  timeButtonText: {
    ...typography.bodyLarge,
    color: colors.darkText,
    fontWeight: '600',
    flex: 1,
  },
  
  // Breast Side Section
  breastSideSection: {
    marginBottom: spacing.xl,
  },
  breastSideGrid: {
    gap: spacing.sm,
  },
  breastSideCard: {
    ...clayStyles.cardPremium,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  breastSideCardActive: {
    backgroundColor: colors.mintGreen,
    ...shadows.medium,
  },
  breastSideLabel: {
    ...typography.bodyMedium,
    color: colors.darkText,
    fontWeight: '600',
  },
  breastSideLabelActive: {
    color: colors.white,
  },
  
  // Duration Section
  durationSection: {
    marginBottom: spacing.xl,
  },
  durationInputContainer: {
    ...clayStyles.cardPremium,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  durationInput: {
    ...typography.bodyLarge,
    color: colors.darkText,
    flex: 1,
  },
  durationUnit: {
    ...typography.bodyMedium,
    color: colors.lightText,
    fontWeight: '600',
  },
  
  // Save Button
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mintGreen,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.sm,
    ...shadows.medium,
  },
  saveButtonText: {
    ...typography.bodyLarge,
    color: colors.white,
    fontWeight: '600',
  },
  
  // Toast Notification
  toastContainer: {
    position: 'absolute',
    top: 100,
    left: spacing.lg,
    right: spacing.lg,
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mintGreen,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 25,
    gap: spacing.sm,
    ...shadows.medium,
  },
  toastText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: '600',
  },
}); 