import type { Dayjs } from 'dayjs';

export type AppointmentStatus =
  | 'proposed'
  | 'pending'
  | 'booked'
  | 'arrived'
  | 'fulfilled'
  | 'cancelled'
  | 'noshow'
  | 'entered-in-error'
  | 'checked-in'
  | 'waitlist';

export type ParticipantRequired = 'required' | 'optional' | 'information-only';
export type ParticipantStatus = 'accepted' | 'declined' | 'tentative' | 'needs-action';

export type Coding = {
  system: string;
  code: string;
  display: string;
};

export type CodeableConcept = {
  coding: Coding[];
};

export type Participant = {
  actor: {
    reference: string;
    display?: string;
  };
  required: ParticipantRequired;
  status: ParticipantStatus;
  type?: CodeableConcept[];
};

export type Appointment = {
  id: string;
  status: AppointmentStatus;
  serviceCategory?: CodeableConcept[];
  serviceType?: CodeableConcept[];
  specialty?: CodeableConcept[];
  appointmentType?: CodeableConcept;
  reasonReference?: Array<{
    reference: string;
  }>;
  priority?: number;
  description?: string;
  start: string | Dayjs;
  end?: string | Dayjs;
  created?: string | Dayjs;
  comment?: string;
  participant: Participant[];
};

export type GetAppointmentListRequest = {
  search?: string;
  page?: number;
  pageSize?: number;
  sortFields?: string[];
  sortDirections?: ('asc' | 'desc')[];
  patientId?: string;
  practitionerId?: string;
  locationId?: string;
  status?: AppointmentStatus;
  startDate?: string | Dayjs;
  endDate?: string | Dayjs;
};

export type GetAppointmentListResponse = {
  data: Appointment[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateAppointmentRequest = Omit<Appointment, 'id'>;

export type UpdateAppointmentRequest = Appointment;

export type GetAppointmentsByPatientIdRequest = {
  patientId: string;
  page?: number;
  pageSize?: number;
};
