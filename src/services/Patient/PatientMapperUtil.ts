import type {
  Patient,
  PatientAllergy,
  PatientNextOfKin,
  PatientRemarks,
  PatientImmunization,
  GetPatientListRequest,
  CreatePatientRequest,
} from './PatientTypes';
import type {
  Patient as FhirPatient,
  Communication as FhirCommunication,
  AllergyIntolerance as FhirAllergy,
  RelatedPerson as FhirRelatedPerson,
  Bundle as FhirBundle,
  Immunization as FhirImmunization,
} from 'fhir/r5';
import { isEmpty, get } from 'lodash-es';

import { DateUtils } from '@/common/utils';

/**
 * Util functions for mapping FHIR patient type to the UI type that we use.
 */
const FhirPatientMapperUtil = {
  //* --------------------------------------------------------------------------
  //* Patient
  //* --------------------------------------------------------------------------
  // TODO: Map all properly.
  mapFromFhirPatient: (fhirPatient: FhirPatient) =>
    ({
      id: fhirPatient.id,
      mrn:
        fhirPatient.identifier?.find(
          (identifier) => identifier.use === 'official',
        )?.value || '',
      name: fhirPatient.name?.[0].text || '',
      active: fhirPatient.active ?? true,
      gender: fhirPatient.gender || '',
      birthdate: fhirPatient.birthDate,
      maritalStatus: fhirPatient.maritalStatus?.text || '',
      idType:
        fhirPatient.identifier?.find(
          (identifier) => identifier.use === 'secondary',
        )?.system || '',
      idNumber:
        fhirPatient.identifier?.find(
          (identifier) => identifier.use === 'secondary',
        )?.value || '',
      contactNumber:
        fhirPatient.telecom?.find((telecom) => telecom.system === 'phone')
          ?.value || '',
      email:
        fhirPatient.telecom?.find((telecom) => telecom.system === 'email')
          ?.value || '',
    }) as Patient,

  //* --------------------------------------------------------------------------
  mapToFhirPatient: (patient: Partial<Patient>) =>
    ({
      resourceType: 'Patient',
      id: patient.id,
      identifier: [
        {
          use: 'official',
          system: 'http://example.org/MRN', // TODO: find out the system of MRN.
          value: patient.mrn,
        },
        {
          use: 'secondary',
          system: patient.idType,
          value: patient.idNumber,
        },
      ],
      name: [
        {
          text: patient.name,
        },
      ],
      active: patient.active,
      gender: patient.gender,
      birthDate: patient.birthdate
        ? DateUtils.formatDateForFhir(patient.birthdate)
        : undefined,
      maritalStatus: {
        text: patient.maritalStatus,
      },
      telecom: [
        ...(patient.contactNumber
          ? [{ system: 'phone', value: patient.contactNumber }]
          : []),
        ...(patient.email ? [{ system: 'email', value: patient.email }] : []),
      ],
    }) as FhirPatient,

  //* --------------------------------------------------------------------------
  mapToFhirPatientSortFields: (
    sortFields: string[],
    sortDirections: ('asc' | 'desc')[],
  ) => {
    // TODO: FHIR Engine very buggy when sorting one-to-many references...
    // This is unused for now.
    // See FHIR Nexus Bug - https://dev.azure.com/IHIS-HIP/SEED%20InnerSource/_workitems/edit/237870/
    // Another bug - https://dev.azure.com/IHIS-HIP/SEED%20InnerSource/_workitems/edit/237922/
    const fieldNameMapping = {
      mrn: 'identifier',
      contactNumber: 'telecom',
    };

    return sortFields.map((field, index) => {
      const fieldName = get(fieldNameMapping, field) ?? field;
      return sortDirections[index] === 'asc' ? fieldName : `-${fieldName}`;
    });
  },

  //* --------------------------------------------------------------------------
  mapToFhirPatientFilters: ({
    birthdate,
    contactNumber,
    mrn,
    search,
    ...filters
  }: Partial<GetPatientListRequest>) => {
    // TODO: FHIR does not support 'OR' queries natively.
    // This we must add custom params into the FHIR server.
    // For now, we either use the SEARCH field or use the MRN in the advancd filter.
    const identifier = isEmpty(search) ? mrn : search;

    return {
      ...(isEmpty(identifier) ? {} : { identifier }),
      phone: contactNumber,
      birthdate: birthdate ? DateUtils.formatDateForFhir(birthdate) : undefined,
      ...filters,
    };
  },

  //* --------------------------------------------------------------------------
  //* Patient Allergy (use AllergyIntolerance as the resource)
  //* --------------------------------------------------------------------------
  mapFromFhirAllergy: (fhirAllergy: FhirAllergy) =>
    ({
      id: fhirAllergy.id,
      patientId: fhirAllergy.patient?.id || '',
      name: fhirAllergy.code?.text || '',
      description: fhirAllergy.reaction?.[0].description || '',
      type: fhirAllergy.type?.coding?.[0]?.code || '',
      category: fhirAllergy.category?.[0] || '',
      severity: fhirAllergy.reaction?.[0].severity || '',
      recordedDate: fhirAllergy.recordedDate,
      note: fhirAllergy.reaction?.[0].note?.[0].text || '',
    }) as PatientAllergy,

  //* --------------------------------------------------------------------------
  mapToFhirAllergy: (patientAllergy: Partial<PatientAllergy>) =>
    ({
      resourceType: 'AllergyIntolerance',
      id: patientAllergy.id,
      patient: {
        reference: `Patient/${patientAllergy.patientId}`,
      },
      code: {
        text: patientAllergy.name,
      },
      reaction: [
        {
          manifestation: [
            {
              concept: {
                text: 'Manifestation', // TODO: Hardcoded. Is there a better way?
              },
            },
          ],
          description: isEmpty(patientAllergy.description)
            ? undefined
            : patientAllergy.description,
          severity: patientAllergy.severity,
          note: isEmpty(patientAllergy.note)
            ? undefined
            : [{ text: patientAllergy.note }],
        },
      ],
      type: {
        coding: [
          {
            code: patientAllergy.type,
          },
        ],
      },
      category: [patientAllergy.category],
      recordedDate: patientAllergy.recordedDate
        ? DateUtils.formatDateForFhir(patientAllergy.recordedDate)
        : undefined,
    }) as FhirAllergy,

  //* --------------------------------------------------------------------------
  //* Patient Next-of-Kin (use RelatedPerson as the resource)
  //* --------------------------------------------------------------------------
  mapFromFhirRelatedPerson: (fhirRelatedPerson: FhirRelatedPerson) =>
    ({
      id: fhirRelatedPerson.id,
      patientId: fhirRelatedPerson.patient?.id || '',
      name: fhirRelatedPerson.name?.[0].text || '',
      relationship: fhirRelatedPerson.relationship?.[0].text || '',
      contactNumber: fhirRelatedPerson.telecom?.[0].value || '',
    }) as PatientNextOfKin,

  //* --------------------------------------------------------------------------
  mapToFhirRelatedPerson: (patientNextOfKin: Partial<PatientNextOfKin>) =>
    ({
      resourceType: 'RelatedPerson',
      id: patientNextOfKin.id,
      patient: {
        reference: `Patient/${patientNextOfKin.patientId}`,
      },
      name: [
        {
          text: patientNextOfKin.name,
        },
      ],
      relationship: [
        {
          text: patientNextOfKin.relationship,
        },
      ],
      telecom: [
        {
          system: 'phone',
          value: patientNextOfKin.contactNumber,
        },
      ],
    }) as FhirRelatedPerson,

  //* --------------------------------------------------------------------------
  //* Patient Remarks (Use Communication as the resource)
  //* --------------------------------------------------------------------------
  mapFromFhirCommunication: (fhirCommunication: FhirCommunication) =>
    ({
      id: fhirCommunication.id,
      patientId: fhirCommunication.subject?.id || '',
      remarks: fhirCommunication.note?.[0].text || '',
    }) as PatientRemarks,

  //* --------------------------------------------------------------------------
  mapToFhirCommunication: (patientRemarks: Partial<PatientRemarks>) =>
    ({
      resourceType: 'Communication',
      id: patientRemarks.id,
      status: 'completed',
      subject: {
        reference: `Patient/${patientRemarks.patientId}`,
      },
      note: [
        {
          text: patientRemarks.remarks,
        },
      ],
    }) as FhirCommunication,

  //* --------------------------------------------------------------------------
  //* Patient Immunization (Use Immunization as the resource)
  //* --------------------------------------------------------------------------
  mapFromFhirImmunization: (fhirData: FhirImmunization) =>
    ({
      id: fhirData.id,
      patientId: fhirData.patient?.id || '',
      name: fhirData.vaccineCode?.text || '',
      productName: fhirData.administeredProduct?.concept?.text || '',
      manufacturerName: fhirData.manufacturer?.concept?.text || '',
      lotNumber: fhirData.lotNumber || '',
      vaccineDate: fhirData.occurrenceDateTime,
      informationSource: fhirData.informationSource?.concept?.text || '',
      note: fhirData.note?.[0]?.text || '',
      reaction: fhirData.reaction?.[0]?.manifestation?.concept?.text || '',
      reactionDate: fhirData.reaction?.[0]?.date || '',
    }) as PatientImmunization,

  //* --------------------------------------------------------------------------
  mapToFhirImmunization: (data: Partial<PatientImmunization>) =>
    ({
      resourceType: 'Immunization',
      id: data.id,
      status: 'completed',
      vaccineCode: { text: data.name },
      patient: { reference: `Patient/${data.patientId}` },
      administeredProduct: {
        concept: { text: data.productName },
      },
      manufacturer: {
        concept: { text: data.manufacturerName },
      },
      lotNumber: isEmpty(data.lotNumber) ? undefined : data.lotNumber,
      occurrenceDateTime: DateUtils.formatDateForFhir(data.vaccineDate),
      informationSource: {
        concept: { text: data.informationSource },
      },
      note: isEmpty(data.note) ? undefined : [{ text: data.note }],
      reaction: isEmpty(data.reaction)
        ? undefined
        : [
            {
              date: DateUtils.formatDateForFhir(data.reactionDate),
              manifestation: {
                concept: { text: data.reaction },
              },
            },
          ],
    }) as FhirImmunization,

  //* --------------------------------------------------------------------------
  //* Create Patient Request
  //* --------------------------------------------------------------------------
  mapCreatePatientRequestToFhirBundle: (request: CreatePatientRequest) => {
    const { allergies = [], nextOfKins = [], patient, remarks = [] } = request;

    // Placeholder for the new patient id.
    const NEW_PATIENT_URN = 'urn:uuid:new-patient-id';

    // Return the Bundle
    return {
      resourceType: 'Bundle',
      type: 'transaction',
      id: 'bundle-transaction',
      entry: [
        {
          // Main Patient Record
          fullUrl: NEW_PATIENT_URN,
          resource: FhirPatientMapperUtil.mapToFhirPatient(patient),
          request: { method: 'POST', url: 'Patient' },
        },
        // Allergy list
        ...allergies.map((allergy) => ({
          resource: {
            ...FhirPatientMapperUtil.mapToFhirAllergy(allergy),
            patient: { reference: NEW_PATIENT_URN },
          },
          request: { method: 'POST', url: 'AllergyIntolerance' },
        })),
        // Next of kin list
        ...nextOfKins.map((nextOfKin) => ({
          resource: {
            ...FhirPatientMapperUtil.mapToFhirRelatedPerson(nextOfKin),
            patient: { reference: NEW_PATIENT_URN },
          },
          request: { method: 'POST', url: 'RelatedPerson' },
        })),
        // Remarks
        ...remarks.map((remarks) => ({
          resource: {
            ...FhirPatientMapperUtil.mapToFhirCommunication(remarks),
            subject: { reference: NEW_PATIENT_URN },
          },
          request: { method: 'POST', url: 'Communication' },
        })),
      ],
    } as FhirBundle;
  },

  //* --------------------------------------------------------------------------
  mapCreatePatientResponseFromFhirBundle: (response: FhirBundle) => {
    const fhirPatient = response.entry?.find(
      (row) => row.resource?.resourceType === 'Patient',
    )?.resource as FhirPatient;

    return FhirPatientMapperUtil.mapFromFhirPatient(fhirPatient);
  },

  //* --------------------------------------------------------------------------
};

export default FhirPatientMapperUtil;
