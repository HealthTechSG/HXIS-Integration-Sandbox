import type { Dayjs } from 'dayjs';

//* Data Types -----------------------------------------------------------------
export type Patient = {
  id: string;
  mrn: string;
  name: string;
  active: boolean;
  gender: string;
  birthdate: string | Dayjs;
  maritalStatus: string;
  idType: string;
  idNumber: string;
  contactNumber: string;
  email: string;
  address: string;
  postalCode: string;
  country: string;
};

export type PatientAllergy = {
  id: string;
  patientId: string;
  name: string;
  description: string;
  type: string;
  category: string;
  severity: string;
  recordedDate: string | Dayjs;
  note: string;
};

export type PatientNextOfKin = {
  id: string;
  patientId: string;
  name: string;
  relationship: string;
  contactNumber: string;
};

export type PatientImmunization = {
  id: string;
  patientId: string;
  name: string;
  productName: string;
  manufacturerName: string;
  lotNumber: string;
  vaccineDate: string | Dayjs;
  informationSource: string;
  note: string;
  reaction: string;
  reactionDate: string | Dayjs;
};

export type PatientRemarks = {
  id: string;
  patientId: string;
  remarks: string;
};

//* Request & Response Format --------------------------------------------------
export type GetPatientListRequest = {
  // Search
  search?: string;

  // Page
  page?: number;
  pageSize?: number;

  // Sort
  sortFields?: string[];
  sortDirections?: ('asc' | 'desc')[];

  // Filters
  mrn?: string;
  name?: string;
  active?: boolean;
  gender?: string;
  birthdate?: string | Dayjs;
  contactNumber?: string;
  email?: string;
};

export type CreatePatientRequest = Partial<Patient>;
