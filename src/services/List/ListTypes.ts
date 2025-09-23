import { Dayjs } from 'dayjs';

//* FHIR List Types ----------------------------------------------------------------

export interface FhirListCoding {
  system: string;
  code: string;
  display: string;
}

export interface FhirListCodeableConcept {
  coding: FhirListCoding[];
  text?: string;
}

export interface FhirListReference {
  reference: string;
  type?: string;
  identifier?: {
    use?: string;
    type?: FhirListCodeableConcept;
    system?: string;
    value?: string;
  };
  display?: string;
}

export interface FhirListEntry {
  flag?: FhirListCodeableConcept;
  deleted?: boolean;
  date?: string;
  item: FhirListReference;
}

export interface FhirListMeta {
  versionId?: string;
  lastUpdated?: string;
  source?: string;
  profile?: string[];
  security?: FhirListCoding[];
  tag?: FhirListCoding[];
}

export interface FhirList {
  resourceType: 'List';
  id?: string;
  meta?: FhirListMeta;
  implicitRules?: string;
  language?: string;
  text?: {
    status: string;
    div: string;
  };
  contained?: any[];
  extension?: any[];
  modifierExtension?: any[];
  identifier?: {
    use?: string;
    type?: FhirListCodeableConcept;
    system?: string;
    value?: string;
    period?: {
      start?: string;
      end?: string;
    };
    assigner?: FhirListReference;
  }[];
  status: 'current' | 'retired' | 'entered-in-error';
  mode: 'working' | 'snapshot' | 'changes';
  title?: string;
  code?: FhirListCodeableConcept;
  subject?: FhirListReference;
  encounter?: FhirListReference;
  date?: string;
  source?: FhirListReference;
  orderedBy?: FhirListCodeableConcept;
  note?: {
    authorReference?: FhirListReference;
    authorString?: string;
    time?: string;
    text: string;
  }[];
  entry?: FhirListEntry[];
  emptyReason?: FhirListCodeableConcept;
}

export interface FhirListResource extends FhirList {
  id?: string;
  meta: FhirListMeta;
}

export interface FhirListBundleEntry {
  fullUrl?: string;
  resource: FhirListResource;
  search?: {
    mode: string;
    score?: number;
  };
  request?: {
    method: string;
    url: string;
    ifNoneMatch?: string;
    ifModifiedSince?: string;
    ifMatch?: string;
    ifNoneExist?: string;
  };
  response?: {
    status: string;
    location?: string;
    etag?: string;
    lastModified?: string;
    outcome?: any;
  };
}

export interface FhirListBundle {
  resourceType: 'Bundle';
  id: string;
  meta: {
    lastUpdated: string;
  };
  type: 'searchset' | 'collection' | 'transaction' | 'transaction-response' | 'batch' | 'batch-response' | 'history' | 'document';
  link?: Array<{
    relation: string;
    url: string;
  }>;
  entry?: FhirListBundleEntry[];
  total?: number;
}

//* Application-specific List Types -----------------------------------------------

export interface ListEntry {
  reference: string;
  type?: string;
  display?: string;
  deleted?: boolean;
  date?: string | Dayjs;
}

export interface List {
  id: string;
  status: 'current' | 'retired' | 'entered-in-error';
  mode: 'working' | 'snapshot' | 'changes';
  title: string;
  code: string;
  codeDisplay: string;
  codeSystem: string;
  subject: string; // Patient reference
  date: string | Dayjs;
  source?: string; // Practitioner reference
  entries: ListEntry[];
  note?: string;
}

export interface CreateListRequest {
  status: 'current' | 'retired' | 'entered-in-error';
  mode: 'working' | 'snapshot' | 'changes';
  title: string;
  code: string;
  codeDisplay: string;
  codeSystem?: string;
  subject: string; // Patient ID
  date?: string | Dayjs;
  source?: string; // Practitioner ID
  entries: ListEntry[];
  note?: string;
}

export interface UpdateListRequest extends CreateListRequest {
  id: string;
}

//* API Query Parameters ----------------------------------------------------------

export interface GetListParams {
  patient?: string;
  code?: string;
  status?: string;
  title?: string;
  date?: string;
  page?: number;
  pageSize?: number;
}

export interface SearchListsRequest {
  patient?: string;
  code?: string;
  status?: string;
  title?: string;
  subject?: string;
  page?: number;
  pageSize?: number;
}

//* API Response Types ------------------------------------------------------------

export interface SearchResourceResult<T> {
  entry: T[];
  total?: number;
  hasNextPage?: boolean;
}

export interface ListResponse {
  entry: List[];
  total: number;
  hasNextPage?: boolean;
}

//* List Code Options -------------------------------------------------------------
export const LIST_STATUS_OPTIONS = [
  { value: 'current', label: 'Current' },
  { value: 'retired', label: 'Retired' },
  { value: 'entered-in-error', label: 'Entered in Error' },
] as const;

export const LIST_MODE_OPTIONS = [
  { value: 'working', label: 'Working' },
  { value: 'snapshot', label: 'Snapshot' },
  { value: 'changes', label: 'Changes' },
] as const;

export const LIST_CODE_OPTIONS = [
  {
    value: 'alerts',
    label: 'Alerts',
    system: 'https://r4.fhir.space/codesystem-list-example-codes.html'
  },
  {
    value: 'adverserxns',
    label: 'Adverse Reactions',
    system: 'https://r4.fhir.space/codesystem-list-example-codes.html'
  },
  {
    value: 'allergies',
    label: 'Allergies',
    system: 'https://r4.fhir.space/codesystem-list-example-codes.html'
  },
  {
    value: 'medications',
    label: 'Medication List',
    system: 'https://r4.fhir.space/codesystem-list-example-codes.html'
  },
  {
    value: 'problems',
    label: 'Problem List',
    system: 'https://r4.fhir.space/codesystem-list-example-codes.html'
  },
  {
    value: 'worklist',
    label: 'Worklist',
    system: 'https://r4.fhir.space/codesystem-list-example-codes.html'
  },
  {
    value: 'waiting',
    label: 'Waiting List',
    system: 'https://r4.fhir.space/codesystem-list-example-codes.html'
  },
  {
    value: 'protocols',
    label: 'Protocols',
    system: 'https://r4.fhir.space/codesystem-list-example-codes.html'
  },
  {
    value: 'plans',
    label: 'Care Plans',
    system: 'https://r4.fhir.space/codesystem-list-example-codes.html'
  },
] as const;

//* Common List Templates ---------------------------------------------------------
export const COMMON_LIST_TEMPLATES = [
  {
    title: 'Current Allergy List',
    code: 'allergies',
    codeDisplay: 'Allergies',
    status: 'current' as const,
    mode: 'working' as const,
  },
  {
    title: 'Current Problem List',
    code: 'problems',
    codeDisplay: 'Problem List',
    status: 'current' as const,
    mode: 'working' as const,
  },
  {
    title: 'Current Medication List',
    code: 'medications',
    codeDisplay: 'Medication List',
    status: 'current' as const,
    mode: 'working' as const,
  },
  {
    title: 'Current Care Plans',
    code: 'plans',
    codeDisplay: 'Care Plans',
    status: 'current' as const,
    mode: 'working' as const,
  },
  {
    title: 'Adverse Reactions List',
    code: 'adverserxns',
    codeDisplay: 'Adverse Reactions',
    status: 'current' as const,
    mode: 'working' as const,
  },
] as const;

export type ListCode = typeof LIST_CODE_OPTIONS[number]['value'];
export type ListStatus = typeof LIST_STATUS_OPTIONS[number]['value'];
export type ListMode = typeof LIST_MODE_OPTIONS[number]['value'];