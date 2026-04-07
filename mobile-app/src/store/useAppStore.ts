/**
 * Sanyog Conformity – Global State Management (Zustand)
 */
import { create } from 'zustand';
import type { ThemeMode } from '../theme';
import type {
  Application,
  Notification,
  UserProfile,
  Certification,
  ServiceCategory,
} from '../types';
import {
  mockApplications,
  mockNotifications,
  mockUser,
  mockCertifications,
  mockCategories,
} from '../services/mockData';

interface AppState {
  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;

  // Auth
  isAuthenticated: boolean;
  token: string | null;
  setAuth: (token: string) => void;
  clearAuth: () => void;

  // User
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;

  // Categories & Certifications
  categories: ServiceCategory[];
  certifications: Certification[];
  loadCatalog: () => void;

  // Applications
  applications: Application[];
  loadApplications: () => void;
  addApplication: (app: Application) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  loadNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;

  // Onboarding
  hasSeenOnboarding: boolean;
  setOnboardingSeen: () => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Theme
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  // Auth
  isAuthenticated: false,
  token: null,
  setAuth: (token) => set({ isAuthenticated: true, token, user: mockUser }),
  clearAuth: () => set({ isAuthenticated: false, token: null, user: null }),

  // User
  user: null,
  setUser: (user) => set({ user }),

  // Categories & Certifications
  categories: [],
  certifications: [],
  loadCatalog: () => {
    // Simulate API call with mock data
    set({ categories: mockCategories, certifications: mockCertifications });
  },

  // Applications
  applications: [],
  loadApplications: () => {
    // Simulate API call
    set({ applications: mockApplications });
  },
  addApplication: (app) =>
    set((state) => ({ applications: [app, ...state.applications] })),

  // Notifications
  notifications: [],
  unreadCount: 0,
  loadNotifications: () => {
    const notifs = mockNotifications;
    set({
      notifications: notifs,
      unreadCount: notifs.filter((n) => !n.read).length,
    });
  },
  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  // Onboarding
  hasSeenOnboarding: false,
  setOnboardingSeen: () => set({ hasSeenOnboarding: true }),

  // Loading
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
