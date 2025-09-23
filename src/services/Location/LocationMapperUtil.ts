import type {
  FhirLocation,
  FhirLocationBundle,
  FhirLocationTelecom,
  Location,
  CreateLocationRequest,
  UpdateLocationRequest,
  LocationListResponse,
} from './LocationTypes';

/**
 * Utility class for mapping between FHIR Location resources and application-specific types
 */
export class LocationMapperUtil {
  /**
   * Maps a FHIR Location resource to application Location type
   */
  static mapFhirLocationToLocation(fhirLocation: FhirLocation): Location {
    // Extract contact information
    const phoneContact = fhirLocation.telecom?.find(t => t.system === 'phone');
    const emailContact = fhirLocation.telecom?.find(t => t.system === 'email');

    // Extract address information
    const {address} = fhirLocation;

    return {
      id: fhirLocation.id || '',
      name: fhirLocation.name || '',
      status: fhirLocation.status,
      alias: fhirLocation.alias || [],
      description: fhirLocation.description || '',
      contactNumber: phoneContact?.value || '',
      email: emailContact?.value || '',
      address: address?.line?.join(', ') || '',
      city: address?.city || '',
      postalCode: address?.postalCode || '',
      country: address?.country || '',
      longitude: fhirLocation.position?.longitude,
      latitude: fhirLocation.position?.latitude,
      altitude: fhirLocation.position?.altitude,
      hoursOfOperation: fhirLocation.hoursOfOperation || [],
      lastUpdated: fhirLocation.meta?.lastUpdated,
    };
  }

  /**
   * Maps a FHIR Bundle response to LocationListResponse
   */
  static mapFhirBundleToLocationList(fhirBundle: FhirLocationBundle): LocationListResponse {
    const locations = fhirBundle.entry?.map(entry => 
      this.mapFhirLocationToLocation(entry.resource)
    ) || [];

    return {
      entry: locations,
      total: locations.length,
      hasNextPage: false, // TODO: Implement pagination logic based on bundle links
    };
  }

  /**
   * Maps a CreateLocationRequest to FHIR Location resource
   */
  static mapCreateRequestToFhirLocation(request: CreateLocationRequest): FhirLocation {
    const fhirLocation: FhirLocation = {
      resourceType: 'Location',
      name: request.name,
      status: request.status,
      alias: request.alias && request.alias.length > 0 ? request.alias : undefined,
      description: request.description,
      mode: 'instance',
    };

    // Add telecom if provided
    const telecom: FhirLocationTelecom[] = [];
    if (request.contactNumber) {
      telecom.push({
        system: 'phone',
        value: request.contactNumber,
        use: 'work',
      });
    }
    if (request.email) {
      telecom.push({
        system: 'email',
        value: request.email,
        use: 'work',
      });
    }
    if (telecom.length > 0) {
      fhirLocation.telecom = telecom;
    }

    // Add address if provided
    if (request.address || request.city || request.postalCode || request.country) {
      fhirLocation.address = {
        line: request.address ? [request.address] : undefined,
        city: request.city,
        postalCode: request.postalCode,
        country: request.country,
      };
    }

    // Add position if provided
    if (request.longitude !== undefined && request.latitude !== undefined) {
      fhirLocation.position = {
        longitude: request.longitude,
        latitude: request.latitude,
        altitude: request.altitude,
      };
    }


    // Add hours of operation if provided
    if (request.hoursOfOperation && request.hoursOfOperation.length > 0) {
      fhirLocation.hoursOfOperation = request.hoursOfOperation;
    }

    return fhirLocation;
  }

  /**
   * Maps an UpdateLocationRequest to FHIR Location resource
   */
  static mapUpdateRequestToFhirLocation(request: UpdateLocationRequest): FhirLocation {
    const fhirLocation = this.mapCreateRequestToFhirLocation(request);
    fhirLocation.id = request.id;
    return fhirLocation;
  }


  /**
   * Extracts search parameters for FHIR API calls
   */
  static mapSearchParamsToFhirParams(params: {
    search?: string;
    status?: 'active' | 'suspended' | 'inactive';
    pageSize?: number;
  }): Record<string, string> {
    const fhirParams: Record<string, string> = {};

    if (params.pageSize) {
      fhirParams._count = params.pageSize.toString();
    }

    if (params.search) {
      // Search across name fields
      fhirParams.name = params.search;
    }

    if (params.status !== undefined) {
      fhirParams.status = params.status;
    }

    return fhirParams;
  }

  /**
   * Validates a location object has required fields
   */
  static validateLocation(location: Partial<CreateLocationRequest>): string[] {
    const errors: string[] = [];

    if (!location.name?.trim()) {
      errors.push('Name is required');
    }

    if (!location.status) {
      errors.push('Status is required');
    }

    // Validate coordinates if provided
    if (location.longitude !== undefined && (location.longitude < -180 || location.longitude > 180)) {
      errors.push('Longitude must be between -180 and 180');
    }

    if (location.latitude !== undefined && (location.latitude < -90 || location.latitude > 90)) {
      errors.push('Latitude must be between -90 and 90');
    }

    // Validate email format if provided
    if (location.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(location.email)) {
      errors.push('Email format is invalid');
    }

    return errors;
  }
}