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
import { palette } from '../theme/colors';
import api from '../services/api';

interface AppState {
  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;

  // Auth
  isAuthenticated: boolean;
  token: string | null;
  setAuth: (token: string, user: UserProfile) => void;
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
  setAuth: (token, user) => set({ isAuthenticated: true, token, user }),
  clearAuth: () => set({ isAuthenticated: false, token: null, user: null }),

  // User
  user: null,
  setUser: (user) => set({ user }),

  // Categories & Certifications
  categories: [],
  certifications: [],
  loadCatalog: async () => {
    try {
      const res = await api.get('/catalog/services');
      const { groups, flatServices } = res.data;
      
      const mappedCategories = groups.map((g: any, index: number) => {
        const fallbacks = [palette.gradientBlue, palette.gradientPurple, palette.gradientEmerald, palette.gradientGold];
        return {
          id: g.groupName.toLowerCase().replace(/\s+/g, '-'),
          name: g.groupName,
          icon: 'shield-checkmark',
          description: `Regulatory and compliance services for ${g.groupName}`,
          serviceCount: g.services.length,
          gradient: fallbacks[index % fallbacks.length],
        };
      });

      const mappedCerts = flatServices.map((s: any) => ({
        id: s._id,
        name: s.name,
        slug: s.slug || s.name.toLowerCase().replace(/\s+/g, '-'),
        categoryId: s.category.toLowerCase().replace(/\s+/g, '-'),
        categoryName: s.category,
        shortDescription: s.description || `${s.name} compliance and certification services.`,
        fullDescription: s.description || `${s.name} ensures that your products or services conform to mandatory regulatory and quality standards.`,
        processDuration: '15-45 days',
        requiredDocuments: ['Business Registration', 'Identity Proof', 'Technical Specifications'],
        processSteps: ['Application Submission', 'Document Review', 'Assessment / Testing', 'Certification Granted'],
        isFeatured: true,
        isPopular: true,
        tags: [s.category, 'Certification'],
      }));

      set({ categories: mappedCategories, certifications: mappedCerts });
    } catch (e) {
      console.warn("Failed to load live catalog", e);
    }
  },

  // Applications
  applications: [],
  loadApplications: async () => {
    try {
      const res = await api.get('/applications/my');
      const apiApps = res.data.map((a: any) => ({
        id: a._id,
        certId: a.serviceName,
        certName: a.serviceName,
        categoryName: a.serviceGroup || 'General',
        companyName: a.companyName || '',
        applicantName: a.applicantName || '',
        email: a.email || '',
        status: a.status || 'submitted',
        statusHistory: [],
        documents: (a.documentIds || []).map((docId: string, idx: number) => ({
          id: docId,
          name: a.documents && a.documents[idx] ? 'Document' : `File-${idx}.pdf`,
          type: 'pdf',
          uploadedAt: a.createdAt,
          size: '1 MB'
        })),
        remarks: a.remarks || '',
        createdAt: a.createdAt,
        updatedAt: a.updatedAt
      }));
      set({ applications: apiApps });
    } catch (e) {
      console.warn("Failed to load live applications", e);
    }
  },
  addApplication: (app) =>
    set((state) => ({ applications: [app, ...state.applications] })),

  // Notifications (Keep local state for demo purposes as backend lacks dedicated notification schema currently)
  notifications: [],
  unreadCount: 0,
  loadNotifications: () => {
    // Left empty purposely as notifications will be live pulled when backend schema exists
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
