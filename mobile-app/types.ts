export type RootStackParamList = {
  Login: undefined;
  OTP: { mobile: string };
  Home: undefined;
  Services: undefined;
  ServiceDetails: { groupName: string; services: ServiceCatalogService[] };
  Certifications: undefined;
  ApplicationForm: { serviceGroup: string; serviceName: string };
  Upload: { applicationId: string };
  MyApplications: undefined;
  Contact: undefined;
  About: undefined;
};

export type ServiceCatalogGroup = {
  groupName: string;
  services: ServiceCatalogService[];
};

export type ServiceCatalogService = {
  name: string;
  slug: string;
};

export type ServiceCatalogResponse = {
  groups: ServiceCatalogGroup[];
};

export type Application = {
  _id: string;
  certification?: string;
  serviceGroup?: string;
  serviceName?: string;
  companyName?: string;
  applicantName?: string;
  email?: string;
  city?: string;
  description?: string;
  status?: string;
  remarks?: string;
  documents?: string[];
  createdAt?: string;
  updatedAt?: string;
};
