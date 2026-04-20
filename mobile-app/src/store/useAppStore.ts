/**
 * Sanyog Conformity – Global State Management (Zustand)
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  // News
  news: any[];
  loadNews: () => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  // Offline Request Queue
  offlineQueue: any[];
  queueOfflineRequest: (req: any) => void;
  syncOfflineQueue: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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
        const fallbacks = [palette.gradientGreen, palette.gradientPurple, palette.gradientEmerald, palette.gradientGold];
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
      console.warn("Failed to load live catalog, using offline fallback", e);
      
      // OFFLINE FALLBACK using full dataset
      const { SERVICE_CATALOG } = require('../data/serviceCatalog');
      const fallbackGroups = SERVICE_CATALOG.map((group: any) => ({
        groupName: group.name,
        services: group.services.map((s: any, idx: any) => ({
          _id: `${group.name}-${idx}`,
          name: s.name,
          category: group.name,
          slug: s.slug
        }))
      }));

      const mappedCategories = fallbackGroups.map((g: any, index: number) => {
        const fallbacks = [palette.gradientGreen, palette.gradientPurple, palette.gradientEmerald, palette.gradientGold];
        return {
          id: g.groupName.toLowerCase().replace(/\s+/g, '-'),
          name: g.groupName,
          icon: 'shield-checkmark',
          description: `Regulatory and compliance services for ${g.groupName}`,
          serviceCount: g.services.length,
          gradient: fallbacks[index % fallbacks.length],
        };
      });

      const flatServices = fallbackGroups.flatMap((g: any) => g.services);
      const mappedCerts = flatServices.map((s: any) => ({
        id: s._id,
        name: s.name,
        slug: s.slug || s.name.toLowerCase().replace(/\s+/g, '-'),
        categoryId: s.category.toLowerCase().replace(/\s+/g, '-'),
        categoryName: s.category,
        shortDescription: `${s.name} compliance and certification services.`,
        fullDescription: `${s.name} ensures that your products or services conform to mandatory regulatory and quality standards.`,
        processDuration: '15-45 days',
        requiredDocuments: ['Business Registration', 'Identity Proof', 'Technical Specifications'],
        processSteps: ['Application Submission', 'Document Review', 'Assessment / Testing', 'Certification Granted'],
        isFeatured: true,
        isPopular: true,
        tags: [s.category, 'Certification'],
      }));

      set({ categories: mappedCategories, certifications: mappedCerts });
    }
  },

  // Applications
  applications: [],
  loadApplications: async () => {
    try {
      const res = await api.get('/applications/my');
      const apiApps = res.data.map((a: any) => {
        let history = a.statusHistory || [];
        let clientTasks: any[] = [];
        
        if (history.length === 0) {
          const d = new Date(a.createdAt);
          const service = (a.serviceName || '').toUpperCase();
          history.push({ status: 'draft', note: 'Project Initiated. Sanyog compliance expert assigned.', date: new Date(d.getTime() - 86400000).toISOString() });

          if (service.includes('BIS') || service.includes('CRS')) {
            history.push({ status: 'documents_required', note: 'Technical File Preparation (Brand Reg, BOM, Schematics).', date: d.toISOString() });
            history.push({ status: 'testing', note: 'Electronic Samples deposited to BIS/NABL Accredited Lab.', date: new Date(d.getTime() + 172800000).toISOString() });
            history.push({ status: 'under_review', note: 'Test Reports (TR) issued. Submitting via Manakonline.', date: new Date(d.getTime() + 500000000).toISOString() });
            clientTasks = [{ id: '1', task: 'Sign Authorized Indian Representative (AIR) Form', pending: true }, { id: '2', task: 'Ship 3 Units for Lab Testing', pending: true }];
          } 
          else if (service.includes('EPR')) {
            history.push({ status: 'documents_required', note: 'E-Waste/Plastic Waste Action Plan & KYC Collection.', date: d.toISOString() });
            history.push({ status: 'under_review', note: 'Filing on Central Pollution Control Board (CPCB) portal.', date: new Date(d.getTime() + 200000000).toISOString() });
            clientTasks = [{ id: '1', task: 'Upload GST & Pan Details', pending: false }, { id: '2', task: 'Provide previous year import/sales data sheet', pending: true }];
          }
          else if (service.includes('WPC')) {
            history.push({ status: 'documents_required', note: 'Evaluating foreign RF/Radio Test Reports.', date: d.toISOString() });
            history.push({ status: 'under_review', note: 'ETA Application submitted on Saralsanchar portal.', date: new Date(d.getTime() + 200000000).toISOString() });
            clientTasks = [{ id: '1', task: 'Upload Foreign Radio Test Report (CE/FCC)', pending: true }];
          }
          else if (service.includes('ISI')) {
            history.push({ status: 'documents_required', note: 'Application filed. Awaiting Factory Audit Inspector assignment.', date: d.toISOString() });
            history.push({ status: 'testing', note: 'Factory Audit completed. Samples drawn for independent testing.', date: new Date(d.getTime() + 800000000).toISOString() });
            clientTasks = [{ id: '1', task: 'Factory Calibration Certificates', pending: true }, { id: '2', task: 'Book travel tickets for BIS Auditor', pending: true }];
          }
          else {
            history.push({ status: 'submitted', note: `Application & Technical Dossier submitted to regulatory body for ${a.serviceName}.`, date: d.toISOString() });
            history.push({ status: 'under_review', note: 'Application under active officer scrutiny.', date: new Date(d.getTime() + 86400000).toISOString() });
            clientTasks = [{ id: '1', task: 'Review Draft Application', pending: false }];
          }

          if (a.status === 'approved') {
            history.push({ status: 'approved', note: 'Grant of License / Certificate successfully issued. Post-compliance tracker active.', date: new Date(d.getTime() + 1059200000).toISOString() });
            clientTasks.forEach(t => t.pending = false);
          }
        }
        
        const validUntil = new Date(a.createdAt);
        validUntil.setFullYear(validUntil.getFullYear() + (a.serviceName.includes('EPR') ? 1 : 2));
        
        return {
        id: a._id,
        certId: a.serviceName,
        certName: a.serviceName,
        categoryName: a.serviceGroup || 'General Compliance',
        companyName: a.companyName || '',
        applicantName: a.applicantName || '',
        email: a.email || '',
        status: a.status || 'submitted',
        statusHistory: history,
        clientTasks,
        validUntil: validUntil.toISOString(),
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
      }});
      set({ applications: apiApps });
    } catch (e) {
      console.warn("Failed to load live applications", e);
    }
  },
  addApplication: (app) =>
    set((state) => ({ applications: [app, ...state.applications] })),

  // News
  news: [],
  loadNews: async () => {
    try {
      const res = await api.get('/news');
      set({ news: res.data });
    } catch (e) {
      console.warn("Failed to load news", e);
    }
  },

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

  // Offline Queue Logic
  offlineQueue: [],
  queueOfflineRequest: (req) => set((state) => ({ 
    offlineQueue: [...(state.offlineQueue || []), req] 
  })),
  syncOfflineQueue: async () => {
    const queue = get().offlineQueue || [];
    if (!queue.length) return;
    
    set({ offlineQueue: [] }); // Clear preemptively to avoid infinite re-queues
    let failed: any[] = [];

    for (const req of queue) {
      try {
        await api.request({ url: req.url, method: req.method, data: req.data });
      } catch (err) {
        failed.push(req); // Re-queue if it still genuinely fails
      }
    }
    
    if (failed.length > 0) {
      set((state) => ({ offlineQueue: [...(state.offlineQueue || []), ...failed] }));
    }
  },
    }),
    {
      name: 'dice-mobile-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user,
        hasSeenOnboarding: state.hasSeenOnboarding,
        offlineQueue: state.offlineQueue,
      }),
    }
  )
);
