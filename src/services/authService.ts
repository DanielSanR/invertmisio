import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'manager' | 'worker';
  organization?: string;
  phoneNumber?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: UserProfile | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Initialize auth state
  async initialize(): Promise<void> {
    try {
      // Check for stored auth data
      const storedUser = await AsyncStorage.getItem('@auth_user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Error initializing auth service:', error);
      throw error;
    }
  }

  // Register new user - accepts any credentials
  async register(
    email: string,
    password: string,
    profile: Partial<UserProfile>
  ): Promise<UserProfile> {
    try {
      // Generate a mock user ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create user profile
      const userProfile: UserProfile = {
        id: userId,
        email: email,
        displayName: profile.displayName || email.split('@')[0],
        role: profile.role || 'worker',
        organization: profile.organization,
        phoneNumber: profile.phoneNumber,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      // Store in AsyncStorage (simulating database)
      await AsyncStorage.setItem(`@user_profile_${userId}`, JSON.stringify(userProfile));

      this.currentUser = userProfile;
      await AsyncStorage.setItem('@auth_user', JSON.stringify(userProfile));

      return userProfile;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // Login user - accepts any email/password combination
  async login(email: string, password: string): Promise<UserProfile> {
    try {
      // Accept any email/password combination
      // Generate a consistent user ID based on email for demo purposes
      const userId = `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;

      // Check if user profile exists, if not create one
      let userProfile = await this.getUserProfile(userId);

      if (!userProfile) {
        // Create a new profile for this email
        userProfile = {
          id: userId,
          email: email,
          displayName: email.split('@')[0],
          role: 'worker', // Default role
          organization: 'Demo Organization',
          phoneNumber: '',
          createdAt: new Date(),
          lastLoginAt: new Date(),
        };

        // Store the profile
        await AsyncStorage.setItem(`@user_profile_${userId}`, JSON.stringify(userProfile));
      } else {
        // Update last login
        userProfile.lastLoginAt = new Date();
        await AsyncStorage.setItem(`@user_profile_${userId}`, JSON.stringify(userProfile));
      }

      this.currentUser = userProfile;
      await AsyncStorage.setItem('@auth_user', JSON.stringify(userProfile));

      return userProfile;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      this.currentUser = null;
      await AsyncStorage.removeItem('@auth_user');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  // Reset password - mock implementation
  async resetPassword(email: string): Promise<void> {
    try {
      // Mock password reset - just log it
      console.log(`Password reset requested for: ${email}`);
      // In a real app, this would send an email
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      if (!this.currentUser) {
        throw new Error('No authenticated user');
      }

      // Update the profile
      const updatedProfile = {
        ...this.currentUser,
        ...updates,
      };

      // Store updated profile
      await AsyncStorage.setItem(`@user_profile_${this.currentUser.id}`, JSON.stringify(updatedProfile));

      this.currentUser = updatedProfile;
      await AsyncStorage.setItem('@auth_user', JSON.stringify(updatedProfile));

      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Get user profile from storage
  private async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const storedProfile = await AsyncStorage.getItem(`@user_profile_${userId}`);
      if (!storedProfile) {
        return null;
      }
      return JSON.parse(storedProfile);
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Get current user
  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  // Check if user has specific role
  hasRole(role: UserProfile['role']): boolean {
    return this.currentUser?.role === role;
  }
}

export const authService = AuthService.getInstance();
export default authService;
