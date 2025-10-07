import type { Dayjs } from 'dayjs';

export type EncounterStatus = 'planned' | 'arrived' | 'triaged' | 'in-progress' | 'onleave' | 'finished' | 'cancelled';

export type Encounter = {
  id: string;
  status: EncounterStatus;
  class: {
    system: string;
    code: string;
    display: string;
  };
  serviceType?: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  priority?: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  };
  subject: {
    reference: string;
  };
  participant: Array<{
    individual: {
      reference: string;
    };
  }>;
  period: {
    start: string | Dayjs;
    end?: string | Dayjs;
  };
  location?: Array<{
    location: {
      reference: string;
    };
  }>;
  reasonCode?: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
  diagnosis?: Array<{
    condition: {
      reference: string;
    };
  }>;
};

export type GetEncounterListRequest = {
  search?: string;
  page?: number;
  pageSize?: number;
  sortFields?: string[];
  sortDirections?: ('asc' | 'desc')[];
  patientId?: string;
  status?: EncounterStatus;
  practitionerId?: string;
  locationId?: string;
};

export type GetEncounterListResponse = {
  data: Encounter[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateEncounterRequest = Omit<Encounter, 'id'>;

export type UpdateEncounterRequest = Encounter;

export type GetEncountersByPatientIdRequest = {
  patientId: string;
  page?: number;
  pageSize?: number;
};