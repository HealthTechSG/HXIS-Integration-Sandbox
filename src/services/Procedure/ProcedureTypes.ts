import type { Dayjs } from 'dayjs';

//* Data Types -----------------------------------------------------------------
export type Procedure = {
  id: string;
  patientId: string;
  status: string;
  categoryCode: string;
  categoryDisplay: string;
  code: string;
  display: string;
  system: string;
  performedDateTime: string | Dayjs;
  performerIds: string[];
  locationId?: string;
  bodySiteCode?: string;
  bodySiteDisplay?: string;
  bodySiteSystem?: string;
  outcomeCode?: string;
  outcomeDisplay?: string;
  note?: string;
};

//* FHIR-specific Types --------------------------------------------------------
export type FhirProcedureCoding = {
  system: string;
  code: string;
  display: string;
};

export type FhirProcedureCodeableConcept = {
  coding: FhirProcedureCoding[];
};

export type FhirProcedureReference = {
  reference: string;
};

export type FhirProcedurePerformer = {
  actor: FhirProcedureReference;
};

export type FhirProcedureNote = {
  text: string;
};

export type FhirProcedureMeta = {
  versionId: string;
  lastUpdated: string;
};

export type FhirProcedureResource = {
  resourceType: 'Procedure';
  id?: string;
  meta?: FhirProcedureMeta;
  status: string;
  category: FhirProcedureCodeableConcept;
  code: FhirProcedureCodeableConcept;
  subject: FhirProcedureReference;
  performedDateTime: string;
  performer?: FhirProcedurePerformer[];
  location?: FhirProcedureReference;
  bodySite?: FhirProcedureCodeableConcept[];
  outcome?: FhirProcedureCodeableConcept;
  note?: FhirProcedureNote[];
};

export type FhirProcedureBundleEntry = {
  fullUrl: string;
  resource: FhirProcedureResource;
  search: {
    mode: string;
  };
};

export type FhirProcedureBundle = {
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
  entry: FhirProcedureBundleEntry[];
};

//* Request & Response Format --------------------------------------------------
export type GetProcedureListRequest = {
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
  performer?: string;
  location?: string;
};

export type GetProcedureListResponse = {
  data: Procedure[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateProcedureRequest = Partial<Procedure>;

export type UpdateProcedureRequest = Procedure;

export type SearchProcedureRequest = {
  patientId?: string;
  status?: string;
  category?: string;
  performer?: string;
  location?: string;
};

//* Status Options -------------------------------------------------------------
export const STATUS_OPTIONS = [
  { value: 'preparation', label: 'Preparation' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'not-done', label: 'Not Done' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'completed', label: 'Completed' },
  { value: 'entered-in-error', label: 'Entered in Error' },
  { value: 'unknown', label: 'Unknown' },
] as const;

//* Category Options -----------------------------------------------------------
export const CATEGORY_OPTIONS = [
  { value: '2464200', label: 'Psychiatry procedure or service', code: '2464200' },
  { value: '409063005', label: 'Counseling', code: '409063005' },
  { value: '409073007', label: 'Education', code: '409073007' },
  { value: '387713003', label: 'Surgical procedure', code: '387713003' },
  { value: '103693007', label: 'Diagnostic procedure', code: '103693007' },
  { value: '46947000', label: 'Chiropractic manipulation', code: '46947000' },
  { value: '410606002', label: 'Social service procedure', code: '410606002' },
] as const;

//* Outcome Options ------------------------------------------------------------
export const OUTCOME_OPTIONS = [
  { value: '385669000', label: 'Successful', code: '385669000' },
  { value: '385671000', label: 'Unsuccessful', code: '385671000' },
  { value: '385670004', label: 'Partially successful', code: '385670004' },
] as const;

//* Common SNOMED CT Codes for Procedures -------------------------------------
export const COMMON_PROCEDURE_CODES = [
  { code: '1299000', display: 'Excision of appendiceal stump', system: 'http://snomed.info/sct' },
  { code: '18946005', display: 'Appendectomy', system: 'http://snomed.info/sct' },
  { code: '80146002', display: 'Excision of appendix', system: 'http://snomed.info/sct' },
  { code: '71388002', display: 'Procedure', system: 'http://snomed.info/sct' },
  { code: '387713003', display: 'Surgical procedure', system: 'http://snomed.info/sct' },
  { code: '103693007', display: 'Diagnostic procedure', system: 'http://snomed.info/sct' },
  { code: '182832007', display: 'Procedure related to management of drug administration', system: 'http://snomed.info/sct' },
  { code: '363679005', display: 'Imaging', system: 'http://snomed.info/sct' },
  { code: '277132007', display: 'Therapeutic procedure', system: 'http://snomed.info/sct' },
  { code: '386053000', display: 'Evaluation procedure', system: 'http://snomed.info/sct' },
  { code: '24642003', display: 'Psychiatry procedure or service', system: 'http://snomed.info/sct' },
  { code: '409063005', display: 'Counseling', system: 'http://snomed.info/sct' },
  { code: '46947000', display: 'Chiropractic manipulation', system: 'http://snomed.info/sct' },
  { code: '225358003', display: 'Wound care', system: 'http://snomed.info/sct' },
  { code: '33879002', display: 'Administration of immunization', system: 'http://snomed.info/sct' },
] as const;

//* Common Body Site Codes for Procedures -------------------------------------
export const COMMON_BODY_SITE_CODES = [
  { code: '7242000', display: 'Appendiceal muscularis propria', system: 'http://terminology.hl7.org/CodeSystem/body-site' },
  { code: '51185008', display: 'Thoracic structure', system: 'http://terminology.hl7.org/CodeSystem/body-site' },
  { code: '12738006', display: 'Brain structure', system: 'http://terminology.hl7.org/CodeSystem/body-site' },
  { code: '80891009', display: 'Heart structure', system: 'http://terminology.hl7.org/CodeSystem/body-site' },
  { code: '39607008', display: 'Lung structure', system: 'http://terminology.hl7.org/CodeSystem/body-site' },
  { code: '10200004', display: 'Liver structure', system: 'http://terminology.hl7.org/CodeSystem/body-site' },
  { code: '64033007', display: 'Kidney structure', system: 'http://terminology.hl7.org/CodeSystem/body-site' },
  { code: '69536005', display: 'Head structure', system: 'http://terminology.hl7.org/CodeSystem/body-site' },
  { code: '53075003', display: 'Distal phalanx of index finger', system: 'http://terminology.hl7.org/CodeSystem/body-site' },
  { code: '85562004', display: 'Colon structure', system: 'http://terminology.hl7.org/CodeSystem/body-site' },
  { code: '76754009', display: 'Limb structure', system: 'http://terminology.hl7.org/CodeSystem/body-site' },
  { code: '15497006', display: 'Ovarian structure', system: 'http://terminology.hl7.org/CodeSystem/body-site' },
  { code: '20233005', display: 'Spleen structure', system: 'http://terminology.hl7.org/CodeSystem/body-site' },
  { code: '28231008', display: 'Gallbladder structure', system: 'http://terminology.hl7.org/CodeSystem/body-site' },
  { code: '362968005', display: 'Entire spine', system: 'http://terminology.hl7.org/CodeSystem/body-site' },
] as const;