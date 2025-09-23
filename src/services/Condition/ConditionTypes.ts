import type { Dayjs } from 'dayjs';

//* Data Types -----------------------------------------------------------------
export type Condition = {
  id: string;
  patientId: string;
  clinicalStatus: string;
  verificationStatus: string;
  category: string;
  severity: string;
  code: string;
  display: string;
  system: string;
  bodySiteCode?: string;
  bodySiteDisplay?: string;
  bodySiteSystem?: string;
  recordedDate: string | Dayjs;
};

//* FHIR-specific Types --------------------------------------------------------
export type FhirConditionCoding = {
  system: string;
  code: string;
  display: string;
};

export type FhirConditionCodeableConcept = {
  coding: FhirConditionCoding[];
};

export type FhirConditionSubjectReference = {
  reference: string;
};

export type FhirConditionMeta = {
  versionId: string;
  lastUpdated: string;
};

export type FhirConditionResource = {
  resourceType: 'Condition';
  id?: string;
  meta?: FhirConditionMeta;
  clinicalStatus: FhirConditionCodeableConcept;
  verificationStatus: FhirConditionCodeableConcept;
  category: FhirConditionCodeableConcept[];
  severity?: FhirConditionCodeableConcept;
  code: FhirConditionCodeableConcept;
  bodySite?: FhirConditionCodeableConcept[];
  subject: FhirConditionSubjectReference;
  recordedDate: string;
};

export type FhirConditionBundleEntry = {
  fullUrl: string;
  resource: FhirConditionResource;
  search: {
    mode: string;
  };
};

export type FhirConditionBundle = {
  resourceType: 'Bundle';
  id: string;
  meta: {
    lastUpdated: string;
  };
  type: string;
  link: Array<{
    relation: string;
    url: string;
  }>;
  entry: FhirConditionBundleEntry[];
};

//* Request & Response Format --------------------------------------------------
export type GetConditionListRequest = {
  // Search
  search?: string;
  patientId?: string;

  // Page
  page?: number;
  pageSize?: number;

  // Sort
  sortFields?: string[];
  sortDirections?: ('asc' | 'desc')[];

  // Filters
  clinicalStatus?: string;
  verificationStatus?: string;
  category?: string;
  severity?: string;
};

export type GetConditionListResponse = {
  data: Condition[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateConditionRequest = Partial<Condition>;

export type UpdateConditionRequest = Condition;

export type SearchConditionRequest = {
  patientId?: string;
  clinicalStatus?: string;
  verificationStatus?: string;
  category?: string;
  severity?: string;
};

//* Clinical Status Options ----------------------------------------------------
export const CLINICAL_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'recurrence', label: 'Recurrence' },
  { value: 'relapse', label: 'Relapse' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'remission', label: 'Remission' },
  { value: 'resolved', label: 'Resolved' },
] as const;

//* Verification Status Options ------------------------------------------------
export const VERIFICATION_STATUS_OPTIONS = [
  { value: 'unconfirmed', label: 'Unconfirmed' },
  { value: 'provisional', label: 'Provisional' },
  { value: 'differential', label: 'Differential' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'refuted', label: 'Refuted' },
  { value: 'entered-in-error', label: 'Entered in Error' },
] as const;

//* Category Options -----------------------------------------------------------
export const CATEGORY_OPTIONS = [
  { value: 'problem-list-item', label: 'Problem List Item' },
  { value: 'encounter-diagnosis', label: 'Encounter Diagnosis' },
] as const;

//* Severity Options -----------------------------------------------------------
export const SEVERITY_OPTIONS = [
  { value: '255604002', label: 'Mild', code: '255604002' },
  { value: '6736007', label: 'Moderate', code: '6736007' },
  { value: '24484000', label: 'Severe', code: '24484000' },
] as const;

//* Common SNOMED CT Codes for Conditions -------------------------------------
export const COMMON_CONDITION_CODES = [
  { code: '825003', display: 'Superficial injury of axilla with infection', system: 'http://snomed.info/sct' },
  { code: '38341003', display: 'Hypertensive disorder', system: 'http://snomed.info/sct' },
  { code: '73211009', display: 'Diabetes mellitus', system: 'http://snomed.info/sct' },
  { code: '195967001', display: 'Asthma', system: 'http://snomed.info/sct' },
  { code: '233604007', display: 'Pneumonia', system: 'http://snomed.info/sct' },
  { code: '22298006', display: 'Myocardial infarction', system: 'http://snomed.info/sct' },
  { code: '399211009', display: 'History of myocardial infarction', system: 'http://snomed.info/sct' },
  { code: '49601007', display: 'Disorder of cardiovascular system', system: 'http://snomed.info/sct' },
] as const;

//* Common SNOMED CT Codes for Body Sites -------------------------------------
export const COMMON_BODY_SITE_CODES = [
  { code: '283001', display: 'Central axillary lymph node', system: 'http://snomed.info/sct' },
  { code: '51185008', display: 'Thoracic structure', system: 'http://snomed.info/sct' },
  { code: '12738006', display: 'Brain structure', system: 'http://snomed.info/sct' },
  { code: '80891009', display: 'Heart structure', system: 'http://snomed.info/sct' },
  { code: '39607008', display: 'Lung structure', system: 'http://snomed.info/sct' },
  { code: '10200004', display: 'Liver structure', system: 'http://snomed.info/sct' },
  { code: '64033007', display: 'Kidney structure', system: 'http://snomed.info/sct' },
  { code: '69536005', display: 'Head structure', system: 'http://snomed.info/sct' },
] as const;