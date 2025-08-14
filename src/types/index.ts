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