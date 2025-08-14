import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

export class AuthService {
  private static instance: AuthService;
  
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private constructor() {}

  async signInWithEmail(email: string, name?: string): Promise<User | null> {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Check if user exists
      let user = await this.getUserByEmail(email);
      
      if (!user) {
        // Create new user if doesn't exist
        user = {
          id: `user_${Date.now()}`,
          email: email.toLowerCase().trim(),
          name: name || email.split('@')[0], // Use email prefix as default name
        };
        
        // Store new user
        await this.storeUser(user);
      }

      // Store current session
      await this.storeUserData(user);
      await AsyncStorage.setItem('auth_token', `token_${user.id}_${Date.now()}`);
      
      return user;
    } catch (error) {
      console.error('Email Sign-In Error:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      users[userIndex] = { ...users[userIndex], ...updates };
      await AsyncStorage.setItem('all_users', JSON.stringify(users));
      
      // Update current session
      await this.storeUserData(users[userIndex]);
      
      return users[userIndex];
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error('Failed to update profile');
    }
  }

  async signOut(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['user_data', 'auth_token']);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      const authToken = await AsyncStorage.getItem('auth_token');
      return !!(user && authToken);
    } catch (error) {
      return false;
    }
  }

  private async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
    } catch (error) {
      return null;
    }
  }

  private async getAllUsers(): Promise<User[]> {
    try {
      const usersData = await AsyncStorage.getItem('all_users');
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      return [];
    }
  }

  private async storeUser(user: User): Promise<void> {
    try {
      const users = await this.getAllUsers();
      users.push(user);
      await AsyncStorage.setItem('all_users', JSON.stringify(users));
    } catch (error) {
      throw new Error('Failed to store user');
    }
  }

  private async storeUserData(user: User): Promise<void> {
    await AsyncStorage.setItem('user_data', JSON.stringify(user));
  }
}

export const authService = AuthService.getInstance(); 