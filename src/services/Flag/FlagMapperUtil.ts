import type {
  Flag,
  FhirFlagResource,
  GetFlagListRequest,
} from './FlagTypes';
import type { Flag as FhirFlag } from 'fhir/r5';
import { get } from 'lodash-es';

import { DateUtils } from '@/common/utils';

/**
 * Util functions for mapping FHIR Flag type to the UI type that we use.
 */
const FlagMapperUtil = {
  //* --------------------------------------------------------------------------
  //* Flag
  //* --------------------------------------------------------------------------
  mapFromFhirFlag: (fhirFlag: FhirFlag) => {
    // Extract patient ID from subject reference
    const subjectReference = fhirFlag.subject?.reference || '';
    const subject = subjectReference.startsWith('Patient/')
      ? subjectReference.substring(8)
      : subjectReference;

    // Extract author ID from author reference
    const authorReference = fhirFlag.author?.reference || '';
    const author = authorReference.startsWith('Practitioner/')
      ? authorReference.substring(13)
      : authorReference;

    // Extract category information
    const category = fhirFlag.category?.[0]?.coding?.[0];
    const categoryCode = category?.code || '';
    const categoryDisplay = category?.display || '';
    const categorySystem = category?.system || 'http://terminology.hl7.org/CodeSystem/flag-category';

    // Extract flag code information
    const flagCode = fhirFlag.code?.coding?.[0];
    const code = flagCode?.code || '';
    const display = flagCode?.display || '';
    const system = flagCode?.system || 'http://snomed.info/sct';

    return {
      id: fhirFlag.id,
      status: fhirFlag.status,
      categoryCode,
      categoryDisplay,
      categorySystem,
      code,
      display,
      system,
      subject,
      periodStart: fhirFlag.period?.start || '',
      periodEnd: fhirFlag.period?.end,
      author,
    } as Flag;
  },

  //* --------------------------------------------------------------------------
  mapToFhirFlag: (flag: Partial<Flag>) => {
    const fhirResource: FhirFlagResource = {
      resourceType: 'Flag',
      status: flag.status || 'active',
      category: [
        {
          coding: [
            {
              system: flag.categorySystem || 'http://terminology.hl7.org/CodeSystem/flag-category',
              code: flag.categoryCode || '',
              display: flag.categoryDisplay || '',
            }
          ]
        }
      ],
      code: {
        coding: [
          {
            system: flag.system || 'http://snomed.info/sct',
            code: flag.code || '',
            display: flag.display || '',
          }
        ]
      },
      subject: {
        reference: `Patient/${flag.subject}`,
      },
      period: {
        start: flag.periodStart
          ? DateUtils.formatDateForFhir(flag.periodStart) as string
          : DateUtils.formatDateForFhir(new Date()) as string,
        ...(flag.periodEnd && {
          end: DateUtils.formatDateForFhir(flag.periodEnd) as string
        }),
      },
      author: {
        reference: `Practitioner/${flag.author}`,
      },
    };

    // Add ID if it exists (for updates)
    if (flag.id) {
      fhirResource.id = flag.id;
    }

    return fhirResource;
  },

  //* --------------------------------------------------------------------------
  mapFromFhirFlagResource: (fhirResource: FhirFlagResource) => {
    // Extract patient ID from subject reference
    const subjectReference = fhirResource.subject?.reference || '';
    const subject = subjectReference.startsWith('Patient/')
      ? subjectReference.substring(8)
      : subjectReference;

    // Extract author ID from author reference
    const authorReference = fhirResource.author?.reference || '';
    const author = authorReference.startsWith('Practitioner/')
      ? authorReference.substring(13)
      : authorReference;

    // Extract category information
    const category = fhirResource.category?.[0]?.coding?.[0];
    const categoryCode = category?.code || '';
    const categoryDisplay = category?.display || '';
    const categorySystem = category?.system || 'http://terminology.hl7.org/CodeSystem/flag-category';

    // Extract flag code information
    const flagCode = fhirResource.code?.coding?.[0];
    const code = flagCode?.code || '';
    const display = flagCode?.display || '';
    const system = flagCode?.system || 'http://snomed.info/sct';

    return {
      id: fhirResource.id,
      status: fhirResource.status,
      categoryCode,
      categoryDisplay,
      categorySystem,
      code,
      display,
      system,
      subject,
      periodStart: fhirResource.period?.start || '',
      periodEnd: fhirResource.period?.end,
      author,
    } as Flag;
  },

  //* --------------------------------------------------------------------------
  mapToFhirFlagSortFields: (
    sortFields: string[],
    sortDirections: ('asc' | 'desc')[],
  ) => {
    const fieldNameMapping = {
      periodStart: 'date',
      status: 'status',
      category: 'category',
      code: 'code',
      subject: 'patient',
      author: 'author',
    };

    return sortFields.map((field, index) => {
      const fieldName = get(fieldNameMapping, field) ?? field;
      return sortDirections[index] === 'asc' ? fieldName : `-${fieldName}`;
    });
  },

  //* --------------------------------------------------------------------------
  mapToFhirFlagFilters: ({
    patientId,
    search,
    status,
    category,
    code,
    author,
    ...filters
  }: Partial<GetFlagListRequest>) => {
    return {
      ...(patientId && { patient: patientId }),
      ...(search && { identifier: search }),
      ...(status && { status }),
      ...(category && { category }),
      ...(code && { code }),
      ...(author && { author }),
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
      FlagMapperUtil.mapFromFhirFlagResource(entry.resource)
    );
  },

  //* --------------------------------------------------------------------------
  //* Validation
  //* --------------------------------------------------------------------------
  validateFlag: (flag: Partial<Flag>): string[] => {
    const errors: string[] = [];

    if (!flag.status) {
      errors.push('Status is required');
    }

    if (!flag.categoryCode || flag.categoryCode.trim().length === 0) {
      errors.push('Category is required');
    }

    if (!flag.code || flag.code.trim().length === 0) {
      errors.push('Code is required');
    }

    if (!flag.subject || flag.subject.trim().length === 0) {
      errors.push('Subject (Patient ID) is required');
    }

    if (!flag.author || flag.author.trim().length === 0) {
      errors.push('Author (Practitioner ID) is required');
    }

    if (!flag.periodStart) {
      errors.push('Period start date is required');
    }

    return errors;
  },

  //* --------------------------------------------------------------------------
  //* Utility Functions
  //* --------------------------------------------------------------------------
  getCategoryDisplayFromCode: (categoryCode: string): string => {
    const categoryMap: Record<string, string> = {
      'diet': 'Diet',
      'drug': 'Drug',
      'lab': 'Lab',
      'admin': 'Administrative',
      'contact': 'Subject',
      'clinical': 'Clinical',
      'behavioral': 'Behavioral',
      'research': 'Research',
      'advance-directive': 'Advance Directive',
      'safety': 'Safety',
    };

    return categoryMap[categoryCode] || categoryCode;
  },

  getStatusDisplayFromCode: (statusCode: string): string => {
    const statusMap: Record<string, string> = {
      'active': 'Active',
      'inactive': 'Inactive',
      'entered-in-error': 'Entered in Error',
    };

    return statusMap[statusCode] || statusCode;
  },
};

export default FlagMapperUtil;