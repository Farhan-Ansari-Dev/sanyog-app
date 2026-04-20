/**
 * Sanyog Conformity – Comprehensive Type Definitions
 */

// ─── Navigation ───────────────────────────────────────────
export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  OTP: { email: string };
};

export type HomeStackParamList = {
  HomeMain: undefined;
  CertDetail: { certId: string };
};

export type ServicesStackParamList = {
  ServicesList: undefined;
  ServiceGroup: { categoryId: string; categoryName: string };
  CertDetail: { certId: string };
  ApplyStep1: { certId: string; certName: string };
  ApplyStep2: { certId: string; certName: string; formData: ApplicationFormData };
  ApplyStep3: { certId: string; certName: string; formData: ApplicationFormData };
};

export type ApplicationsStackParamList = {
  AppsList: undefined;
  AppDetail: { appId: string };
  UploadDocs: { appId: string };
};

export type NotificationsStackParamList = {
  NotifList: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  About: undefined;
  ContactExpert: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  ServicesTab: undefined;
  ApplicationsTab: undefined;
  NotificationsTab: undefined;
  ProfileTab: undefined;
};

// ─── Data Models ──────────────────────────────────────────
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  serviceCount: number;
  gradient: [string, string];
}

export interface Certification {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  fullDescription: string;
  processDuration: string;
  requiredDocuments: string[];
  processSteps: string[];
  isFeatured: boolean;
  isPopular: boolean;
  tags: string[];
}

export interface ApplicationFormData {
  companyName: string;
  applicantName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  gstNumber: string;
  productDescription: string;
  additionalNotes: string;
}

export interface Application {
  id: string;
  certId: string;
  certName: string;
  categoryName: string;
  companyName: string;
  applicantName: string;
  email: string;
  status: ApplicationStatus;
  statusHistory: StatusHistoryEntry[];
  clientTasks?: { id: string; task: string; pending: boolean }[];
  validUntil?: string;
  documents: DocumentEntry[];
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'testing'
  | 'documents_required'
  | 'approved'
  | 'rejected';

export interface StatusHistoryEntry {
  status: ApplicationStatus;
  date: string;
  note: string;
}

export interface DocumentEntry {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  appId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  avatar?: string;
}

// ─── API Response Types ───────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
