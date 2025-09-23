import type {
  Observation,
  ObservationComponent,
  GetObservationListRequest,
} from './ObservationTypes';
import type {
  Observation as FhirObservation,
  Bundle as FhirBundle,
} from 'fhir/r5';
import { get } from 'lodash-es';

import { DateUtils } from '@/common/utils';

/**
 * Util functions for mapping FHIR observation type to the UI type that we use.
 */
const FhirObservationMapperUtil = {
  //* --------------------------------------------------------------------------
  //* Observation
  //* --------------------------------------------------------------------------
  mapFromFhirObservation: (fhirObservation: FhirObservation) => {
    // Extract patient ID from subject reference
    const patientId = fhirObservation.subject?.reference?.replace('Patient/', '') || '';
    
    // Extract category
    const category = fhirObservation.category?.[0]?.coding?.[0]?.code || '';
    
    // Extract code and display
    const code = fhirObservation.code?.coding?.[0]?.code || '';
    const display = fhirObservation.code?.coding?.[0]?.display || '';
    const text = fhirObservation.code?.text || display;
    
    // Extract value and unit
    let value: number | undefined;
    let unit: string | undefined;
    
    if (fhirObservation.valueQuantity) {
      value = fhirObservation.valueQuantity.value;
      unit = fhirObservation.valueQuantity.unit;
    }
    
    // Extract interpretation
    const interpretation = fhirObservation.interpretation?.[0]?.coding?.[0]?.display || 
                          fhirObservation.interpretation?.[0]?.text;
    
    // Extract reference range
    const referenceRange = fhirObservation.referenceRange?.[0];
    const referenceRangeLow = referenceRange?.low?.value;
    const referenceRangeHigh = referenceRange?.high?.value;
    
    // Extract components for blood pressure
    const components: ObservationComponent[] = [];
    if (fhirObservation.component && fhirObservation.component.length > 0) {
      fhirObservation.component.forEach((comp) => {
        if (comp.code && comp.valueQuantity) {
          components.push({
            code: comp.code.coding?.[0]?.code || '',
            display: comp.code.coding?.[0]?.display || '',
            value: comp.valueQuantity.value || 0,
            unit: comp.valueQuantity.unit || '',
            interpretation: comp.interpretation?.[0]?.coding?.[0]?.display || 
                           comp.interpretation?.[0]?.text,
          });
        }
      });
    }
    
    return {
      id: fhirObservation.id,
      patientId,
      status: fhirObservation.status || 'final',
      category,
      code,
      display,
      text,
      effectiveDateTime: fhirObservation.effectiveDateTime || '',
      value,
      unit,
      interpretation,
      referenceRangeLow,
      referenceRangeHigh,
      components: components.length > 0 ? components : undefined,
    } as Observation;
  },

  //* --------------------------------------------------------------------------
  mapToFhirObservation: (observation: Partial<Observation>) => {
    const fhirObservation: FhirObservation = {
      resourceType: 'Observation',
      id: observation.id,
      status: (observation.status as any) || 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: observation.category || 'vital-signs',
              display: observation.category === 'vital-signs' ? 'Vital Signs' : observation.category,
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: observation.code,
            display: observation.display,
          },
        ],
        text: observation.text || observation.display,
      },
      subject: {
        reference: `Patient/${observation.patientId}`,
      },
      effectiveDateTime: observation.effectiveDateTime != null
        ? (DateUtils.formatDateForFhir(observation.effectiveDateTime as any) as string)
        : undefined,
    };

    // Add value quantity if present
    if (observation.value !== undefined && observation.unit) {
      fhirObservation.valueQuantity = {
        value: observation.value,
        unit: observation.unit,
        system: 'http://unitsofmeasure.org',
        code: FhirObservationMapperUtil.getUcumCode(observation.unit),
      };
    }

    // Add interpretation if present
    if (observation.interpretation) {
      fhirObservation.interpretation = [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
              code: FhirObservationMapperUtil.getInterpretationCode(observation.interpretation),
              display: observation.interpretation,
            },
          ],
          text: observation.interpretation,
        },
      ];
    }

    // Add reference range if present
    if (observation.referenceRangeLow !== undefined || observation.referenceRangeHigh !== undefined) {
      fhirObservation.referenceRange = [
        {
          ...(observation.referenceRangeLow !== undefined && {
            low: {
              value: observation.referenceRangeLow,
              unit: observation.unit,
              system: 'http://unitsofmeasure.org',
              code: FhirObservationMapperUtil.getUcumCode(observation.unit),
            },
          }),
          ...(observation.referenceRangeHigh !== undefined && {
            high: {
              value: observation.referenceRangeHigh,
              unit: observation.unit,
              system: 'http://unitsofmeasure.org',
              code: FhirObservationMapperUtil.getUcumCode(observation.unit),
            },
          }),
        },
      ];
    }

    // Add components for blood pressure
    if (observation.components && observation.components.length > 0) {
      fhirObservation.component = observation.components.map((comp) => ({
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: comp.code,
              display: comp.display,
            },
          ],
        },
        valueQuantity: {
          value: comp.value,
          unit: comp.unit,
          system: 'http://unitsofmeasure.org',
          code: FhirObservationMapperUtil.getUcumCode(comp.unit),
        },
        ...(comp.interpretation && {
          interpretation: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
                  code: FhirObservationMapperUtil.getInterpretationCode(comp.interpretation),
                  display: comp.interpretation,
                },
              ],
              text: comp.interpretation,
            },
          ],
        }),
      }));
    }

    return fhirObservation;
  },

  //* --------------------------------------------------------------------------
  mapToFhirObservationSortFields: (
    sortFields: string[],
    sortDirections: ('asc' | 'desc')[],
  ) => {
    const fieldNameMapping = {
      effectiveDateTime: 'date',
      code: 'code',
      status: 'status',
    };

    return sortFields.map((field, index) => {
      const fieldName = get(fieldNameMapping, field) ?? field;
      return sortDirections[index] === 'asc' ? fieldName : `-${fieldName}`;
    });
  },

  //* --------------------------------------------------------------------------
  mapToFhirObservationFilters: ({
    category,
    code,
    effectiveDateTime,
    patient,
    patientId,
    search,
    status,
    _count,
    ...filters
  }: Partial<GetObservationListRequest>) => {
    // Use either patient or patientId for filtering
    const patientFilter = patient || patientId;

    return {
      ...(patientFilter && { patient: patientFilter }),
      ...(status && { status }),
      ...(category && { category }),
      ...(code && { code }),
      ...(effectiveDateTime && { 
        date: DateUtils.formatDateForFhir(effectiveDateTime) 
      }),
      ...(search && { code: search }), // Search by code for now
      ...(_count && { _count }),
      ...filters,
    };
  },

  //* --------------------------------------------------------------------------
  //* Helper functions
  //* --------------------------------------------------------------------------
  getUcumCode: (unit?: string): string => {
    if (!unit) return '';
    
    const unitMapping: Record<string, string> = {
      'beats/minute': '/min',
      'breaths/minute': '/min',
      'mmHg': 'mm[Hg]',
      '%': '%',
      'C': 'Cel',
      'kg': 'kg',
      'm': 'm',
      'kg/m2': 'kg/m2',
      'meter': 'm',
    };
    
    return unitMapping[unit] || unit;
  },

  //* --------------------------------------------------------------------------
  getInterpretationCode: (interpretation?: string): string => {
    if (!interpretation) return '';
    
    const interpretationMapping: Record<string, string> = {
      'Normal': 'N',
      'High': 'H',
      'Low': 'L',
      'Critical': 'C',
      'Below low normal': 'L',
      'Above high normal': 'H',
      'normal': 'N',
      'high': 'H',
      'low': 'L',
      'critical': 'C',
    };
    
    return interpretationMapping[interpretation] || 'N';
  },

  //* --------------------------------------------------------------------------
  extractVitalSignsFromBundle: (fhirBundle: FhirBundle): Record<string, Observation> => {
    const vitalSigns: Record<string, Observation> = {};
    
    if (fhirBundle.entry) {
      fhirBundle.entry.forEach((entry) => {
        if (entry.resource?.resourceType === 'Observation') {
          const observation = FhirObservationMapperUtil.mapFromFhirObservation(entry.resource as FhirObservation);
          
          // Map vital signs by code
          switch (observation.code) {
            case '8867-4': // Heart rate
              vitalSigns.heartRate = observation;
              break;
            case '85354-9': // Blood pressure
              vitalSigns.bloodPressure = observation;
              break;
            case '2708-6': // Oxygen saturation
              vitalSigns.satO2 = observation;
              break;
            case '8310-5': // Temperature
              vitalSigns.temperature = observation;
              break;
            case '9279-1': // Respiratory rate
              vitalSigns.respiratoryRate = observation;
              break;
            case '29463-7': // Weight
              vitalSigns.weight = observation;
              break;
            case '8302-2': // Height
              vitalSigns.height = observation;
              break;
            case '39156-5': // BMI
              vitalSigns.bmi = observation;
              break;
            default:
              // Store other observations by code
              vitalSigns[observation.code] = observation;
          }
        }
      });
    }
    
    return vitalSigns;
  },

  //* --------------------------------------------------------------------------
};

export default FhirObservationMapperUtil;