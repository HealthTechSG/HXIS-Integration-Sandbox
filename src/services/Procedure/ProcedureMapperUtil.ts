import type {
  Procedure,
  FhirProcedureResource,
  GetProcedureListRequest,
} from './ProcedureTypes';
import type { Procedure as FhirProcedure } from 'fhir/r5';
import { get } from 'lodash-es';


/**
 * Util functions for mapping FHIR Procedure type to the UI type that we use.
 */
const ProcedureMapperUtil = {
  //* --------------------------------------------------------------------------
  //* Procedure
  //* --------------------------------------------------------------------------
  mapFromFhirProcedure: (fhirProcedure: FhirProcedure) => {
    // Extract patient ID from reference
    const subjectReference = fhirProcedure.subject?.reference || '';
    const patientId = subjectReference.startsWith('Patient/')
      ? subjectReference.substring(8)
      : subjectReference;

    // Extract status
    const status = fhirProcedure.status || '';

    // Extract category - category is an object with coding array, not an array itself
    const category = (fhirProcedure.category as any)?.coding?.[0];
    const categoryCode = category?.code || '';
    const categoryDisplay = category?.display || '';

    // Extract procedure code information
    const procedureCode = fhirProcedure.code?.coding?.[0];
    const code = procedureCode?.code || '';
    const display = procedureCode?.display || '';
    const system = procedureCode?.system || '';

    // Extract performer IDs
    const performerIds = fhirProcedure.performer?.map(performer => {
      const performerReference = performer.actor?.reference || '';
      return performerReference.startsWith('Practitioner/')
        ? performerReference.substring(13)
        : performerReference;
    }) || [];

    // Extract location ID
    const locationReference = fhirProcedure.location?.reference || '';
    const locationId = locationReference.startsWith('Location/')
      ? locationReference.substring(9)
      : locationReference;

    // Extract body site information
    const bodySite = fhirProcedure.bodySite?.[0]?.coding?.[0];
    const bodySiteCode = bodySite?.code || '';
    const bodySiteDisplay = bodySite?.display || '';
    const bodySiteSystem = bodySite?.system || '';

    // Extract outcome information
    const outcome = fhirProcedure.outcome?.coding?.[0];
    const outcomeCode = outcome?.code || '';
    const outcomeDisplay = outcome?.display || '';

    // Extract note
    const note = fhirProcedure.note?.[0]?.text || '';

    return {
      id: fhirProcedure.id,
      patientId,
      status,
      categoryCode,
      categoryDisplay,
      code,
      display,
      system,
      performedDateTime: (fhirProcedure as any).performedDateTime || (fhirProcedure as any).performedPeriod?.start || '',
      performerIds,
      locationId: locationId || undefined,
      bodySiteCode: bodySiteCode || undefined,
      bodySiteDisplay: bodySiteDisplay || undefined,
      bodySiteSystem: bodySiteSystem || undefined,
      outcomeCode: outcomeCode || undefined,
      outcomeDisplay: outcomeDisplay || undefined,
      note: note || undefined,
    } as Procedure;
  },

  //* --------------------------------------------------------------------------
  mapToFhirProcedure: (procedure: Partial<Procedure>) => {
    const fhirResource: FhirProcedureResource = {
      resourceType: 'Procedure',
      status: procedure.status || 'completed',
      category: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/procedure-category',
            code: procedure.categoryCode || '387713003',
            display: procedure.categoryDisplay || 'Surgical procedure',
          }
        ]
      },
      code: {
        coding: [
          {
            system: procedure.system || 'http://snomed.info/sct',
            code: procedure.code || '',
            display: procedure.display || '',
          }
        ]
      },
      subject: {
        reference: `Patient/${procedure.patientId}`,
      },
      performedDateTime: (() => {
        if (!procedure.performedDateTime) {
          return new Date().toISOString();
        }
        if (typeof procedure.performedDateTime === 'string') {
          return procedure.performedDateTime;
        }
        return (procedure.performedDateTime as any).toISOString();
      })(),
    };

    // Add ID if it exists (for updates)
    if (procedure.id) {
      fhirResource.id = procedure.id;
    }

    // Add performers if provided
    if (procedure.performerIds && procedure.performerIds.length > 0) {
      fhirResource.performer = procedure.performerIds.map(performerId => ({
        actor: {
          reference: `Practitioner/${performerId}`,
        }
      }));
    }

    // Add location if provided
    if (procedure.locationId) {
      fhirResource.location = {
        reference: `Location/${procedure.locationId}`,
      };
    }

    // Add body site if provided
    if (procedure.bodySiteCode) {
      fhirResource.bodySite = [
        {
          coding: [
            {
              system: procedure.bodySiteSystem || 'http://terminology.hl7.org/CodeSystem/body-site',
              code: procedure.bodySiteCode,
              display: procedure.bodySiteDisplay || '',
            }
          ]
        }
      ];
    }

    // Add outcome if provided
    if (procedure.outcomeCode) {
      fhirResource.outcome = {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/procedure-outcome',
            code: procedure.outcomeCode,
            display: procedure.outcomeDisplay || '',
          }
        ]
      };
    }

    // Add note if provided
    if (procedure.note) {
      fhirResource.note = [
        {
          text: procedure.note,
        }
      ];
    }

    return fhirResource;
  },

  //* --------------------------------------------------------------------------
  mapFromFhirProcedureResource: (fhirResource: FhirProcedureResource) => {
    // Extract patient ID from reference
    const subjectReference = fhirResource.subject?.reference || '';
    const patientId = subjectReference.startsWith('Patient/')
      ? subjectReference.substring(8)
      : subjectReference;

    // Extract status
    const status = fhirResource.status || '';

    // Extract category
    const category = fhirResource.category?.coding?.[0];
    const categoryCode = category?.code || '';
    const categoryDisplay = category?.display || '';

    // Extract procedure code information
    const procedureCode = fhirResource.code?.coding?.[0];
    const code = procedureCode?.code || '';
    const display = procedureCode?.display || '';
    const system = procedureCode?.system || '';

    // Extract performer IDs
    const performerIds = fhirResource.performer?.map(performer => {
      const performerReference = performer.actor?.reference || '';
      return performerReference.startsWith('Practitioner/')
        ? performerReference.substring(13)
        : performerReference;
    }) || [];

    // Extract location ID
    const locationReference = fhirResource.location?.reference || '';
    const locationId = locationReference.startsWith('Location/')
      ? locationReference.substring(9)
      : locationReference;

    // Extract body site information
    const bodySite = fhirResource.bodySite?.[0]?.coding?.[0];
    const bodySiteCode = bodySite?.code || '';
    const bodySiteDisplay = bodySite?.display || '';
    const bodySiteSystem = bodySite?.system || '';

    // Extract outcome information
    const outcome = fhirResource.outcome?.coding?.[0];
    const outcomeCode = outcome?.code || '';
    const outcomeDisplay = outcome?.display || '';

    // Extract note
    const note = fhirResource.note?.[0]?.text || '';

    return {
      id: fhirResource.id,
      patientId,
      status,
      categoryCode,
      categoryDisplay,
      code,
      display,
      system,
      performedDateTime: fhirResource.performedDateTime || '',
      performerIds,
      locationId: locationId || undefined,
      bodySiteCode: bodySiteCode || undefined,
      bodySiteDisplay: bodySiteDisplay || undefined,
      bodySiteSystem: bodySiteSystem || undefined,
      outcomeCode: outcomeCode || undefined,
      outcomeDisplay: outcomeDisplay || undefined,
      note: note || undefined,
    } as Procedure;
  },

  //* --------------------------------------------------------------------------
  mapToFhirProcedureSortFields: (
    sortFields: string[],
    sortDirections: ('asc' | 'desc')[],
  ) => {
    const fieldNameMapping = {
      performedDateTime: 'date',
      status: 'status',
      category: 'category',
      code: 'code',
      performer: 'performer',
      location: 'location',
    };

    return sortFields.map((field, index) => {
      const fieldName = get(fieldNameMapping, field) ?? field;
      return sortDirections[index] === 'asc' ? fieldName : `-${fieldName}`;
    });
  },

  //* --------------------------------------------------------------------------
  mapToFhirProcedureFilters: ({
    category,
    location,
    patientId,
    performer,
    search,
    status,
    ...filters
  }: Partial<GetProcedureListRequest>) => ({
    ...(patientId && { patient: patientId }),
    ...(search && { code: search }),
    ...(status && { status }),
    ...(category && { category }),
    ...(performer && { performer }),
    ...(location && { location }),
    ...filters,
  }),

  //* --------------------------------------------------------------------------
  //* Bundle Response Mapping
  //* --------------------------------------------------------------------------
  mapFromFhirBundle: (bundle: any) => {
    if (!bundle?.entry) {
      return [];
    }

    return bundle.entry.map((entry: any) =>
      ProcedureMapperUtil.mapFromFhirProcedureResource(entry.resource)
    );
  },

  //* --------------------------------------------------------------------------
};

export default ProcedureMapperUtil;