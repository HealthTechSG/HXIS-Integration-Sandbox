// FHIR Practitioner Types based on FHIR R4B specification
export interface FhirPractitionerName {
  use?: 'usual' | 'official' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden';
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
}

export interface FhirPractitionerTelecom {
  system?: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
  value?: string;
  use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
}

export interface FhirPractitionerAddress {
  use?: 'home' | 'work' | 'temp' | 'old' | 'billing';
  type?: 'postal' | 'physical' | 'both';
  line?: string[];
  city?: string;
  district?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface FhirPractitionerQualificationCoding {
  system?: string;
  code?: string;
  display?: string;
}

export interface FhirPractitionerQualificationCode {
  coding?: FhirPractitionerQualificationCoding[];
  text?: string;
}

export interface FhirPractitionerQualificationPeriod {
  start?: string;
  end?: string;
}

export interface FhirPractitionerQualificationIssuer {
  reference?: string;
  display?: string;
}

export interface FhirPractitionerQualification {
  identifier?: any[];
  code?: FhirPractitionerQualificationCode;
  period?: FhirPractitionerQualificationPeriod;
  issuer?: FhirPractitionerQualificationIssuer;
}

export interface FhirPractitionerMeta {
  versionId?: string;
  lastUpdated?: string;
}

// Core FHIR Practitioner Resource
export interface FhirPractitioner {
  resourceType: 'Practitioner';
  id?: string;
  meta?: FhirPractitionerMeta;
  active?: boolean;
  name?: FhirPractitionerName[];
  telecom?: FhirPractitionerTelecom[];
  address?: FhirPractitionerAddress[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  photo?: any[];
  qualification?: FhirPractitionerQualification[];
  communication?: any[];
}

// FHIR Bundle Response for Practitioner search
export interface FhirPractitionerBundleEntry {
  fullUrl?: string;
  resource: FhirPractitioner;
  search?: {
    mode: string;
  };
}

export interface FhirPractitionerBundle {
  resourceType: 'Bundle';
  id: string;
  meta: {
    lastUpdated: string;
  };
  type: 'searchset';
  link?: Array<{
    relation: string;
    url: string;
  }>;
  entry?: FhirPractitionerBundleEntry[];
}

// Application-specific Practitioner types
export interface Practitioner {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  birthdate: string | Date;
  contactNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  practitionerId?: string;
  idNumber?: string;
  active: boolean;
  specialty?: string; // Derived from qualifications
  qualifications?: FhirPractitionerQualification[];
  lastUpdated?: string;
}

// Request types for API calls
export interface CreatePractitionerRequest {
  name: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  birthdate: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  practitionerId?: string;
  idNumber?: string;
  active: boolean;
  specialty?: string;
}

export interface UpdatePractitionerRequest extends CreatePractitionerRequest {
  id: string;
}

// API Query Parameters
export interface GetPractitionerListParams {
  search?: string;
  page?: number;
  pageSize?: number;
  active?: boolean;
  specialty?: string;
}

// API Response types
export interface PractitionerListResponse {
  entry: Practitioner[];
  total?: number;
  hasNextPage?: boolean;
}

export interface PractitionerResponse extends Practitioner {}