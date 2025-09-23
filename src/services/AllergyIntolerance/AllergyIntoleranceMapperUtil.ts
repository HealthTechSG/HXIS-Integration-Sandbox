import type {
  AllergyIntolerance,
  FhirAllergyIntoleranceResource,
  GetAllergyIntoleranceListRequest,
} from './AllergyIntoleranceTypes';
import type { AllergyIntolerance as FhirAllergyIntolerance } from 'fhir/r5';
import { get } from 'lodash-es';

import { DateUtils } from '@/common/utils';

/**
 * Util functions for mapping FHIR AllergyIntolerance type to the UI type that we use.
 */
const AllergyIntoleranceMapperUtil = {
  //* --------------------------------------------------------------------------
  //* AllergyIntolerance
  //* --------------------------------------------------------------------------
  mapFromFhirAllergyIntolerance: (fhirAllergyIntolerance: FhirAllergyIntolerance) => {
    // Extract patient ID from reference
    const patientReference = fhirAllergyIntolerance.patient?.reference || '';
    const patientId = patientReference.startsWith('Patient/') 
      ? patientReference.substring(8) 
      : patientReference;

    // Extract clinical status
    const clinicalStatus = fhirAllergyIntolerance.clinicalStatus?.coding?.[0]?.code || '';
    
    // Extract verification status
    const verificationStatus = fhirAllergyIntolerance.verificationStatus?.coding?.[0]?.code || '';

    // Extract allergy/intolerance code information
    const allergyCode = fhirAllergyIntolerance.code?.coding?.[0];
    const code = allergyCode?.code || '';
    const display = allergyCode?.display || fhirAllergyIntolerance.code?.text || '';
    const system = allergyCode?.system || '';

    // Extract note
    const note = fhirAllergyIntolerance.note?.[0]?.text || '';

    return {
      id: fhirAllergyIntolerance.id,
      patientId,
      clinicalStatus,
      verificationStatus,
      type: fhirAllergyIntolerance.type || '',
      category: fhirAllergyIntolerance.category || [],
      criticality: fhirAllergyIntolerance.criticality || '',
      code,
      display,
      system,
      recordedDate: fhirAllergyIntolerance.recordedDate || '',
      note,
    } as AllergyIntolerance;
  },

  //* --------------------------------------------------------------------------
  mapToFhirAllergyIntolerance: (allergyIntolerance: Partial<AllergyIntolerance>) => {
    const fhirResource: FhirAllergyIntoleranceResource = {
      resourceType: 'AllergyIntolerance',
      clinicalStatus: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
            code: allergyIntolerance.clinicalStatus || 'active',
            display: allergyIntolerance.clinicalStatus === 'active' ? 'Active' :
                    allergyIntolerance.clinicalStatus === 'inactive' ? 'Inactive' :
                    allergyIntolerance.clinicalStatus === 'resolved' ? 'Resolved' :
                    'Active',
          }
        ]
      },
      verificationStatus: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
            code: allergyIntolerance.verificationStatus || 'unconfirmed',
            display: allergyIntolerance.verificationStatus === 'unconfirmed' ? 'Unconfirmed' :
                    allergyIntolerance.verificationStatus === 'confirmed' ? 'Confirmed' :
                    allergyIntolerance.verificationStatus === 'refuted' ? 'Refuted' :
                    allergyIntolerance.verificationStatus === 'entered-in-error' ? 'Entered in Error' :
                    'Unconfirmed',
          }
        ]
      },
      type: allergyIntolerance.type || 'allergy',
      category: allergyIntolerance.category || ['food'],
      criticality: allergyIntolerance.criticality || 'low',
      code: {
        coding: [
          {
            system: allergyIntolerance.system || 'http://snomed.info/sct',
            code: allergyIntolerance.code || '',
            display: allergyIntolerance.display || '',
          }
        ]
      },
      patient: {
        reference: `Patient/${allergyIntolerance.patientId}`,
      },
      recordedDate: (allergyIntolerance.recordedDate 
        ? DateUtils.formatDateForFhir(allergyIntolerance.recordedDate)
        : DateUtils.formatDateForFhir(new Date())) as string,
      note: allergyIntolerance.note 
        ? [{ text: allergyIntolerance.note }]
        : [],
    };

    // Add ID if it exists (for updates)
    if (allergyIntolerance.id) {
      fhirResource.id = allergyIntolerance.id;
    }

    return fhirResource;
  },

  //* --------------------------------------------------------------------------
  mapFromFhirAllergyIntoleranceResource: (fhirResource: FhirAllergyIntoleranceResource) => {
    // Extract patient ID from reference
    const patientReference = fhirResource.patient?.reference || '';
    const patientId = patientReference.startsWith('Patient/') 
      ? patientReference.substring(8) 
      : patientReference;

    // Extract clinical status
    const clinicalStatus = fhirResource.clinicalStatus?.coding?.[0]?.code || '';
    
    // Extract verification status
    const verificationStatus = fhirResource.verificationStatus?.coding?.[0]?.code || '';

    // Extract allergy/intolerance code information
    const allergyCode = fhirResource.code?.coding?.[0];
    const code = allergyCode?.code || '';
    const display = allergyCode?.display || '';
    const system = allergyCode?.system || '';

    // Extract note
    const note = fhirResource.note?.[0]?.text || '';

    return {
      id: fhirResource.id,
      patientId,
      clinicalStatus,
      verificationStatus,
      type: fhirResource.type || '',
      category: fhirResource.category || [],
      criticality: fhirResource.criticality || '',
      code,
      display,
      system,
      recordedDate: fhirResource.recordedDate || '',
      note,
    } as AllergyIntolerance;
  },

  //* --------------------------------------------------------------------------
  mapToFhirAllergyIntoleranceSortFields: (
    sortFields: string[],
    sortDirections: ('asc' | 'desc')[],
  ) => {
    const fieldNameMapping = {
      recordedDate: 'date',
      clinicalStatus: 'clinical-status',
      verificationStatus: 'verification-status',
      type: 'type',
      category: 'category',
      criticality: 'criticality',
    };

    return sortFields.map((field, index) => {
      const fieldName = get(fieldNameMapping, field) ?? field;
      return sortDirections[index] === 'asc' ? fieldName : `-${fieldName}`;
    });
  },

  //* --------------------------------------------------------------------------
  mapToFhirAllergyIntoleranceFilters: ({
    patientId,
    search,
    clinicalStatus,
    verificationStatus,
    type,
    category,
    criticality,
    ...filters
  }: Partial<GetAllergyIntoleranceListRequest>) => {
    return {
      ...(patientId && { patient: patientId }),
      ...(search && { identifier: search }),
      ...(clinicalStatus && { 'clinical-status': clinicalStatus }),
      ...(verificationStatus && { 'verification-status': verificationStatus }),
      ...(type && { type }),
      ...(category && { category }),
      ...(criticality && { criticality }),
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
      AllergyIntoleranceMapperUtil.mapFromFhirAllergyIntoleranceResource(entry.resource)
    );
  },

  //* --------------------------------------------------------------------------
};

export default AllergyIntoleranceMapperUtil;