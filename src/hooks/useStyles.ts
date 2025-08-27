import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const useStyles = () => {
  const { theme } = useTheme();
  const { colors, typography, spacing, shadows, clayStyles } = theme;

  return StyleSheet.create({
    // Container styles
    container: {
      flex: 1,
    },
    background: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.lg,
      paddingBottom: 100, // Space for bottom navigation
    },
    
    // Header styles
    header: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
    },
    welcomeSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    welcomeText: {
      ...typography.h2,
      color: colors.darkText,
      flex: 1,
    },
    headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    themeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.gold,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      gap: spacing.xs,
      ...shadows.soft,
    },
    themeButtonText: {
      ...typography.caption,
      color: colors.white,
      fontWeight: '600',
    },
    signOutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.softRed,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      gap: spacing.xs,
      ...shadows.soft,
    },
    signOutText: {
      ...typography.caption,
      color: colors.white,
      fontWeight: '600',
    },
    
    // Debug section
    debugSection: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    debugButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: colors.inputBackground,
      borderRadius: 12,
    },
    debugText: {
      ...typography.caption,
      color: colors.lightText,
      fontSize: 10,
    },
    
    // Baby profile section
    babyProfileSection: {
      marginBottom: spacing.xl,
    },
    babyCard: {
      ...clayStyles.cardPremium,
    },
    babyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    babyIconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.blushPink + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    babyInfo: {
      flex: 1,
    },
    babyName: {
      ...typography.h2,
      color: colors.darkText,
      marginBottom: spacing.xs,
    },
    babyAge: {
      ...typography.body,
      color: colors.lightText,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statNumber: {
      ...typography.h2,
      color: colors.darkText,
      fontWeight: '300',
      marginBottom: spacing.xs,
    },
    statLabel: {
      ...typography.caption,
      color: colors.lightText,
      lineHeight: 14,
    },
    statDivider: {
      width: 1,
      height: 30,
      backgroundColor: colors.inputBackground,
      marginHorizontal: spacing.sm,
    },
    
    // Quick Feeding Section
    quickFeedingSection: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.h3,
      color: colors.darkText,
      fontWeight: '600',
      marginBottom: spacing.md,
    },
    feedingStatusCard: {
      ...clayStyles.cardPremium,
      marginTop: spacing.md,
      marginBottom: spacing.md,
      padding: spacing.lg,
    },
    feedingStatusCardLeftActive: {
      borderLeftWidth: 4,
      borderLeftColor: colors.softRed,
    },
    feedingStatusCardRightActive: {
      borderRightWidth: 4,
      borderRightColor: colors.softRed,
    },
    feedingStatusCardBothActive: {
      borderLeftWidth: 4,
      borderLeftColor: colors.softRed,
      borderRightWidth: 4,
      borderRightColor: colors.softRed,
    },
    feedingStatusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    feedingStatusLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    feedingStatusText: {
      ...typography.bodyMedium,
      color: colors.darkText,
      fontWeight: '600',
      marginLeft: spacing.sm,
    },
    feedingStatusButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    resetButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.inputBackground,
      borderRadius: 20,
      gap: spacing.xs,
    },
    detailsButtonText: {
      ...typography.caption,
      color: colors.darkText,
      fontWeight: '600',
    },
    timersRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    timerDisplay: {
      alignItems: 'center',
      flex: 1,
    },
    timerLabel: {
      ...typography.caption,
      color: colors.lightText,
      marginBottom: spacing.xs,
    },
    timerTime: {
      ...typography.displayLarge,
      color: colors.darkText,
      fontWeight: '300',
      fontSize: 24,
    },
    timerDivider: {
      width: 1,
      height: 40,
      backgroundColor: colors.inputBackground,
      marginHorizontal: spacing.md,
    },
    feedingButtonsRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.md,
    },
    feedingButton: {
      ...clayStyles.cardPremium,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
    },
    feedingButtonText: {
      ...typography.bodyMedium,
      color: colors.darkText,
      fontWeight: '600',
    },
    feedingButtonActive: {
      backgroundColor: colors.softRed,
      ...shadows.medium,
    },
    feedingButtonTextActive: {
      color: colors.white,
    },
    feedingHint: {
      ...typography.body,
      color: colors.lightText,
      textAlign: 'center',
      marginTop: spacing.sm,
      fontStyle: 'italic',
    },
    
    // Quick Diaper Section
    quickDiaperSection: {
      marginBottom: spacing.lg,
    },
    diaperButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.md,
      gap: spacing.md,
    },
    diaperButton: {
      ...clayStyles.cardPremium,
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.xl,
      borderRadius: 20,
    },
    diaperButtonText: {
      ...typography.bodyLarge,
      color: colors.white,
      fontWeight: '600',
      marginTop: spacing.sm,
    },
    viewLogsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.inputBackground,
      borderRadius: 20,
      marginTop: spacing.md,
      gap: spacing.xs,
    },
    viewLogsText: {
      ...typography.body,
      color: colors.darkText,
      fontWeight: '600',
    },
    
    // Quick Nap Section
    quickNapSection: {
      marginBottom: spacing.lg,
    },
    napTimerContainer: {
      ...clayStyles.cardPremium,
      alignItems: 'center',
      paddingVertical: spacing.xl,
      marginTop: spacing.md,
    },
    napTimer: {
      ...typography.displayLarge,
      color: colors.darkText,
      fontWeight: '300',
      marginBottom: spacing.md,
    },
    napButtonsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      marginTop: spacing.md,
    },
    napButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.inputBackground,
      borderRadius: 25,
      gap: spacing.sm,
    },
    napButtonActive: {
      backgroundColor: colors.lavender,
      ...shadows.medium,
    },
    napButtonText: {
      ...typography.bodyMedium,
      color: colors.darkText,
      fontWeight: '600',
    },
    napButtonTextActive: {
      color: colors.white,
    },
    resetNapButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    napHint: {
      ...typography.body,
      color: colors.lightText,
      textAlign: 'center',
      marginTop: spacing.sm,
      fontStyle: 'italic',
    },
    
    // Additional Features Section
    additionalFeaturesSection: {
      marginBottom: spacing.lg,
    },
    featuresRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    featureCard: {
      ...clayStyles.cardPremium,
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.lg,
    },
    featureIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    featureTitle: {
      ...typography.bodyMedium,
      color: colors.darkText,
      fontWeight: '600',
      textAlign: 'center',
    },
    
    // Actions Section
    actionsSection: {
      paddingVertical: spacing.lg,
    },
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    actionCard: {
      ...clayStyles.cardPremium,
      alignItems: 'center',
      marginBottom: spacing.md,
      position: 'relative',
      flex: 1,
      maxWidth: '48%',
    },
    actionIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    actionTitle: {
      ...typography.h3,
      color: colors.darkText,
      marginBottom: spacing.xs,
      textAlign: 'center',
    },
    actionSubtitle: {
      ...typography.caption,
      color: colors.lightText,
      textAlign: 'center',
    },
    comingSoonBadge: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
      backgroundColor: colors.gold,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: 8,
    },
    comingSoonText: {
      ...typography.caption,
      fontSize: 10,
      color: colors.white,
      fontWeight: '600',
    },
    primaryActionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    primaryActionCard: {
      flex: 1,
      ...clayStyles.cardPremium,
      alignItems: 'center',
      marginHorizontal: spacing.xs,
      paddingVertical: spacing.lg,
      position: 'relative',
    },
    primaryActionIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
      ...shadows.medium,
    },
    primaryActionTitle: {
      ...typography.h3,
      color: colors.darkText,
      textAlign: 'center',
      fontWeight: '600',
    },
    secondaryActionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    secondaryActionCard: {
      flex: 1,
      ...clayStyles.cardPremium,
      alignItems: 'center',
      marginHorizontal: spacing.xs,
      paddingVertical: spacing.md,
      position: 'relative',
    },
    secondaryActionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    secondaryActionTitle: {
      ...typography.bodyMedium,
      color: colors.darkText,
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: spacing.xs,
      lineHeight: 18,
    },
    secondaryActionSubtitle: {
      ...typography.caption,
      color: colors.lightText,
      textAlign: 'center',
      fontSize: 11,
      lineHeight: 14,
    },
    smallComingSoonBadge: {
      position: 'absolute',
      top: spacing.xs,
      right: spacing.xs,
      backgroundColor: colors.gold,
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 6,
    },
    smallComingSoonText: {
      ...typography.caption,
      fontSize: 9,
      color: colors.white,
      fontWeight: '600',
    },
    
    // Activity Section
    activitySection: {
      marginBottom: spacing.lg,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
      marginBottom: spacing.lg,
    },
    emptyIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.inputBackground,
      alignItems: 'center',
      justifyContent: 'center',
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
      textAlign: 'center',
      lineHeight: 24,
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
}; 