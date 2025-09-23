import type { Dayjs } from 'dayjs';

//* Data Types -----------------------------------------------------------------
export type Observation = {
  id: string;
  patientId: string;
  status: string;
  category: string;
  code: string;
  display: string;
  text: string;
  effectiveDateTime: string | Dayjs;
  value?: number;
  unit?: string;
  interpretation?: string;
  referenceRangeLow?: number;
  referenceRangeHigh?: number;
  components?: ObservationComponent[];
};

export type ObservationComponent = {
  code: string;
  display: string;
  value: number;
  unit: string;
  interpretation?: string;
};

export type VitalSigns = {
  heartRate?: Observation;
  bloodPressure?: Observation;
  satO2?: Observation;
  temperature?: Observation;
  respiratoryRate?: Observation;
  weight?: Observation;
  height?: Observation;
  bmi?: Observation;
};

//* Request & Response Format --------------------------------------------------
export type GetObservationListRequest = {
  // Search
  search?: string;
  
  // Page
  page?: number;
  pageSize?: number;
  
  // Sort
  sortFields?: string[];
  sortDirections?: ('asc' | 'desc')[];
  
  // Filters
  patient?: string;
  patientId?: string;
  status?: string;
  category?: string;
  code?: string;
  effectiveDateTime?: string | Dayjs;
  _count?: number;
};

export type CreateObservationRequest = Partial<Observation>;

export type UpdateObservationRequest = Observation;

//* Vital Signs Constants ------------------------------------------------------
export const VITAL_SIGNS_CODES = {
  HEART_RATE: '8867-4',
  BLOOD_PRESSURE: '85354-9',
  SYSTOLIC_BP: '8480-6',
  DIASTOLIC_BP: '8462-4',
  SAT_O2: '2708-6',
  TEMPERATURE: '8310-5',
  RESPIRATORY_RATE: '9279-1',
  WEIGHT: '29463-7',
  HEIGHT: '8302-2',
  BMI: '39156-5',
} as const;

export const VITAL_SIGNS_DISPLAYS = {
  [VITAL_SIGNS_CODES.HEART_RATE]: 'Heart rate',
  [VITAL_SIGNS_CODES.BLOOD_PRESSURE]: 'Blood pressure panel with all children optional',
  [VITAL_SIGNS_CODES.SYSTOLIC_BP]: 'Systolic blood pressure',
  [VITAL_SIGNS_CODES.DIASTOLIC_BP]: 'Diastolic blood pressure',
  [VITAL_SIGNS_CODES.SAT_O2]: 'Oxygen saturation in Arterial blood',
  [VITAL_SIGNS_CODES.TEMPERATURE]: 'Body temperature',
  [VITAL_SIGNS_CODES.RESPIRATORY_RATE]: 'Respiratory rate',
  [VITAL_SIGNS_CODES.WEIGHT]: 'Body Weight',
  [VITAL_SIGNS_CODES.HEIGHT]: 'Body height',
  [VITAL_SIGNS_CODES.BMI]: 'Body mass index (BMI) [Ratio]',
} as const;

export const VITAL_SIGNS_UNITS = {
  [VITAL_SIGNS_CODES.HEART_RATE]: 'beats/minute',
  [VITAL_SIGNS_CODES.SYSTOLIC_BP]: 'mmHg',
  [VITAL_SIGNS_CODES.DIASTOLIC_BP]: 'mmHg',
  [VITAL_SIGNS_CODES.SAT_O2]: '%',
  [VITAL_SIGNS_CODES.TEMPERATURE]: 'C',
  [VITAL_SIGNS_CODES.RESPIRATORY_RATE]: 'breaths/minute',
  [VITAL_SIGNS_CODES.WEIGHT]: 'kg',
  [VITAL_SIGNS_CODES.HEIGHT]: 'm',
  [VITAL_SIGNS_CODES.BMI]: 'kg/m2',
} as const;

export const OBSERVATION_CATEGORIES = {
  VITAL_SIGNS: 'vital-signs',
  LABORATORY: 'laboratory',
  IMAGING: 'imaging',
  PROCEDURE: 'procedure',
  SURVEY: 'survey',
  EXAM: 'exam',
  THERAPY: 'therapy',
} as const;

export const OBSERVATION_STATUS = {
  REGISTERED: 'registered',
  PRELIMINARY: 'preliminary',
  FINAL: 'final',
  AMENDED: 'amended',
  CORRECTED: 'corrected',
  CANCELLED: 'cancelled',
  ENTERED_IN_ERROR: 'entered-in-error',
  UNKNOWN: 'unknown',
} as const;