//* Data Types -----------------------------------------------------------------
export type Medication = {
  id: string;
  code: string;
  display: string;
  system: string;
  status: 'active' | 'inactive' | 'entered-in-error';
  formCode?: string;
  formDisplay?: string;
  formSystem?: string;
};

//* FHIR-specific Types --------------------------------------------------------
export type FhirMedicationCoding = {
  system: string;
  code: string;
  display: string;
};

export type FhirMedicationCodeableConcept = {
  coding: FhirMedicationCoding[];
};

export type FhirMedicationMeta = {
  versionId: string;
  lastUpdated: string;
};

export type FhirMedicationResource = {
  resourceType: 'Medication';
  id?: string;
  meta?: FhirMedicationMeta;
  code: FhirMedicationCodeableConcept;
  status: 'active' | 'inactive' | 'entered-in-error';
  form?: FhirMedicationCodeableConcept;
};

export type FhirMedicationBundleEntry = {
  fullUrl: string;
  resource: FhirMedicationResource;
  search: {
    mode: string;
  };
};

export type FhirMedicationBundle = {
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
  entry: FhirMedicationBundleEntry[];
};

//* Request & Response Format --------------------------------------------------
export type GetMedicationListRequest = {
  // Search
  search?: string;

  // Page
  page?: number;
  pageSize?: number;

  // Sort
  sortFields?: string[];
  sortDirections?: ('asc' | 'desc')[];

  // Filters
  code?: string;
  display?: string;
  status?: 'active' | 'inactive' | 'entered-in-error';
  form?: string;
};

export type GetMedicationListResponse = {
  data: Medication[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateMedicationRequest = Partial<Medication>;

export type UpdateMedicationRequest = Medication;

export type SearchMedicationRequest = {
  code?: string;
  display?: string;
  status?: 'active' | 'inactive' | 'entered-in-error';
  form?: string;
};

//* Status Options -------------------------------------------------------------
export const MEDICATION_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'entered-in-error', label: 'Entered in Error' },
] as const;

//* Common SNOMED CT Codes for Medications ------------------------------------
export const COMMON_MEDICATION_CODES = [
  { code: '90332006', display: 'Product containing paracetamol (medicinal product)', system: 'http://snomed.info/sct' },
  { code: '387207008', display: 'Product containing ibuprofen (medicinal product)', system: 'http://snomed.info/sct' },
  { code: '108571004', display: 'Product containing amoxicillin (medicinal product)', system: 'http://snomed.info/sct' },
  { code: '96034006', display: 'Product containing metformin (medicinal product)', system: 'http://snomed.info/sct' },
  { code: '116602009', display: 'Product containing aspirin (medicinal product)', system: 'http://snomed.info/sct' },
  { code: '387458008', display: 'Product containing atorvastatin (medicinal product)', system: 'http://snomed.info/sct' },
  { code: '108774000', display: 'Product containing lisinopril (medicinal product)', system: 'http://snomed.info/sct' },
  { code: '387506000', display: 'Product containing omeprazole (medicinal product)', system: 'http://snomed.info/sct' },
] as const;

//* Common SNOMED CT Codes for Dose Forms ------------------------------------
export const COMMON_DOSE_FORM_CODES = [
  { code: '385268001', display: 'Oral dose form', system: 'http://snomed.info/sct' },
  { code: '420699003', display: 'Liquid dose form', system: 'http://snomed.info/sct' },
  { code: '385219001', display: 'Injection dose form', system: 'http://snomed.info/sct' },
  { code: '421026006', display: 'Powder dose form', system: 'http://snomed.info/sct' },
  { code: '421156008', display: 'Topical dose form', system: 'http://snomed.info/sct' },
  { code: '420548001', display: 'Transdermal dose form', system: 'http://snomed.info/sct' },
  { code: '385229008', display: 'Inhalation dose form', system: 'http://snomed.info/sct' },
  { code: '385101003', display: 'Suppository dose form', system: 'http://snomed.info/sct' },
] as const;