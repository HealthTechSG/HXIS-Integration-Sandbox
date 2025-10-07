import type {
  Encounter,
  CreateEncounterRequest,
  GetEncounterListRequest,
  EncounterStatus,
} from './EncounterTypes';
// import type { Encounter as FhirEncounter } from 'fhir/r5';
import { isEmpty } from 'lodash-es';

import { DateUtils } from '@/common/utils';

const EncounterMapperUtil = {
  mapFromFhirEncounter: (fhirEncounter: any): Encounter => ({
      id: fhirEncounter.id || '',
      status: (fhirEncounter.status as EncounterStatus) || 'planned',
      class: {
        system: fhirEncounter.class?.system || fhirEncounter.class?.coding?.[0]?.system || '',
        code: fhirEncounter.class?.code || fhirEncounter.class?.coding?.[0]?.code || '',
        display: fhirEncounter.class?.display || fhirEncounter.class?.coding?.[0]?.display || '',
      },
      serviceType: fhirEncounter.serviceType ? {
        coding: fhirEncounter.serviceType.coding?.map((coding: any) => ({
          system: coding.system || '',
          code: coding.code || '',
          display: coding.display || '',
        })) || []
      } : undefined,
      priority: fhirEncounter.priority ? {
        coding: fhirEncounter.priority.coding?.map((coding: any) => ({
          system: coding.system || '',
          code: coding.code || '',
          display: coding.display || '',
        })) || []
      } : undefined,
      subject: {
        reference: fhirEncounter.subject?.reference || '',
      },
      participant: fhirEncounter.participant?.map((participant: any) => ({
        individual: {
          reference: participant.individual?.reference || participant.actor?.reference || '',
        },
      })) || [],
      period: {
        start: fhirEncounter.period?.start || fhirEncounter.actualPeriod?.start || '',
        end: fhirEncounter.period?.end || fhirEncounter.actualPeriod?.end,
      },
      location: fhirEncounter.location?.map((location: any) => ({
        location: {
          reference: location.location?.reference || '',
        },
      })),
      reasonCode: fhirEncounter.reasonCode?.map((reason: any) => ({
        coding: reason.coding?.map((coding: any) => ({
          system: coding.system || '',
          code: coding.code || '',
          display: coding.display || '',
        })) || []
      })),
      diagnosis: fhirEncounter.diagnosis?.map((diagnosis: any) => ({
        condition: {
          reference: diagnosis.condition?.reference || '',
        },
      })),
  }),

  mapToFhirEncounter: (encounter: CreateEncounterRequest | Encounter): any => {
    const startTime = typeof encounter.period.start === 'string'
      ? encounter.period.start
      : DateUtils.formatDateForFhir(encounter.period.start);

    let endTime;
    if (encounter.period.end) {
      endTime = typeof encounter.period.end === 'string'
        ? encounter.period.end
        : DateUtils.formatDateForFhir(encounter.period.end);
    }

    const fhirEncounter: any = {
      resourceType: 'Encounter',
      status: encounter.status,
      class: {
        system: encounter.class.system,
        code: encounter.class.code,
        display: encounter.class.display,
      },
      subject: {
        reference: encounter.subject.reference,
      },
      participant: encounter.participant.map(participant => ({
        individual: {
          reference: participant.individual.reference,
        },
      })),
      period: {
        start: startTime,
        end: endTime,
      },
    };

    if ('id' in encounter && encounter.id) {
      fhirEncounter.id = encounter.id;
    }

    if (encounter.serviceType) {
      fhirEncounter.serviceType = {
        coding: encounter.serviceType.coding.map(coding => ({
          system: coding.system,
          code: coding.code,
          display: coding.display,
        })),
      };
    }

    if (encounter.priority) {
      fhirEncounter.priority = {
        coding: encounter.priority.coding.map(coding => ({
          system: coding.system,
          code: coding.code,
          display: coding.display,
        })),
      };
    }

    if (encounter.location) {
      fhirEncounter.location = encounter.location.map(location => ({
        location: {
          reference: location.location.reference,
        },
      }));
    }

    if (encounter.reasonCode) {
      fhirEncounter.reasonCode = encounter.reasonCode.map(reason => ({
        coding: reason.coding.map(coding => ({
          system: coding.system,
          code: coding.code,
          display: coding.display,
        })),
      }));
    }

    if (encounter.diagnosis) {
      fhirEncounter.diagnosis = encounter.diagnosis.map(diagnosis => ({
        condition: {
          reference: diagnosis.condition.reference,
        },
      }));
    }

    return fhirEncounter;
  },

  mapToFhirEncounterFilters: (filters: Partial<GetEncounterListRequest>) => {
    const fhirFilters: Record<string, any> = {};

    if (filters.patientId) {
      fhirFilters.patient = filters.patientId;
    }

    if (filters.status) {
      fhirFilters.status = filters.status;
    }

    if (filters.practitionerId) {
      fhirFilters.participant = filters.practitionerId;
    }

    if (filters.locationId) {
      fhirFilters.location = filters.locationId;
    }

    if (filters.search && !isEmpty(filters.search)) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      fhirFilters['_text'] = filters.search;
    }

    return fhirFilters;
  },

  mapToFhirEncounterSortFields: (
    sortFields: string[],
    sortDirections: ('asc' | 'desc')[]
  ) => sortFields.map((field, index) => {
    const direction = sortDirections[index] || 'asc';
    const fhirField = field === 'period.start' ? 'date' : field;
    return direction === 'desc' ? `-${fhirField}` : fhirField;
  }),
};

export default EncounterMapperUtil;