import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { ClayButton } from '../components/ClayButton';
import { FeedingLog, DiaperLog, NapLog } from '../types';

interface AddLogScreenProps {
  user: any;
  baby: any;
  onBack: () => void;
}

export const AddLogScreen: React.FC<AddLogScreenProps> = ({ user, baby, onBack }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing, shadows } = theme;

  // Common states
  const [logType, setLogType] = useState<'feeding' | 'diaper' | 'nap'>('feeding');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');

  // Feeding states
  const [feedType, setFeedType] = useState<'breast' | 'formula' | 'solid'>('breast');
  const [breastSide, setBreastSide] = useState<'left' | 'right'>('left');
  const [duration, setDuration] = useState('');
  const [formulaAmount, setFormulaAmount] = useState('');

  // Diaper states
  const [diaperType, setDiaperType] = useState<'pee' | 'poop' | 'both'>('pee');

  // Nap states
  const [napDuration, setNapDuration] = useState('');

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastOpacity = useState(new Animated.Value(0))[0];

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setToastVisible(false));
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const onTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(time.getHours());
      newDateTime.setMinutes(time.getMinutes());
      setSelectedDate(newDateTime);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleSaveLog = async () => {
    try {
      if (logType === 'feeding') {
        await saveFeedingLog();
      } else if (logType === 'diaper') {
        await saveDiaperLog();
      } else if (logType === 'nap') {
        await saveNapLog();
      }
    } catch (error) {
      console.error('Error saving log:', error);
      showToast('Error saving log. Please try again.');
    }
  };

  const saveFeedingLog = async () => {
    const feedingData: FeedingLog = {
      id: `feeding_${Date.now()}`,
      type: feedType,
      duration: 0, // Default duration, will be updated below if provided
      timestamp: selectedDate.toISOString(),
      babyId: baby.id,
      userId: user.id,
      isManualEntry: true,
      notes: notes.trim() || undefined,
    };

    if (feedType === 'breast') {
      feedingData.side = breastSide;
      if (duration.trim()) {
        const durationInSeconds = parseInt(duration) * 60;
        if (!isNaN(durationInSeconds) && durationInSeconds > 0) {
          feedingData.duration = durationInSeconds;
        }
      }
    } else if (feedType === 'formula' && formulaAmount.trim()) {
      const amount = parseFloat(formulaAmount);
      if (!isNaN(amount) && amount > 0) {
        feedingData.formulaAmount = amount.toString();
      }
    }

    const existingFeedings = await AsyncStorage.getItem(`feedings_${user.id}`);
    const feedings = existingFeedings ? JSON.parse(existingFeedings) : [];
    feedings.unshift(feedingData);
    if (feedings.length > 100) feedings.splice(100);
    
    await AsyncStorage.setItem(`feedings_${user.id}`, JSON.stringify(feedings));
    
    const typeText = feedType === 'breast' ? `${breastSide} breast` : feedType;
    showToast(`${typeText} feeding logged successfully! 🍼`);
    
    setTimeout(() => onBack(), 2500);
  };

  const saveDiaperLog = async () => {
    const diaperData: DiaperLog = {
      id: `diaper_${Date.now()}`,
      type: diaperType,
      timestamp: selectedDate.toISOString(),
      babyId: baby.id,
      userId: user.id,
      notes: notes.trim() || undefined,
    };

    const existingDiapers = await AsyncStorage.getItem(`diapers_${user.id}`);
    const diapers = existingDiapers ? JSON.parse(existingDiapers) : [];
    diapers.unshift(diaperData);
    if (diapers.length > 100) diapers.splice(100);
    
    await AsyncStorage.setItem(`diapers_${user.id}`, JSON.stringify(diapers));
    
    const typeText = diaperType === 'both' ? 'Pee & Poop' : diaperType.charAt(0).toUpperCase() + diaperType.slice(1);
    showToast(`${typeText} diaper logged successfully! 💩`);
    
    setTimeout(() => onBack(), 2500);
  };

  const saveNapLog = async () => {
    if (!napDuration.trim()) {
      Alert.alert('Missing Duration', 'Please enter nap duration in minutes.');
      return;
    }

    const durationInMinutes = parseInt(napDuration);
    if (isNaN(durationInMinutes) || durationInMinutes <= 0) {
      Alert.alert('Invalid Duration', 'Please enter a valid duration in minutes.');
      return;
    }

    const durationInSeconds = durationInMinutes * 60;
    const endTime = new Date(selectedDate.getTime() + (durationInSeconds * 1000));

    const napData: NapLog = {
      id: `nap_${Date.now()}`,
      startTime: selectedDate.toISOString(),
      endTime: endTime.toISOString(),
      duration: durationInSeconds,
      timestamp: endTime.toISOString(),
      babyId: baby.id,
      userId: user.id,
      notes: notes.trim() || undefined,
    };

    const existingNaps = await AsyncStorage.getItem(`naps_${user.id}`);
    const naps = existingNaps ? JSON.parse(existingNaps) : [];
    naps.unshift(napData);
    if (naps.length > 100) naps.splice(100);
    
    await AsyncStorage.setItem(`naps_${user.id}`, JSON.stringify(naps));
    
    showToast(`${durationInMinutes}m nap logged successfully! 😴`);
    
    setTimeout(() => onBack(), 2500);
  };

  const componentStyles = {
    container: {
      flex: 1,
      backgroundColor: colors.backgroundStart,
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.cardBackground,
      ...shadows.soft,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.inputBackground,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    title: {
      ...typography.h2,
      color: colors.darkText,
      fontWeight: '600' as const,
    },
    placeholder: {
      width: 40,
    },
    scrollContent: {
      padding: spacing.lg,
    },
    section: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      ...shadows.soft,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.darkText,
      fontWeight: '600' as const,
      marginBottom: spacing.md,
    },
    logTypeSelector: {
      flexDirection: 'row' as const,
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    logTypeButton: {
      flex: 1,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: 12,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: colors.inputBackground,
    },
    logTypeButtonActive: {
      backgroundColor: colors.mintGreen,
      ...shadows.soft,
    },
    logTypeText: {
      ...typography.bodyMedium,
      color: colors.darkText,
      fontWeight: '500' as const,
    },
    logTypeTextActive: {
      color: colors.white,
      fontWeight: '600' as const,
    },
    dateTimeButton: {
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: spacing.sm,
      ...shadows.soft,
    },
    dateTimeText: {
      ...typography.body,
      color: colors.darkText,
      marginLeft: spacing.sm,
      fontWeight: '500' as const,
    },
    field: {
      marginBottom: spacing.md,
    },
    label: {
      ...typography.body,
      color: colors.darkText,
      fontWeight: '600' as const,
      marginBottom: spacing.sm,
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      ...typography.body,
      color: colors.darkText,
    },
    optionSelector: {
      flexDirection: 'row' as const,
      gap: spacing.sm,
      flexWrap: 'wrap' as const,
    },
    optionButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 8,
      backgroundColor: colors.inputBackground,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    optionButtonActive: {
      backgroundColor: colors.mintGreen,
      ...shadows.soft,
    },
    optionText: {
      ...typography.bodyMedium,
      color: colors.darkText,
    },
    optionTextActive: {
      color: colors.white,
      fontWeight: '600' as const,
    },
    saveButton: {
      marginTop: spacing.lg,
      marginBottom: spacing.xl,
    },
    toastContainer: {
      position: 'absolute' as const,
      top: 100,
      left: spacing.lg,
      right: spacing.lg,
      backgroundColor: colors.mintGreen,
      borderRadius: 12,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center' as const,
      ...shadows.premium,
      zIndex: 1000,
    },
    toastText: {
      ...typography.bodyMedium,
      color: colors.white,
      fontWeight: '600' as const,
      textAlign: 'center' as const,
    },
  };

  return (
    <View style={componentStyles.container}>
      {/* Header */}
      <View style={componentStyles.header}>
        <TouchableOpacity onPress={onBack} style={componentStyles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.darkText} />
        </TouchableOpacity>
        <Text style={componentStyles.title}>Add Log</Text>
        <View style={componentStyles.placeholder} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={componentStyles.scrollContent}>
        {/* Log Type Selection */}
        <View style={componentStyles.section}>
          <Text style={componentStyles.sectionTitle}>Log Type</Text>
          <View style={componentStyles.logTypeSelector}>
            <TouchableOpacity
              style={[
                componentStyles.logTypeButton,
                logType === 'feeding' && componentStyles.logTypeButtonActive,
              ]}
              onPress={() => setLogType('feeding')}
            >
              <Ionicons
                name="heart"
                size={20}
                color={logType === 'feeding' ? colors.white : colors.darkText}
              />
              <Text
                style={[
                  componentStyles.logTypeText,
                  logType === 'feeding' && componentStyles.logTypeTextActive,
                ]}
              >
                Feeding
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                componentStyles.logTypeButton,
                logType === 'diaper' && componentStyles.logTypeButtonActive,
              ]}
              onPress={() => setLogType('diaper')}
            >
              <Ionicons
                name="water"
                size={20}
                color={logType === 'diaper' ? colors.white : colors.darkText}
              />
              <Text
                style={[
                  componentStyles.logTypeText,
                  logType === 'diaper' && componentStyles.logTypeTextActive,
                ]}
              >
                Diaper
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                componentStyles.logTypeButton,
                logType === 'nap' && componentStyles.logTypeButtonActive,
              ]}
              onPress={() => setLogType('nap')}
            >
              <Ionicons
                name="moon"
                size={20}
                color={logType === 'nap' ? colors.white : colors.darkText}
              />
              <Text
                style={[
                  componentStyles.logTypeText,
                  logType === 'nap' && componentStyles.logTypeTextActive,
                ]}
              >
                Nap
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date & Time */}
        <View style={componentStyles.section}>
          <Text style={componentStyles.sectionTitle}>Date & Time</Text>
          
          <TouchableOpacity
            style={componentStyles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={20} color={colors.darkText} />
            <Text style={componentStyles.dateTimeText}>{formatDate(selectedDate)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={componentStyles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time" size={20} color={colors.darkText} />
            <Text style={componentStyles.dateTimeText}>{formatTime(selectedDate)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>

        {/* Feeding Fields */}
        {logType === 'feeding' && (
          <View style={componentStyles.section}>
            <Text style={componentStyles.sectionTitle}>Feeding Details</Text>
            
            <View style={componentStyles.field}>
              <Text style={componentStyles.label}>Feed Type</Text>
              <View style={componentStyles.optionSelector}>
                <TouchableOpacity
                  style={[
                    componentStyles.optionButton,
                    feedType === 'breast' && componentStyles.optionButtonActive,
                  ]}
                  onPress={() => setFeedType('breast')}
                >
                  <Text
                    style={[
                      componentStyles.optionText,
                      feedType === 'breast' && componentStyles.optionTextActive,
                    ]}
                  >
                    Breast
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    componentStyles.optionButton,
                    feedType === 'formula' && componentStyles.optionButtonActive,
                  ]}
                  onPress={() => setFeedType('formula')}
                >
                  <Text
                    style={[
                      componentStyles.optionText,
                      feedType === 'formula' && componentStyles.optionTextActive,
                    ]}
                  >
                    Formula
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    componentStyles.optionButton,
                    feedType === 'solid' && componentStyles.optionButtonActive,
                  ]}
                  onPress={() => setFeedType('solid')}
                >
                  <Text
                    style={[
                      componentStyles.optionText,
                      feedType === 'solid' && componentStyles.optionTextActive,
                    ]}
                  >
                    Solid
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {feedType === 'breast' && (
              <>
                <View style={componentStyles.field}>
                  <Text style={componentStyles.label}>Breast Side</Text>
                  <View style={componentStyles.optionSelector}>
                    <TouchableOpacity
                      style={[
                        componentStyles.optionButton,
                        breastSide === 'left' && componentStyles.optionButtonActive,
                      ]}
                      onPress={() => setBreastSide('left')}
                    >
                      <Text
                        style={[
                          componentStyles.optionText,
                          breastSide === 'left' && componentStyles.optionTextActive,
                        ]}
                      >
                        Left
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        componentStyles.optionButton,
                        breastSide === 'right' && componentStyles.optionButtonActive,
                      ]}
                      onPress={() => setBreastSide('right')}
                    >
                      <Text
                        style={[
                          componentStyles.optionText,
                          breastSide === 'right' && componentStyles.optionTextActive,
                        ]}
                      >
                        Right
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={componentStyles.field}>
                  <Text style={componentStyles.label}>Duration (minutes)</Text>
                  <TextInput
                    style={componentStyles.input}
                    value={duration}
                    onChangeText={setDuration}
                    placeholder="Enter duration in minutes"
                    placeholderTextColor={colors.lightText}
                    keyboardType="numeric"
                  />
                </View>
              </>
            )}

            {feedType === 'formula' && (
              <View style={componentStyles.field}>
                <Text style={componentStyles.label}>Amount (oz)</Text>
                <TextInput
                  style={componentStyles.input}
                  value={formulaAmount}
                  onChangeText={setFormulaAmount}
                  placeholder="Enter amount in oz"
                  placeholderTextColor={colors.lightText}
                  keyboardType="decimal-pad"
                />
              </View>
            )}
          </View>
        )}

        {/* Diaper Fields */}
        {logType === 'diaper' && (
          <View style={componentStyles.section}>
            <Text style={componentStyles.sectionTitle}>Diaper Details</Text>
            
            <View style={componentStyles.field}>
              <Text style={componentStyles.label}>Diaper Type</Text>
              <View style={componentStyles.optionSelector}>
                <TouchableOpacity
                  style={[
                    componentStyles.optionButton,
                    diaperType === 'pee' && componentStyles.optionButtonActive,
                  ]}
                  onPress={() => setDiaperType('pee')}
                >
                  <Text
                    style={[
                      componentStyles.optionText,
                      diaperType === 'pee' && componentStyles.optionTextActive,
                    ]}
                  >
                    Pee
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    componentStyles.optionButton,
                    diaperType === 'poop' && componentStyles.optionButtonActive,
                  ]}
                  onPress={() => setDiaperType('poop')}
                >
                  <Text
                    style={[
                      componentStyles.optionText,
                      diaperType === 'poop' && componentStyles.optionTextActive,
                    ]}
                  >
                    Poop
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    componentStyles.optionButton,
                    diaperType === 'both' && componentStyles.optionButtonActive,
                  ]}
                  onPress={() => setDiaperType('both')}
                >
                  <Text
                    style={[
                      componentStyles.optionText,
                      diaperType === 'both' && componentStyles.optionTextActive,
                    ]}
                  >
                    Both
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Nap Fields */}
        {logType === 'nap' && (
          <View style={componentStyles.section}>
            <Text style={componentStyles.sectionTitle}>Nap Details</Text>
            
            <View style={componentStyles.field}>
              <Text style={componentStyles.label}>Duration (minutes)</Text>
              <TextInput
                style={componentStyles.input}
                value={napDuration}
                onChangeText={setNapDuration}
                placeholder="Enter nap duration in minutes"
                placeholderTextColor={colors.lightText}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        {/* Notes */}
        <View style={componentStyles.section}>
          <Text style={componentStyles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={[componentStyles.input, { minHeight: 80, textAlignVertical: 'top' }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes..."
            placeholderTextColor={colors.lightText}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Save Button */}
        <ClayButton
          title="Save Log"
          onPress={handleSaveLog}
          style={componentStyles.saveButton}
        />
      </ScrollView>

      {/* Toast Notification */}
      {toastVisible && (
        <Animated.View style={[componentStyles.toastContainer, { opacity: toastOpacity }]}>
          <Text style={componentStyles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
    </View>
  );
}; 