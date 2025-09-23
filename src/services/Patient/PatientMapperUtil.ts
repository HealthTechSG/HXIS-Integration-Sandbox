import type {
  Patient,
  PatientAllergy,
  PatientNextOfKin,
  PatientRemarks,
  PatientImmunization,
  GetPatientListRequest,
  // CreatePatientRequest,
} from './PatientTypes';
import type {
  Patient as FhirPatient,
  Communication as FhirCommunication,
  AllergyIntolerance as FhirAllergy,
  RelatedPerson as FhirRelatedPerson,
  // Bundle as FhirBundle,
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
  mapFromFhirPatient: (fhirPatient: FhirPatient) => {
    // Extract address information from FHIR format
    const addressLines = fhirPatient.address?.[0]?.line || [];
    const address = addressLines.length > 0 ? addressLines.slice(0, 2).join(' ') : '';
    const postalCode = fhirPatient.address?.[0]?.postalCode || '';
    const country = fhirPatient.address?.[0]?.country || '';

    return {
      id: fhirPatient.id,
      mrn:
        fhirPatient.identifier?.find(
          (identifier) => identifier.use === 'usual',
        )?.value || fhirPatient.identifier?.[0]?.value || '',
      name: fhirPatient.name?.[0].text || '',
      active: fhirPatient.active ?? true,
      gender: fhirPatient.gender || '',
      birthdate: fhirPatient.birthDate,
      idType:
        fhirPatient.identifier?.find(
          (identifier) => identifier.use === 'official',
        )?.type?.text || '',
      idNumber:
        fhirPatient.identifier?.find(
          (identifier) => identifier.use === 'official',
        )?.value || fhirPatient.identifier?.[0]?.value || '',
      contactNumber:
        fhirPatient.telecom?.find((telecom) => telecom.system === 'phone')
          ?.value || '',
      email:
        fhirPatient.telecom?.find((telecom) => telecom.system === 'email')
          ?.value || '',
      address,
      postalCode,
      country,
    } as Patient;
  },

  //* --------------------------------------------------------------------------
  mapToFhirPatient: (patient: Partial<Patient>) =>
    ({
      resourceType: 'Patient',
      id: patient.id,
      identifier: [
        {
          use: 'official',
          type:{
            coding:[
              {
                system:"http://terminology.hl7.org/CodeSystem/v2-0203",
                code:"NI"
              }
            ],
            text: patient.idType
          },
          system: 'https://ica.gov.sg/nric', // TODO: find out the system of NRIC.
          value: patient.idNumber,
        },
        {
          use: 'usual',
          type:{
            coding:[
              {
                system:"http://terminology.hl7.org/CodeSystem/v2-0203",
                code:"MR"
              }
            ]
          },
          system: "https://yourhospital.com.sg/mrn", // TODO: find out the system of MRN.
          value: patient.mrn,
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
      telecom: [
        ...(patient.contactNumber
          ? [{ system: 'phone', value: patient.contactNumber }]
          : []),
        ...(patient.email ? [{ system: 'email', value: patient.email }] : []),
      ],
      ...(patient.address || patient.postalCode || patient.country
        ? {
            address: [
              {
                use: "home",
                ...(patient.postalCode && { postalCode: patient.postalCode }),
                ...(patient.country && { country: patient.country }),
                ...(patient.address && { 
                  line: patient.address.split(',').map(part => part.trim()).filter(part => part.length > 0)
                }),
              },
            ],
          }
        : {}),
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
};

export default FhirPatientMapperUtil;
