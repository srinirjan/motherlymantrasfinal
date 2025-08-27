export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
}

export interface Baby {
  id: string;
  name: string;
  dateOfBirth: Date;
  photoUrl?: string;
  userId: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export interface SetupState {
  isSetupComplete: boolean;
  baby: Baby | null;
}

export interface FeedingLog {
  id: string;
  type: 'breast' | 'formula' | 'solid';
  side?: 'left' | 'right';
  duration: number; // in seconds
  formulaAmount?: string;
  timestamp: string;
  babyId: string;
  userId: string;
  notes?: string;
  isManualEntry?: boolean;
}

export interface DiaperLog {
  id: string;
  type: 'pee' | 'poop' | 'both';
  timestamp: string;
  babyId: string;
  userId: string;
  notes?: string;
}

export interface NapLog {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  timestamp: string; // when the nap ended
  babyId: string;
  userId: string;
  notes?: string;
} 