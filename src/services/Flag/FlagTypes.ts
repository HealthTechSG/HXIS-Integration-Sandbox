import type { Dayjs } from 'dayjs';

//* Data Types -----------------------------------------------------------------
export type Flag = {
  id: string;
  status: 'active' | 'inactive' | 'entered-in-error';
  categoryCode: string;
  categoryDisplay: string;
  categorySystem: string;
  code: string;
  display: string;
  system: string;
  subject: string; // Patient ID
  periodStart: string | Dayjs;
  periodEnd?: string | Dayjs;
  author: string; // Practitioner ID
};

//* FHIR-specific Types --------------------------------------------------------
export type FhirFlagCoding = {
  system: string;
  code: string;
  display: string;
};

export type FhirFlagCodeableConcept = {
  coding: FhirFlagCoding[];
};

export type FhirFlagReference = {
  reference: string;
};

export type FhirFlagPeriod = {
  start: string;
  end?: string;
};

export type FhirFlagMeta = {
  versionId: string;
  lastUpdated: string;
};

export type FhirFlagResource = {
  resourceType: 'Flag';
  id?: string;
  meta?: FhirFlagMeta;
  status: 'active' | 'inactive' | 'entered-in-error';
  category: FhirFlagCodeableConcept[];
  code: FhirFlagCodeableConcept;
  subject: FhirFlagReference;
  period: FhirFlagPeriod;
  author: FhirFlagReference;
};

export type FhirFlagBundleEntry = {
  fullUrl: string;
  resource: FhirFlagResource;
  search: {
    mode: string;
  };
};

export type FhirFlagBundle = {
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
  entry: FhirFlagBundleEntry[];
};

//* Request & Response Format --------------------------------------------------
export type GetFlagListRequest = {
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
  status?: string;
  category?: string;
  code?: string;
  author?: string;
};

export type GetFlagListResponse = {
  data: Flag[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateFlagRequest = Partial<Flag>;

export type UpdateFlagRequest = Flag;

export type SearchFlagRequest = {
  patientId?: string;
  status?: string;
  category?: string;
  code?: string;
  author?: string;
};

//* Status Options -------------------------------------------------------------
export const FLAG_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'entered-in-error', label: 'Entered in Error' },
] as const;

//* Category Options -----------------------------------------------------------
export const FLAG_CATEGORY_OPTIONS = [
  {
    value: 'diet',
    label: 'Diet',
    system: 'http://terminology.hl7.org/CodeSystem/flag-category'
  },
  {
    value: 'drug',
    label: 'Drug',
    system: 'http://terminology.hl7.org/CodeSystem/flag-category'
  },
  {
    value: 'lab',
    label: 'Lab',
    system: 'http://terminology.hl7.org/CodeSystem/flag-category'
  },
  {
    value: 'admin',
    label: 'Administrative',
    system: 'http://terminology.hl7.org/CodeSystem/flag-category'
  },
  {
    value: 'contact',
    label: 'Subject',
    system: 'http://terminology.hl7.org/CodeSystem/flag-category'
  },
  {
    value: 'clinical',
    label: 'Clinical',
    system: 'http://terminology.hl7.org/CodeSystem/flag-category'
  },
  {
    value: 'behavioral',
    label: 'Behavioral',
    system: 'http://terminology.hl7.org/CodeSystem/flag-category'
  },
  {
    value: 'research',
    label: 'Research',
    system: 'http://terminology.hl7.org/CodeSystem/flag-category'
  },
  {
    value: 'advance-directive',
    label: 'Advance Directive',
    system: 'http://terminology.hl7.org/CodeSystem/flag-category'
  },
  {
    value: 'safety',
    label: 'Safety',
    system: 'http://terminology.hl7.org/CodeSystem/flag-category'
  },
] as const;

//* Common Flag Codes from SNOMED CT ------------------------------------------
export const COMMON_FLAG_CODES = [
  { code: '134006', display: 'Decreased hair growth', system: 'http://snomed.info/sct' },
  { code: '271737000', display: 'Anemia', system: 'http://snomed.info/sct' },
  { code: '38341003', display: 'Hypertensive disorder', system: 'http://snomed.info/sct' },
  { code: '73211009', display: 'Diabetes mellitus', system: 'http://snomed.info/sct' },
  { code: '195967001', display: 'Asthma', system: 'http://snomed.info/sct' },
  { code: '56265001', display: 'Heart disease', system: 'http://snomed.info/sct' },
  { code: '363346000', display: 'Malignant neoplastic disease', system: 'http://snomed.info/sct' },
  { code: '271594007', display: 'Syncope', system: 'http://snomed.info/sct' },
  { code: '386661006', display: 'Fever', system: 'http://snomed.info/sct' },
  { code: '25064002', display: 'Headache', system: 'http://snomed.info/sct' },
  { code: '267036007', display: 'Dyspnea', system: 'http://snomed.info/sct' },
  { code: '422587007', display: 'Nausea', system: 'http://snomed.info/sct' },
  { code: '422400008', display: 'Vomiting', system: 'http://snomed.info/sct' },
  { code: '62315008', display: 'Diarrhea', system: 'http://snomed.info/sct' },
  { code: '22253000', display: 'Pain', system: 'http://snomed.info/sct' },
] as const;

export type FlagStatus = typeof FLAG_STATUS_OPTIONS[number]['value'];
export type FlagCategory = typeof FLAG_CATEGORY_OPTIONS[number]['value'];