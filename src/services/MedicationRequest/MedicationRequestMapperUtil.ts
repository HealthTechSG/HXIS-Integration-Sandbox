import type {
  MedicationRequest,
  FhirMedicationRequestResource,
  GetMedicationRequestListRequest,
} from './MedicationRequestTypes';
import { get } from 'lodash-es';

import { DateUtils } from '@/common/utils';

/**
 * Util functions for mapping FHIR MedicationRequest type to the UI type that we use.
 */
const MedicationRequestMapperUtil = {
  //* --------------------------------------------------------------------------
  //* MedicationRequest
  //* --------------------------------------------------------------------------
  mapFromFhirMedicationRequest: (fhirMedicationRequest: any) => {
    // Extract medication reference information (FHIR R5 uses medication.reference)
    const medicationReference = (fhirMedicationRequest.medicationReference || fhirMedicationRequest.medication);
    const medicationId = medicationReference?.reference?.startsWith('Medication/')
      ? medicationReference.reference.substring(11)
      : medicationReference?.reference || '';
    const medicationDisplay = medicationReference?.display || '';

    // Extract patient reference
    const patientReference = fhirMedicationRequest.subject?.reference || '';
    const patientId = patientReference.startsWith('Patient/')
      ? patientReference.substring(8)
      : patientReference;

    // Extract practitioner reference
    const practitionerReference = fhirMedicationRequest.requester?.reference || '';
    const practitionerId = practitionerReference.startsWith('Practitioner/')
      ? practitionerReference.substring(13)
      : practitionerReference;

    // Extract dosage instruction information
    const dosageInstruction = fhirMedicationRequest.dosageInstruction?.[0];
    const dosageInstructionText = dosageInstruction?.text || '';
    const dosageInstructionSequence = dosageInstruction?.sequence || 1;

    return {
      id: fhirMedicationRequest.id,
      status: fhirMedicationRequest.status || 'draft',
      intent: fhirMedicationRequest.intent || 'order',
      medicationId,
      medicationDisplay,
      patientId,
      practitionerId,
      authoredOn: fhirMedicationRequest.authoredOn || '',
      dosageInstructionText,
      dosageInstructionSequence,
    } as MedicationRequest;
  },

  //* --------------------------------------------------------------------------
  mapToFhirMedicationRequest: (medicationRequest: Partial<MedicationRequest>) => {
    const authoredOnValue = medicationRequest.authoredOn
      ? DateUtils.formatDateForFhir(medicationRequest.authoredOn)
      : DateUtils.formatDateForFhir(new Date());

    const fhirResource: FhirMedicationRequestResource = {
      resourceType: 'MedicationRequest',
      status: medicationRequest.status || 'draft',
      intent: medicationRequest.intent || 'order',
      medicationReference: {
        reference: `Medication/${medicationRequest.medicationId}`,
        display: medicationRequest.medicationDisplay || '',
      },
      subject: {
        reference: `Patient/${medicationRequest.patientId}`,
      },
      requester: {
        reference: `Practitioner/${medicationRequest.practitionerId}`,
      },
      dosageInstruction: [
        {
          sequence: medicationRequest.dosageInstructionSequence || 1,
          text: medicationRequest.dosageInstructionText || 'Take as directed',
        }
      ],
    };

    // Add authoredOn if it's a valid string
    if (authoredOnValue && typeof authoredOnValue === 'string') {
      fhirResource.authoredOn = authoredOnValue;
    }

    // Add ID if it exists (for updates)
    if (medicationRequest.id) {
      fhirResource.id = medicationRequest.id;
    }

    return fhirResource;
  },

  //* --------------------------------------------------------------------------
  mapFromFhirMedicationRequestResource: (fhirResource: FhirMedicationRequestResource) => {
    // Extract medication reference information
    const medicationReference = fhirResource.medicationReference;
    const medicationId = medicationReference?.reference?.startsWith('Medication/')
      ? medicationReference.reference.substring(11)
      : medicationReference?.reference || '';
    const medicationDisplay = medicationReference?.display || '';

    // Extract patient reference
    const patientReference = fhirResource.subject?.reference || '';
    const patientId = patientReference.startsWith('Patient/')
      ? patientReference.substring(8)
      : patientReference;

    // Extract practitioner reference
    const practitionerReference = fhirResource.requester?.reference || '';
    const practitionerId = practitionerReference.startsWith('Practitioner/')
      ? practitionerReference.substring(13)
      : practitionerReference;

    // Extract dosage instruction information
    const dosageInstruction = fhirResource.dosageInstruction?.[0];
    const dosageInstructionText = dosageInstruction?.text || '';
    const dosageInstructionSequence = dosageInstruction?.sequence || 1;

    return {
      id: fhirResource.id,
      status: fhirResource.status || 'draft',
      intent: fhirResource.intent || 'order',
      medicationId,
      medicationDisplay,
      patientId,
      practitionerId,
      authoredOn: fhirResource.authoredOn || '',
      dosageInstructionText,
      dosageInstructionSequence,
    } as MedicationRequest;
  },

  //* --------------------------------------------------------------------------
  mapToFhirMedicationRequestSortFields: (
    sortFields: string[],
    sortDirections: ('asc' | 'desc')[],
  ) => {
    const fieldNameMapping = {
      authoredOn: 'authored-on',
      status: 'status',
      intent: 'intent',
      medicationId: 'medication',
      patientId: 'patient',
      practitionerId: 'requester',
    };

    return sortFields.map((field, index) => {
      const fieldName = get(fieldNameMapping, field) ?? field;
      return sortDirections[index] === 'asc' ? fieldName : `-${fieldName}`;
    });
  },

  //* --------------------------------------------------------------------------
  mapToFhirMedicationRequestFilters: ({
    search,
    patientId,
    status,
    intent,
    medicationId,
    practitionerId,
    authoredOn,
    ...filters
  }: Partial<GetMedicationRequestListRequest>) => {
    return {
      ...(patientId && { patient: patientId }),
      ...(search && { medication: search }),
      ...(status && { status }),
      ...(intent && { intent }),
      ...(medicationId && { medication: medicationId }),
      ...(practitionerId && { requester: practitionerId }),
      ...(authoredOn && { 'authored-on': DateUtils.formatDateForFhir(authoredOn) }),
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
      MedicationRequestMapperUtil.mapFromFhirMedicationRequestResource(entry.resource)
    );
  },

  //* --------------------------------------------------------------------------
};

export default MedicationRequestMapperUtil;