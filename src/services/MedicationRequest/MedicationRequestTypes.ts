import type { Dayjs } from 'dayjs';

//* Data Types -----------------------------------------------------------------
export type MedicationRequest = {
  id: string;
  status: 'active' | 'on-hold' | 'cancelled' | 'completed' | 'entered-in-error' | 'stopped' | 'draft' | 'unknown';
  intent: 'proposal' | 'plan' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  medicationId: string;
  medicationDisplay: string;
  patientId: string;
  practitionerId: string;
  authoredOn: string | Dayjs;
  dosageInstructionText: string;
  dosageInstructionSequence: number;
};

//* FHIR-specific Types --------------------------------------------------------
export type FhirMedicationRequestReference = {
  reference: string;
  display?: string;
};

export type FhirMedicationRequestDosageInstruction = {
  sequence: number;
  text: string;
};

export type FhirMedicationRequestMeta = {
  versionId: string;
  lastUpdated: string;
};

export type FhirMedicationRequestResource = {
  resourceType: 'MedicationRequest';
  id?: string;
  meta?: FhirMedicationRequestMeta;
  status: 'active' | 'on-hold' | 'cancelled' | 'completed' | 'entered-in-error' | 'stopped' | 'draft' | 'unknown';
  intent: 'proposal' | 'plan' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  medicationReference: FhirMedicationRequestReference;
  subject: FhirMedicationRequestReference;
  authoredOn?: string;
  requester: FhirMedicationRequestReference;
  dosageInstruction: FhirMedicationRequestDosageInstruction[];
};

export type FhirMedicationRequestBundleEntry = {
  fullUrl: string;
  resource: FhirMedicationRequestResource;
  search: {
    mode: string;
  };
};

export type FhirMedicationRequestBundle = {
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
  entry: FhirMedicationRequestBundleEntry[];
};

//* Request & Response Format --------------------------------------------------
export type GetMedicationRequestListRequest = {
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
  status?: 'active' | 'on-hold' | 'cancelled' | 'completed' | 'entered-in-error' | 'stopped' | 'draft' | 'unknown';
  intent?: 'proposal' | 'plan' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  medicationId?: string;
  practitionerId?: string;
  authoredOn?: string | Dayjs;
};

export type GetMedicationRequestListResponse = {
  data: MedicationRequest[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateMedicationRequestRequest = Partial<MedicationRequest>;

export type UpdateMedicationRequestRequest = MedicationRequest;

export type SearchMedicationRequestRequest = {
  patientId?: string;
  status?: 'active' | 'on-hold' | 'cancelled' | 'completed' | 'entered-in-error' | 'stopped' | 'draft' | 'unknown';
  intent?: 'proposal' | 'plan' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  medicationId?: string;
  practitionerId?: string;
};

//* Status Options -------------------------------------------------------------
export const MEDICATION_REQUEST_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
  { value: 'entered-in-error', label: 'Entered in Error' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'draft', label: 'Draft' },
  { value: 'unknown', label: 'Unknown' },
] as const;

//* Intent Options -------------------------------------------------------------
export const MEDICATION_REQUEST_INTENT_OPTIONS = [
  { value: 'proposal', label: 'Proposal' },
  { value: 'plan', label: 'Plan' },
  { value: 'order', label: 'Order' },
  { value: 'original-order', label: 'Original Order' },
  { value: 'reflex-order', label: 'Reflex Order' },
  { value: 'filler-order', label: 'Filler Order' },
  { value: 'instance-order', label: 'Instance Order' },
  { value: 'option', label: 'Option' },
] as const;

//* Common Dosage Instructions ------------------------------------------------
export const COMMON_DOSAGE_INSTRUCTIONS = [
  { text: 'Take one tablet daily as directed', sequence: 1 },
  { text: 'Take two tablets twice daily with meals', sequence: 1 },
  { text: 'Take one capsule every 8 hours as needed for pain', sequence: 1 },
  { text: 'Apply topically to affected area twice daily', sequence: 1 },
  { text: 'Take one tablet at bedtime', sequence: 1 },
  { text: 'Take two tablets every 4-6 hours as needed', sequence: 1 },
  { text: 'Take one tablet in the morning with breakfast', sequence: 1 },
  { text: 'Take as directed by physician', sequence: 1 },
] as const;