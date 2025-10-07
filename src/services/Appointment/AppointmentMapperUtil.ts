import type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentRequest,
  GetAppointmentListRequest,
} from './AppointmentTypes';
import { isEmpty } from 'lodash-es';

import { DateUtils } from '@/common/utils';

const AppointmentMapperUtil = {
  mapFromFhirAppointment: (fhirAppointment: any): Appointment => ({
    id: fhirAppointment.id || '',
    status: (fhirAppointment.status as AppointmentStatus) || 'proposed',
    serviceCategory: fhirAppointment.serviceCategory?.map((category: any) => ({
      coding: category.coding?.map((coding: any) => ({
        system: coding.system || '',
        code: coding.code || '',
        display: coding.display || '',
      })) || [],
    })),
    serviceType: fhirAppointment.serviceType?.map((type: any) => ({
      coding: type.coding?.map((coding: any) => ({
        system: coding.system || '',
        code: coding.code || '',
        display: coding.display || '',
      })) || [],
    })),
    specialty: fhirAppointment.specialty?.map((spec: any) => ({
      coding: spec.coding?.map((coding: any) => ({
        system: coding.system || '',
        code: coding.code || '',
        display: coding.display || '',
      })) || [],
    })),
    appointmentType: fhirAppointment.appointmentType ? {
      coding: fhirAppointment.appointmentType.coding?.map((coding: any) => ({
        system: coding.system || '',
        code: coding.code || '',
        display: coding.display || '',
      })) || [],
    } : undefined,
    reasonReference: fhirAppointment.reasonReference?.map((reason: any) => ({
      reference: reason.reference || '',
    })),
    priority: fhirAppointment.priority,
    description: fhirAppointment.description,
    start: fhirAppointment.start || '',
    end: fhirAppointment.end,
    created: fhirAppointment.created,
    comment: fhirAppointment.comment,
    participant: fhirAppointment.participant?.map((participant: any) => ({
      actor: {
        reference: participant.actor?.reference || '',
        display: participant.actor?.display,
      },
      required: participant.required || 'required',
      status: participant.status || 'accepted',
      type: participant.type?.map((type: any) => ({
        coding: type.coding?.map((coding: any) => ({
          system: coding.system || '',
          code: coding.code || '',
          display: coding.display || '',
        })) || [],
      })),
    })) || [],
  }),

  mapToFhirAppointment: (appointment: CreateAppointmentRequest | Appointment): any => {
    const startTime = typeof appointment.start === 'string'
      ? appointment.start
      : DateUtils.formatDateForFhir(appointment.start);

    let endTime;
    if (appointment.end) {
      endTime = typeof appointment.end === 'string'
        ? appointment.end
        : DateUtils.formatDateForFhir(appointment.end);
    }

    let createdDate;
    if (appointment.created) {
      createdDate = typeof appointment.created === 'string'
        ? appointment.created
        : DateUtils.formatDateForFhir(appointment.created);
    }

    const fhirAppointment: any = {
      resourceType: 'Appointment',
      status: appointment.status,
      start: startTime,
      participant: appointment.participant.map(participant => ({
        actor: {
          reference: participant.actor.reference,
          display: participant.actor.display,
        },
        required: participant.required,
        status: participant.status,
        type: participant.type?.map(type => ({
          coding: type.coding.map(coding => ({
            system: coding.system,
            code: coding.code,
            display: coding.display,
          })),
        })),
      })),
    };

    if ('id' in appointment && appointment.id) {
      fhirAppointment.id = appointment.id;
    }

    if (endTime) {
      fhirAppointment.end = endTime;
    }

    if (createdDate) {
      fhirAppointment.created = createdDate;
    }

    if (appointment.serviceCategory) {
      fhirAppointment.serviceCategory = appointment.serviceCategory.map(category => ({
        coding: category.coding.map(coding => ({
          system: coding.system,
          code: coding.code,
          display: coding.display,
        })),
      }));
    }

    if (appointment.serviceType) {
      fhirAppointment.serviceType = appointment.serviceType.map(type => ({
        coding: type.coding.map(coding => ({
          system: coding.system,
          code: coding.code,
          display: coding.display,
        })),
      }));
    }

    if (appointment.specialty) {
      fhirAppointment.specialty = appointment.specialty.map(spec => ({
        coding: spec.coding.map(coding => ({
          system: coding.system,
          code: coding.code,
          display: coding.display,
        })),
      }));
    }

    if (appointment.appointmentType) {
      fhirAppointment.appointmentType = {
        coding: appointment.appointmentType.coding.map(coding => ({
          system: coding.system,
          code: coding.code,
          display: coding.display,
        })),
      };
    }

    if (appointment.reasonReference) {
      fhirAppointment.reasonReference = appointment.reasonReference.map(reason => ({
        reference: reason.reference,
      }));
    }

    if (appointment.priority !== undefined) {
      fhirAppointment.priority = appointment.priority;
    }

    if (appointment.description) {
      fhirAppointment.description = appointment.description;
    }

    if (appointment.comment) {
      fhirAppointment.comment = appointment.comment;
    }

    return fhirAppointment;
  },

  mapToFhirAppointmentFilters: (filters: Partial<GetAppointmentListRequest>) => {
    const fhirFilters: Record<string, any> = {};

    if (filters.patientId) {
      fhirFilters.actor = `Patient/${filters.patientId}`;
    }

    if (filters.practitionerId) {
      fhirFilters.actor = `Practitioner/${filters.practitionerId}`;
    }

    if (filters.locationId) {
      fhirFilters.location = filters.locationId;
    }

    if (filters.status) {
      fhirFilters.status = filters.status;
    }

    if (filters.startDate) {
      const date = typeof filters.startDate === 'string'
        ? filters.startDate
        : DateUtils.formatDateForFhir(filters.startDate);
      fhirFilters.date = `ge${date}`;
    }

    if (filters.endDate) {
      const date = typeof filters.endDate === 'string'
        ? filters.endDate
        : DateUtils.formatDateForFhir(filters.endDate);
      fhirFilters.date = fhirFilters.date
        ? `${fhirFilters.date}&date=le${date}`
        : `le${date}`;
    }

    if (filters.search && !isEmpty(filters.search)) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      fhirFilters['_text'] = filters.search;
    }

    return fhirFilters;
  },

  mapToFhirAppointmentSortFields: (
    sortFields: string[],
    sortDirections: ('asc' | 'desc')[]
  ) => sortFields.map((field, index) => {
    const direction = sortDirections[index] || 'asc';
    const fhirField = field === 'start' ? 'date' : field;
    return direction === 'desc' ? `-${fhirField}` : fhirField;
  }),
};

export default AppointmentMapperUtil;
