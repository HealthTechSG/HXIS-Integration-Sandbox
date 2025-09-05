import type { DomainResource, Reference } from 'fhir/r5';

export type FhirEducation = DomainResource & {
  subject: Reference;
  institute: Reference;
  study: string;
  graduatedBoolean: boolean;
  graduatedDate: string;
};
