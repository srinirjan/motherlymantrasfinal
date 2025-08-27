import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { FeedingLog, DiaperLog, NapLog } from '../types';

type LogEntry = (FeedingLog & { logType: 'feeding' }) | (DiaperLog & { logType: 'diaper' }) | (NapLog & { logType: 'nap' });

interface EditLogModalProps {
  visible: boolean;
  log: LogEntry | null;
  onClose: () => void;
  onSave: (updatedLog: LogEntry) => void;
}

export const EditLogModal: React.FC<EditLogModalProps> = ({
  visible,
  log,
  onClose,
  onSave,
}) => {
  const { theme } = useTheme();
  const { colors, typography, spacing, shadows, clayStyles } = theme;
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [duration, setDuration] = useState('');
  const [formulaAmount, setFormulaAmount] = useState('');

  // Reset the selected date and feeding-specific values when log changes or modal opens
  React.useEffect(() => {
    if (log && visible) {
      // Set the date from the log when modal opens
      setSelectedDate(new Date(log.timestamp));
      if (log.logType === 'feeding') {
        const feedLog = log as FeedingLog & { logType: 'feeding' };
        if (feedLog.type === 'breast' && feedLog.duration) {
          setDuration(Math.floor(feedLog.duration / 60).toString()); // Convert seconds to minutes
        } else if (feedLog.type === 'formula' && feedLog.formulaAmount) {
          setFormulaAmount(feedLog.formulaAmount.toString());
        } else {
          setDuration('');
          setFormulaAmount('');
        }
      } else {
        setDuration('');
        setFormulaAmount('');
      }
    } else if (!visible) {
      // Reset all values when modal closes
      setDuration('');
      setFormulaAmount('');
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
  }, [log, visible]);

  const handleSave = () => {
    if (!log) return;
    
    let updatedLog = {
      ...log,
      timestamp: selectedDate.toISOString(),
    };

    // Update feeding-specific fields
    if (log.logType === 'feeding') {
      const feedLog = log as FeedingLog & { logType: 'feeding' };
      if (feedLog.type === 'breast' && duration.trim()) {
        const durationInSeconds = parseInt(duration) * 60; // Convert minutes to seconds
        if (!isNaN(durationInSeconds) && durationInSeconds > 0) {
          updatedLog = { ...updatedLog, duration: durationInSeconds } as LogEntry;
        }
      } else if (feedLog.type === 'formula' && formulaAmount.trim()) {
        const amount = parseFloat(formulaAmount);
        if (!isNaN(amount) && amount > 0) {
          updatedLog = { ...updatedLog, formulaAmount: amount.toString() } as LogEntry;
        }
      }
    }
    
    onSave(updatedLog);
    onClose();
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

  const styles = {
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      paddingHorizontal: spacing.lg,
    },
    modal: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.lg,
      width: '100%' as const,
      maxWidth: 400,
      ...shadows.premium,
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.h2,
      color: colors.darkText,
      fontWeight: '600' as const,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.inputBackground,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    content: {
      marginBottom: spacing.lg,
    },
    logInfo: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: spacing.md,
      padding: spacing.md,
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
    },
    logType: {
      ...typography.bodyLarge,
      color: colors.darkText,
      fontWeight: '600' as const,
      marginLeft: spacing.sm,
      textTransform: 'capitalize' as const,
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
    input: {
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      ...typography.body,
      color: colors.darkText,
      marginBottom: spacing.sm,
    },
    inputLabel: {
      ...typography.body,
      color: colors.darkText,
      fontWeight: '600' as const,
      marginBottom: spacing.xs,
    },
    buttons: {
      flexDirection: 'row' as const,
      gap: spacing.md,
    },
    button: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: 12,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    cancelButton: {
      backgroundColor: colors.inputBackground,
    },
    saveButton: {
      backgroundColor: colors.mintGreen,
      ...shadows.soft,
    },
    buttonText: {
      ...typography.bodyMedium,
      fontWeight: '600' as const,
    },
    cancelButtonText: {
      color: colors.darkText,
    },
    saveButtonText: {
      color: colors.white,
    },
  };

  if (!log) return null;

  const getLogIcon = () => {
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
    } else if (log.logType === 'diaper') {
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
    } else {
      return { name: 'moon' as const, color: colors.lavender };
    }
  };

  const icon = getLogIcon();
  const logTypeText = log.logType === 'feeding' 
    ? (log as FeedingLog).type 
    : log.logType === 'diaper'
    ? (log as DiaperLog).type
    : 'nap';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Log</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={colors.darkText} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.logInfo}>
              <Ionicons name={icon.name} size={24} color={icon.color} />
              <Text style={styles.logType}>{logTypeText}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Date & Time</Text>
              
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={20} color={colors.darkText} />
                <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time" size={20} color={colors.darkText} />
                <Text style={styles.dateTimeText}>{formatTime(selectedDate)}</Text>
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

            {/* Feeding-specific fields */}
            {log?.logType === 'feeding' && (
              <>
                {(log as FeedingLog & { logType: 'feeding' }).type === 'breast' && (
                  <View style={styles.field}>
                    <Text style={styles.inputLabel}>Duration (minutes)</Text>
                    <TextInput
                      style={styles.input}
                      value={duration}
                      onChangeText={setDuration}
                      placeholder="Enter duration in minutes"
                      placeholderTextColor={colors.lightText}
                      keyboardType="numeric"
                    />
                  </View>
                )}
                
                {(log as FeedingLog & { logType: 'feeding' }).type === 'formula' && (
                  <View style={styles.field}>
                    <Text style={styles.inputLabel}>Amount (oz)</Text>
                    <TextInput
                      style={styles.input}
                      value={formulaAmount}
                      onChangeText={setFormulaAmount}
                      placeholder="Enter amount in oz"
                      placeholderTextColor={colors.lightText}
                      keyboardType="decimal-pad"
                    />
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 