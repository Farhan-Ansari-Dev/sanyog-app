const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'src', 'screens');

const modules = {
  auth: [
    'SplashScreen', 'OnboardingScreen1', 'OnboardingScreen2', 'OnboardingScreen3',
    'LoginScreen', 'SignupScreen', 'ContinueWithGoogleScreen', 'EmailOtpLoginScreen',
    'OtpVerificationScreen', 'ForgotPasswordScreen', 'ResetPasswordScreen',
    'UserTypeSelectionScreen', 'SessionExpiredScreen', 'NoInternetScreen',
    'MaintenanceScreen', 'ForceUpdateScreen'
  ],
  home: [
    'HomeDashboardScreen', 'ComplianceOverviewScreen', 'AIRecommendationsScreen',
    'QuickActionsScreen', 'NotificationsFeedScreen', 'RecentActivitiesScreen',
    'ShipmentOverviewScreen', 'RenewalAlertsScreen', 'CountryComplianceAlertsScreen',
    'ComplianceScoreScreen', 'AssignedManagerScreen'
  ],
  certifications: [
    'AllCertificationsScreen', 'DomesticCertificationsScreen', 'InternationalCertificationsScreen',
    'CertificationCategoriesScreen', 'CertificationDetailsScreen', 'CertificationComparisonScreen',
    'CertificationEligibilityCheckerScreen', 'CertificationFAQScreen', 'ApplyCertificationScreen',
    'CertificationTimelineScreen', 'CertificationProgressScreen', 'CertificationDocumentsScreen',
    'GovernmentQueriesScreen', 'RejectedCertificationsScreen', 'RenewalCenterScreen'
  ],
  applications: [
    'ApplicationsDashboardScreen', 'ActiveApplicationsScreen', 'PendingApplicationsScreen',
    'CompletedApplicationsScreen', 'RejectedApplicationsScreen', 'ApplicationDetailsScreen',
    'ApplicationTimelineScreen', 'UploadAdditionalDocumentsScreen', 'AppAssignedManagerScreen',
    'ApprovalWorkflowScreen', 'AppGovernmentQueriesScreen', 'ApplicationNotesScreen',
    'ApplicationHistoryScreen', 'RenewalApplicationsScreen', 'ApplicationSuccessScreen'
  ],
  insights: [
    'InsightsHomeScreen', 'LatestNewsFeedScreen', 'GovernmentUpdatesScreen',
    'CertificationNewsScreen', 'TradeExportNewsScreen', 'ImportExportAlertsScreen',
    'CountryRegulationUpdatesScreen', 'AIInsightFeedScreen', 'AISummarizedCircularsScreen',
    'ComplianceIntelligenceScreen', 'TrendingCertificationsScreen', 'SavedArticlesScreen',
    'ArticleDetailsScreen', 'VideoInsightsScreen', 'AIRecommendationsFeedScreen',
    'SearchInsightsScreen', 'FilterInsightsScreen', 'NotificationAlertsScreen',
    'BreakingComplianceAlertsScreen'
  ],
  profile: [
    'ProfileScreen', 'CompanyProfileScreen', 'UserTypeSettingsScreen', 'TeamMembersScreen',
    'RolesPermissionsScreen', 'NotificationSettingsScreen', 'SecuritySettingsScreen',
    'ChangePasswordScreen', 'DeviceSessionsScreen', 'LanguageSettingsScreen',
    'ThemeSettingsScreen', 'DarkModeScreen', 'PrivacyPolicyScreen', 'TermsConditionsScreen',
    'DeleteAccountScreen'
  ],
  documents: [
    'DocumentVaultScreen', 'UploadDocumentScreen', 'OCRScannerScreen', 'AIDocumentValidationScreen',
    'DocumentPreviewScreen', 'ProductDocumentsScreen', 'CompanyDocumentsScreen', 'ShipmentDocumentsScreen',
    'GovernmentDocumentsScreen', 'TestReportsScreen', 'CertificatesStorageScreen', 'RejectedDocumentsScreen',
    'ExpiryTrackerScreen', 'DownloadDocumentsScreen', 'SearchDocumentsScreen'
  ],
  shipment: [
    'ShipmentDashboardScreen', 'ShipmentTrackingScreen', 'ShipmentDetailsScreen', 'ContainerTrackingScreen',
    'CustomsClearanceScreen', 'PortClearanceScreen', 'CountryComplianceScreen', 'ImportRiskAnalysisScreen',
    'ExportReadinessScreen', 'CustomsDocumentationScreen', 'ShippingDocumentsScreen', 'ShipmentTimelineScreen',
    'ShipmentAnalyticsScreen', 'ShipmentAlertsScreen', 'ShipmentSuccessScreen'
  ],
  ai: [
    'AIAssistantHomeScreen', 'AIChatScreen', 'AIProductAnalyzerScreen', 'AICertificationFinderScreen',
    'AIComplianceCheckerScreen', 'AICountryComplianceScreen', 'AIShipmentRiskScreen', 'AIRiskPredictionScreen',
    'AIRegulationFeedScreen', 'AISuggestedCertificationsScreen'
  ],
  testing: [
    'TestingDashboardScreen', 'AssignedLabsScreen', 'SampleDispatchScreen', 'SampleTrackingScreen',
    'LabReportsScreen', 'TestDetailsScreen', 'FailedReportsScreen', 'RetestingRequestScreen',
    'InspectionBookingScreen', 'InspectionScheduleScreen', 'InspectionReportsScreen',
    'FactoryInspectionScreen', 'QualityInspectionScreen', 'InspectionDetailsScreen', 'InspectionSuccessScreen'
  ],
  payments: [
    'PaymentsDashboardScreen', 'InvoiceDetailsScreen', 'QuotationsScreen', 'ApproveQuotationScreen',
    'PaymentGatewayScreen', 'AddCardScreen', 'PaymentMethodsScreen', 'PaymentSuccessScreen',
    'PaymentFailedScreen', 'DownloadInvoiceScreen'
  ],
  communication: [
    'ChatListScreen', 'LiveChatScreen', 'VideoConsultationScreen', 'SupportCenterScreen',
    'RaiseTicketScreen', 'TicketDetailsScreen', 'NotificationsCenterScreen', 'NotificationDetailsScreen',
    'ActivityTimelineScreen', 'ContactExpertScreen'
  ],
  certificates: [
    'CertificateCenterScreen', 'CertificateDetailsScreen', 'DownloadCertificateScreen',
    'QRVerificationScreen', 'ShareCertificateScreen', 'ExpiredCertificatesScreen', 'RenewalCertificatesScreen'
  ],
  admin: [
    'AdminDashboardScreen', 'RevenueAnalyticsScreen', 'CRMDashboardScreen', 'LeadsDashboardScreen',
    'ApplicationQueueScreen', 'TeamAssignmentScreen', 'EmployeeManagementScreen', 'PerformanceReportsScreen',
    'FinanceDashboardScreen', 'CMSManagementScreen', 'InsightsCMSScreen', 'AIPromptManagementScreen',
    'UserManagementScreen', 'AuditLogsScreen', 'SystemLogsScreen', 'CalendarManagementScreen'
  ]
};

const template = (screenName) => `import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function ${screenName}() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>${screenName}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
  },
});
`;

Object.entries(modules).forEach(([moduleName, screens]) => {
  const moduleDir = path.join(screensDir, moduleName);
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }

  screens.forEach(screenName => {
    const screenPath = path.join(moduleDir, screenName + '.tsx');
    if (!fs.existsSync(screenPath)) {
      fs.writeFileSync(screenPath, template(screenName));
      console.log('Created ' + screenName + ' in ' + moduleName);
    } else {
      console.log('Skipped ' + screenName + ' (already exists)');
    }
  });
});
