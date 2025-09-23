// FHIR Location Types based on FHIR R4B specification matching the actual API
export interface FhirLocationTelecom {
  system: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
  value: string;
  use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
}

export interface FhirLocationAddress {
  use?: 'home' | 'work' | 'temp' | 'old' | 'billing';
  type?: 'postal' | 'physical' | 'both';
  line?: string[];
  city?: string;
  district?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface FhirLocationPosition {
  longitude: number;
  latitude: number;
  altitude?: number;
}

export interface FhirLocationHoursOfOperation {
  daysOfWeek: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  allDay: boolean;
  openingTime?: string;
  closingTime?: string;
}

export interface FhirLocationTypeCoding {
  system?: string;
  code?: string;
  display?: string;
}

export interface FhirLocationTypeCode {
  coding?: FhirLocationTypeCoding[];
  text?: string;
}

export interface FhirLocationIdentifier {
  use?: string;
  type?: {
    coding?: FhirLocationTypeCoding[];
    text?: string;
  };
  system?: string;
  value?: string;
}

export interface FhirLocationMeta {
  versionId?: string;
  lastUpdated?: string;
}

// Core FHIR Location Resource matching the actual API schema
export interface FhirLocation {
  resourceType: 'Location';
  id?: string;
  meta?: FhirLocationMeta;
  identifier?: FhirLocationIdentifier[];
  status: 'active' | 'suspended' | 'inactive';
  name: string;
  alias?: string[];
  description?: string;
  mode?: 'instance' | 'kind';
  type?: FhirLocationTypeCode[];
  telecom?: FhirLocationTelecom[];
  address?: FhirLocationAddress;
  physicalType?: {
    coding?: FhirLocationTypeCoding[];
    text?: string;
  };
  position?: FhirLocationPosition;
  managingOrganization?: {
    reference?: string;
    display?: string;
  };
  partOf?: {
    reference?: string;
    display?: string;
  };
  hoursOfOperation?: FhirLocationHoursOfOperation[];
  availabilityExceptions?: string;
  endpoint?: Array<{
    reference?: string;
    display?: string;
  }>;
}

// FHIR Bundle Response for Location search
export interface FhirLocationBundleEntry {
  fullUrl?: string;
  resource: FhirLocation;
  search?: {
    mode: string;
  };
}

export interface FhirLocationBundle {
  resourceType: 'Bundle';
  id: string;
  meta: {
    lastUpdated: string;
  };
  type: 'searchset';
  link?: Array<{
    relation: string;
    url: string;
  }>;
  entry?: FhirLocationBundleEntry[];
}

// Application-specific Location types
export interface Location {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'inactive';
  alias?: string[];
  description?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  longitude?: number;
  latitude?: number;
  altitude?: number;
  hoursOfOperation?: FhirLocationHoursOfOperation[];
  lastUpdated?: string;
}

// Request types for API calls
export interface CreateLocationRequest {
  name: string;
  status: 'active' | 'suspended' | 'inactive';
  alias?: string[];
  description?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  longitude?: number;
  latitude?: number;
  altitude?: number;
  hoursOfOperation?: FhirLocationHoursOfOperation[];
}

export interface UpdateLocationRequest extends CreateLocationRequest {
  id: string;
}

// API Query Parameters
export interface GetLocationListParams {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: 'active' | 'suspended' | 'inactive';
}

// API Response types
export interface LocationListResponse {
  entry: Location[];
  total?: number;
  hasNextPage?: boolean;
}

export interface LocationResponse extends Location {}