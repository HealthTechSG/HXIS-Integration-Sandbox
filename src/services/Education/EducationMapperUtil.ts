import type { Education } from './EducationTypes';
import type { FhirEducation } from './FhirEducationTypes';

import { DateUtils } from '@/common/utils';

/**
 * Util functions for mapping FHIR patient type to the UI type that we use.
 */
const EducationMapperUtil = {
  //* --------------------------------------------------------------------------
  //* Patient
  //* --------------------------------------------------------------------------
  mapFromFhirEducation: (fhirEducation: FhirEducation) =>
    ({
      id: fhirEducation.id,
      subject: fhirEducation.subject.display || '',
      institute: fhirEducation.institute.display || '',
      study: fhirEducation.study || '',
      graduateDate: fhirEducation.graduatedDate
        ? fhirEducation.graduatedDate
        : undefined,
    }) as Education,

  //* --------------------------------------------------------------------------
  mapToFhirEducation: (education: Partial<Education>) =>
    ({
      resourceType: 'Education',
      id: education.id,
      subject: {
        display: education.subject,
      },
      institute: {
        display: education.institute,
      },
      study: education.study,
      graduatedBoolean: education.graduateDate ? undefined : false,
      graduatedDate: education.graduateDate
        ? DateUtils.formatDateForFhir(education.graduateDate)
        : undefined,
    }) as FhirEducation,

  //* --------------------------------------------------------------------------
};

export default EducationMapperUtil;
