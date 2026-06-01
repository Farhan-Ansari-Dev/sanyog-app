const fs = require('fs');
const path = require('path');

const navigationDir = path.join(__dirname, 'src', 'navigation');
if (!fs.existsSync(navigationDir)) {
  fs.mkdirSync(navigationDir, { recursive: true });
}

const modules = {
  auth: [
    'SplashScreen', 'OnboardingScreen1', 'OnboardingScreen2', 'OnboardingScreen3',
    'LoginScreen', 'SignupScreen', 'ContinueWithGoogleScreen', 'EmailOtpLoginScreen',
    'OtpVerificationScreen', 'ForgotPasswordScreen', 'ResetPasswordScreen',
    'UserTypeSelectionScreen', 'SessionExpiredScreen', 'NoInternetScreen',
    'MaintenanceScreen', 'ForceUpdateScreen', 'OnboardingScreen', 'OtpScreen'
  ],
  home: [
    'HomeScreen', 'HomeDashboardScreen', 'ComplianceOverviewScreen', 'AIRecommendationsScreen',
    'QuickActionsScreen', 'NotificationsFeedScreen', 'RecentActivitiesScreen',
    'ShipmentOverviewScreen', 'RenewalAlertsScreen', 'CountryComplianceAlertsScreen',
    'ComplianceScoreScreen', 'AssignedManagerScreen'
  ],
  certifications: [
    'CertificationsScreen', 'AllCertificationsScreen', 'DomesticCertificationsScreen', 'InternationalCertificationsScreen',
    'CertificationCategoriesScreen', 'CertificationDetailsScreen', 'CertificationComparisonScreen',
    'CertificationEligibilityCheckerScreen', 'CertificationFAQScreen', 'ApplyCertificationScreen',
    'CertificationTimelineScreen', 'CertificationProgressScreen', 'CertificationDocumentsScreen',
    'GovernmentQueriesScreen', 'RejectedCertificationsScreen', 'RenewalCenterScreen'
  ],
  applications: [
    'ApplicationsScreen', 'ApplicationsDashboardScreen', 'ActiveApplicationsScreen', 'PendingApplicationsScreen',
    'CompletedApplicationsScreen', 'RejectedApplicationsScreen', 'ApplicationDetailsScreen',
    'ApplicationTimelineScreen', 'UploadAdditionalDocumentsScreen', 'AppAssignedManagerScreen',
    'ApprovalWorkflowScreen', 'AppGovernmentQueriesScreen', 'ApplicationNotesScreen',
    'ApplicationHistoryScreen', 'RenewalApplicationsScreen', 'ApplicationSuccessScreen'
  ],
  insights: [
    'InsightsScreen', 'InsightsHomeScreen', 'LatestNewsFeedScreen', 'GovernmentUpdatesScreen',
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
    'PaymentsDashboardScreen', 'PaymentsScreen', 'InvoiceDetailsScreen', 'QuotationsScreen', 'ApproveQuotationScreen',
    'PaymentGatewayScreen', 'AddCardScreen', 'PaymentMethodsScreen', 'PaymentSuccessScreen',
    'PaymentFailedScreen', 'DownloadInvoiceScreen'
  ],
  communication: [
    'ChatListScreen', 'CommunicationScreen', 'LiveChatScreen', 'VideoConsultationScreen', 'SupportCenterScreen',
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

const screensDirBase = path.join(__dirname, 'src', 'screens');

const generateNavigator = (moduleName, screens) => {
  const NavigatorName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1) + 'Navigator';
  
  let imports = "import React from 'react';\n";
  imports += "import { createNativeStackNavigator } from '@react-navigation/native-stack';\n\n";

  screens.forEach(screen => {
    const screenPath = path.join(screensDirBase, moduleName, screen + '.tsx');
    if (fs.existsSync(screenPath)) {
      imports += "import " + screen + " from '../screens/" + moduleName + "/" + screen + "';\n";
    }
  });

  let stackScreens = "";
  let initialRoute = screens[0]; 
  
  for (const s of screens) {
    if (s.includes('Home') || s.includes('Dashboard') || s === 'LoginScreen' || s === 'ProfileScreen' || s === 'DocumentVaultScreen' || s === 'CertificateCenterScreen' || s === 'ChatListScreen' || s === 'ApplicationsScreen' || s === 'CertificationsScreen' || s === 'InsightsScreen') {
      const sp = path.join(screensDirBase, moduleName, s + '.tsx');
      if (fs.existsSync(sp)) {
        initialRoute = s;
        break;
      }
    }
  }

  screens.forEach(screen => {
    const screenPath = path.join(screensDirBase, moduleName, screen + '.tsx');
    if (fs.existsSync(screenPath)) {
      stackScreens += '      <Stack.Screen name="' + screen + '" component={' + screen + '} options={{ headerShown: false }} />\n';
    }
  });

  const content = imports + '\n' +
    'const Stack = createNativeStackNavigator();\n\n' +
    'export default function ' + NavigatorName + '() {\n' +
    '  return (\n' +
    '    <Stack.Navigator initialRouteName="' + initialRoute + '">\n' +
    stackScreens +
    '    </Stack.Navigator>\n' +
    '  );\n' +
    '}\n';

  const destPath = path.join(navigationDir, NavigatorName + '.tsx');
  fs.writeFileSync(destPath, content);
  console.log('Created ' + destPath);
};

Object.entries(modules).forEach(([moduleName, screens]) => {
  generateNavigator(moduleName, screens);
});
