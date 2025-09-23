import type {
  Condition,
  FhirConditionResource,
  GetConditionListRequest,
} from './ConditionTypes';
import type { Condition as FhirCondition } from 'fhir/r5';
import { get } from 'lodash-es';

import { DateUtils } from '@/common/utils';

/**
 * Util functions for mapping FHIR Condition type to the UI type that we use.
 */
const ConditionMapperUtil = {
  //* --------------------------------------------------------------------------
  //* Condition
  //* --------------------------------------------------------------------------
  mapFromFhirCondition: (fhirCondition: FhirCondition) => {
    // Extract patient ID from reference
    const subjectReference = fhirCondition.subject?.reference || '';
    const patientId = subjectReference.startsWith('Patient/')
      ? subjectReference.substring(8)
      : subjectReference;

    // Extract clinical status
    const clinicalStatus = fhirCondition.clinicalStatus?.coding?.[0]?.code || '';

    // Extract verification status
    const verificationStatus = fhirCondition.verificationStatus?.coding?.[0]?.code || '';

    // Extract category
    const category = fhirCondition.category?.[0]?.coding?.[0]?.code || '';

    // Extract severity
    const severity = fhirCondition.severity?.coding?.[0]?.code || '';

    // Extract condition code information
    const conditionCode = fhirCondition.code?.coding?.[0];
    const code = conditionCode?.code || '';
    const display = conditionCode?.display || '';
    const system = conditionCode?.system || '';

    // Extract body site information
    const bodySite = fhirCondition.bodySite?.[0]?.coding?.[0];
    const bodySiteCode = bodySite?.code || '';
    const bodySiteDisplay = bodySite?.display || '';
    const bodySiteSystem = bodySite?.system || '';

    return {
      id: fhirCondition.id,
      patientId,
      clinicalStatus,
      verificationStatus,
      category,
      severity,
      code,
      display,
      system,
      bodySiteCode,
      bodySiteDisplay,
      bodySiteSystem,
      recordedDate: fhirCondition.recordedDate || '',
    } as Condition;
  },

  //* --------------------------------------------------------------------------
  mapToFhirCondition: (condition: Partial<Condition>) => {
    const fhirResource: FhirConditionResource = {
      resourceType: 'Condition',
      clinicalStatus: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
            code: condition.clinicalStatus || 'active',
            display: condition.clinicalStatus === 'active' ? 'Active' :
                    condition.clinicalStatus === 'recurrence' ? 'Recurrence' :
                    condition.clinicalStatus === 'relapse' ? 'Relapse' :
                    condition.clinicalStatus === 'inactive' ? 'Inactive' :
                    condition.clinicalStatus === 'remission' ? 'Remission' :
                    condition.clinicalStatus === 'resolved' ? 'Resolved' :
                    'Active',
          }
        ]
      },
      verificationStatus: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
            code: condition.verificationStatus || 'confirmed',
            display: condition.verificationStatus === 'unconfirmed' ? 'Unconfirmed' :
                    condition.verificationStatus === 'provisional' ? 'Provisional' :
                    condition.verificationStatus === 'differential' ? 'Differential' :
                    condition.verificationStatus === 'confirmed' ? 'Confirmed' :
                    condition.verificationStatus === 'refuted' ? 'Refuted' :
                    condition.verificationStatus === 'entered-in-error' ? 'Entered in Error' :
                    'Confirmed',
          }
        ]
      },
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/condition-category',
              code: condition.category || 'encounter-diagnosis',
              display: condition.category === 'problem-list-item' ? 'Problem List Item' :
                      condition.category === 'encounter-diagnosis' ? 'Encounter Diagnosis' :
                      'Encounter Diagnosis',
            }
          ]
        }
      ],
      code: {
        coding: [
          {
            system: condition.system || 'http://snomed.info/sct',
            code: condition.code || '',
            display: condition.display || '',
          }
        ]
      },
      subject: {
        reference: `Patient/${condition.patientId}`,
      },
      recordedDate: (condition.recordedDate
        ? DateUtils.formatDateForFhir(condition.recordedDate)
        : DateUtils.formatDateForFhir(new Date())) as string,
    };

    // Add ID if it exists (for updates)
    if (condition.id) {
      fhirResource.id = condition.id;
    }

    // Add severity if provided
    if (condition.severity) {
      fhirResource.severity = {
        coding: [
          {
            system: 'http://snomed.info/sct',
            code: condition.severity,
            display: condition.severity === '255604002' ? 'Mild' :
                    condition.severity === '6736007' ? 'Moderate' :
                    condition.severity === '24484000' ? 'Severe' :
                    'Mild',
          }
        ]
      };
    }

    // Add body site if provided
    if (condition.bodySiteCode) {
      fhirResource.bodySite = [
        {
          coding: [
            {
              system: condition.bodySiteSystem || 'http://snomed.info/sct',
              code: condition.bodySiteCode,
              display: condition.bodySiteDisplay || '',
            }
          ]
        }
      ];
    }

    return fhirResource;
  },

  //* --------------------------------------------------------------------------
  mapFromFhirConditionResource: (fhirResource: FhirConditionResource) => {
    // Extract patient ID from reference
    const subjectReference = fhirResource.subject?.reference || '';
    const patientId = subjectReference.startsWith('Patient/')
      ? subjectReference.substring(8)
      : subjectReference;

    // Extract clinical status
    const clinicalStatus = fhirResource.clinicalStatus?.coding?.[0]?.code || '';

    // Extract verification status
    const verificationStatus = fhirResource.verificationStatus?.coding?.[0]?.code || '';

    // Extract category
    const category = fhirResource.category?.[0]?.coding?.[0]?.code || '';

    // Extract severity
    const severity = fhirResource.severity?.coding?.[0]?.code || '';

    // Extract condition code information
    const conditionCode = fhirResource.code?.coding?.[0];
    const code = conditionCode?.code || '';
    const display = conditionCode?.display || '';
    const system = conditionCode?.system || '';

    // Extract body site information
    const bodySite = fhirResource.bodySite?.[0]?.coding?.[0];
    const bodySiteCode = bodySite?.code || '';
    const bodySiteDisplay = bodySite?.display || '';
    const bodySiteSystem = bodySite?.system || '';

    return {
      id: fhirResource.id,
      patientId,
      clinicalStatus,
      verificationStatus,
      category,
      severity,
      code,
      display,
      system,
      bodySiteCode,
      bodySiteDisplay,
      bodySiteSystem,
      recordedDate: fhirResource.recordedDate || '',
    } as Condition;
  },

  //* --------------------------------------------------------------------------
  mapToFhirConditionSortFields: (
    sortFields: string[],
    sortDirections: ('asc' | 'desc')[],
  ) => {
    const fieldNameMapping = {
      recordedDate: 'recorded-date',
      clinicalStatus: 'clinical-status',
      verificationStatus: 'verification-status',
      category: 'category',
      severity: 'severity',
      code: 'code',
    };

    return sortFields.map((field, index) => {
      const fieldName = get(fieldNameMapping, field) ?? field;
      return sortDirections[index] === 'asc' ? fieldName : `-${fieldName}`;
    });
  },

  //* --------------------------------------------------------------------------
  mapToFhirConditionFilters: ({
    patientId,
    search,
    clinicalStatus,
    verificationStatus,
    category,
    severity,
    ...filters
  }: Partial<GetConditionListRequest>) => {
    return {
      ...(patientId && { patient: patientId }),
      ...(search && { code: search }),
      ...(clinicalStatus && { 'clinical-status': clinicalStatus }),
      ...(verificationStatus && { 'verification-status': verificationStatus }),
      ...(category && { category }),
      ...(severity && { severity }),
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
      ConditionMapperUtil.mapFromFhirConditionResource(entry.resource)
    );
  },

  //* --------------------------------------------------------------------------
};

export default ConditionMapperUtil;