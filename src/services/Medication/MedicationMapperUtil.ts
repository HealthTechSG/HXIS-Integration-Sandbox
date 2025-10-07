import type {
  Medication,
  FhirMedicationResource,
  GetMedicationListRequest,
} from './MedicationTypes';
import { get } from 'lodash-es';

/**
 * Util functions for mapping FHIR Medication type to the UI type that we use.
 */
const MedicationMapperUtil = {
  //* --------------------------------------------------------------------------
  //* Medication
  //* --------------------------------------------------------------------------
  mapFromFhirMedication: (fhirMedication: any) => {
    // Extract medication code information
    const medicationCode = fhirMedication.code?.coding?.[0];
    const code = medicationCode?.code || '';
    const display = medicationCode?.display || '';
    const system = medicationCode?.system || '';

    // Extract form information (FHIR R4 property, may not exist in R5)
    const form = fhirMedication.form?.coding?.[0];
    const formCode = form?.code || '';
    const formDisplay = form?.display || '';
    const formSystem = form?.system || '';

    return {
      id: fhirMedication.id,
      code,
      display,
      system,
      status: fhirMedication.status || 'active',
      formCode,
      formDisplay,
      formSystem,
    } as Medication;
  },

  //* --------------------------------------------------------------------------
  mapToFhirMedication: (medication: Partial<Medication>) => {
    const fhirResource: FhirMedicationResource = {
      resourceType: 'Medication',
      code: {
        coding: [
          {
            system: medication.system || 'http://snomed.info/sct',
            code: medication.code || '',
            display: medication.display || '',
          }
        ]
      },
      status: medication.status || 'active',
    };

    // Add ID if it exists (for updates)
    if (medication.id) {
      fhirResource.id = medication.id;
    }

    // Add form if provided
    if (medication.formCode) {
      fhirResource.form = {
        coding: [
          {
            system: medication.formSystem || 'http://snomed.info/sct',
            code: medication.formCode,
            display: medication.formDisplay || '',
          }
        ]
      };
    }

    return fhirResource;
  },

  //* --------------------------------------------------------------------------
  mapFromFhirMedicationResource: (fhirResource: FhirMedicationResource) => {
    // Extract medication code information
    const medicationCode = fhirResource.code?.coding?.[0];
    const code = medicationCode?.code || '';
    const display = medicationCode?.display || '';
    const system = medicationCode?.system || '';

    // Extract form information
    const form = fhirResource.form?.coding?.[0];
    const formCode = form?.code || '';
    const formDisplay = form?.display || '';
    const formSystem = form?.system || '';

    return {
      id: fhirResource.id,
      code,
      display,
      system,
      status: fhirResource.status || 'active',
      formCode,
      formDisplay,
      formSystem,
    } as Medication;
  },

  //* --------------------------------------------------------------------------
  mapToFhirMedicationSortFields: (
    sortFields: string[],
    sortDirections: ('asc' | 'desc')[],
  ) => {
    const fieldNameMapping = {
      code: 'code',
      display: 'code',
      status: 'status',
      form: 'form',
    };

    return sortFields.map((field, index) => {
      const fieldName = get(fieldNameMapping, field) ?? field;
      return sortDirections[index] === 'asc' ? fieldName : `-${fieldName}`;
    });
  },

  //* --------------------------------------------------------------------------
  mapToFhirMedicationFilters: ({
    search,
    code,
    display,
    status,
    form,
    ...filters
  }: Partial<GetMedicationListRequest>) => {
    // Use search for both code and display searches
    const codeFilter = search || code;

    return {
      ...(codeFilter && { code: codeFilter }),
      ...(status && { status }),
      ...(form && { form }),
      ...filters,
    };
  },

  //* --------------------------------------------------------------------------
  //* Bundle Response Mapping
  //* --------------------------------------------------------------------------
  mapFromFhirBundle: (bundle: any) => {
    if (!bundle?.entry) {
      return [];
    }

    return bundle.entry.map((entry: any) =>
      MedicationMapperUtil.mapFromFhirMedicationResource(entry.resource)
    );
  },

  //* --------------------------------------------------------------------------
};

export default MedicationMapperUtil;