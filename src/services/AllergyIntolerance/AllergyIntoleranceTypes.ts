import type { Dayjs } from 'dayjs';

//* Data Types -----------------------------------------------------------------
export type AllergyIntolerance = {
  id: string;
  patientId: string;
  clinicalStatus: string;
  verificationStatus: string;
  type: string;
  category: string[];
  criticality: string;
  code: string;
  display: string;
  system: string;
  recordedDate: string | Dayjs;
  note: string;
};

//* FHIR-specific Types --------------------------------------------------------
export type FhirAllergyIntoleranceCode = {
  system: string;
  code: string;
  display: string;
};

export type FhirAllergyIntoleranceCoding = {
  coding: FhirAllergyIntoleranceCode[];
};

export type FhirAllergyIntoleranceCodeableConcept = {
  coding: FhirAllergyIntoleranceCode[];
};

export type FhirAllergyIntolerancePatientReference = {
  reference: string;
};

export type FhirAllergyIntoleranceNote = {
  text: string;
};

export type FhirAllergyIntoleranceMeta = {
  versionId: string;
  lastUpdated: string;
};

export type FhirAllergyIntoleranceResource = {
  resourceType: 'AllergyIntolerance';
  id?: string;
  meta?: FhirAllergyIntoleranceMeta;
  clinicalStatus: FhirAllergyIntoleranceCoding;
  verificationStatus: FhirAllergyIntoleranceCoding;
  type: string;
  category: string[];
  criticality: string;
  code: FhirAllergyIntoleranceCodeableConcept;
  patient: FhirAllergyIntolerancePatientReference;
  recordedDate: string;
  note: FhirAllergyIntoleranceNote[];
};

export type FhirAllergyIntoleranceBundleEntry = {
  fullUrl: string;
  resource: FhirAllergyIntoleranceResource;
  search: {
    mode: string;
  };
};

export type FhirAllergyIntoleranceBundle = {
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
  entry: FhirAllergyIntoleranceBundleEntry[];
};

//* Request & Response Format --------------------------------------------------
export type GetAllergyIntoleranceListRequest = {
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
  type?: string;
  category?: string;
  criticality?: string;
};

export type GetAllergyIntoleranceListResponse = {
  data: AllergyIntolerance[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateAllergyIntoleranceRequest = Partial<AllergyIntolerance>;

export type UpdateAllergyIntoleranceRequest = AllergyIntolerance;

export type SearchAllergyIntoleranceRequest = {
  patientId?: string;
  clinicalStatus?: string;
  verificationStatus?: string;
  type?: string;
  category?: string;
  criticality?: string;
};

//* Clinical Status Options ----------------------------------------------------
export const CLINICAL_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'resolved', label: 'Resolved' },
] as const;

//* Verification Status Options ------------------------------------------------
export const VERIFICATION_STATUS_OPTIONS = [
  { value: 'unconfirmed', label: 'Unconfirmed' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'refuted', label: 'Refuted' },
  { value: 'entered-in-error', label: 'Entered in Error' },
] as const;

//* Type Options ---------------------------------------------------------------
export const TYPE_OPTIONS = [
  { value: 'allergy', label: 'Allergy' },
  { value: 'intolerance', label: 'Intolerance' },
] as const;

//* Category Options -----------------------------------------------------------
export const CATEGORY_OPTIONS = [
  { value: 'food', label: 'Food' },
  { value: 'medication', label: 'Medication' },
  { value: 'environment', label: 'Environment' },
  { value: 'biologic', label: 'Biologic' },
] as const;

//* Criticality Options --------------------------------------------------------
export const CRITICALITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'high', label: 'High' },
  { value: 'unable-to-assess', label: 'Unable to Assess' },
] as const;

//* Common SNOMED CT Codes for Allergies ---------------------------------------
export const COMMON_ALLERGY_CODES = [
  { code: '91937001', display: 'Allergy to seafood', system: 'http://snomed.info/sct' },
  { code: '91936005', display: 'Allergy to penicillin', system: 'http://snomed.info/sct' },
  { code: '91935009', display: 'Allergy to peanuts', system: 'http://snomed.info/sct' },
  { code: '300916003', display: 'Allergy to eggs', system: 'http://snomed.info/sct' },
  { code: '425525006', display: 'Allergy to dairy product', system: 'http://snomed.info/sct' },
  { code: '419263009', display: 'Allergy to bee venom', system: 'http://snomed.info/sct' },
  { code: '232350006', display: 'House dust mite allergy', system: 'http://snomed.info/sct' },
  { code: '294505008', display: 'Allergy to latex', system: 'http://snomed.info/sct' },
] as const;