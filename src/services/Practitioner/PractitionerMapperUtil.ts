import type {
  FhirPractitioner,
  FhirPractitionerBundle,
  Practitioner,
  CreatePractitionerRequest,
  UpdatePractitionerRequest,
  PractitionerListResponse,
} from './PractitionerTypes';

/**
 * Utility class for mapping between FHIR Practitioner resources and application-specific types
 */
export class PractitionerMapperUtil {
  /**
   * Maps a FHIR Practitioner resource to application Practitioner type
   */
  static mapFhirPractitionerToPractitioner(fhirPractitioner: FhirPractitioner): Practitioner {
    // Extract name information
    const officialName = fhirPractitioner.name?.find(n => n.use === 'official') || fhirPractitioner.name?.[0];
    const fullName = officialName 
      ? `${officialName.prefix?.join(' ') || ''} ${officialName.given?.join(' ') || ''} ${officialName.family || ''}`.trim()
      : 'Unknown Practitioner';

    // Extract contact information
    const phoneContact = fhirPractitioner.telecom?.find(t => t.system === 'phone');
    const emailContact = fhirPractitioner.telecom?.find(t => t.system === 'email');

    // Extract address information
    const primaryAddress = fhirPractitioner.address?.find(a => a.use === 'home') || 
                          fhirPractitioner.address?.find(a => a.use === 'work') || 
                          fhirPractitioner.address?.[0];

    // Extract specialty from qualifications
    const primaryQualification = fhirPractitioner.qualification?.[0];
    const specialty = primaryQualification?.code?.coding?.[0]?.display || 
                     primaryQualification?.code?.text || 
                     'General';

    return {
      id: fhirPractitioner.id || '',
      name: fullName,
      gender: fhirPractitioner.gender || 'unknown',
      birthdate: fhirPractitioner.birthDate || '',
      contactNumber: phoneContact?.value || '',
      email: emailContact?.value || '',
      address: primaryAddress?.line?.join(', ') || '',
      city: primaryAddress?.city || '',
      state: primaryAddress?.state || '',
      postalCode: primaryAddress?.postalCode || '',
      country: primaryAddress?.country || '',
      practitionerId: fhirPractitioner.id || '',
      active: fhirPractitioner.active ?? true,
      specialty,
      qualifications: fhirPractitioner.qualification,
      lastUpdated: fhirPractitioner.meta?.lastUpdated,
    };
  }

  /**
   * Maps a FHIR Bundle response to PractitionerListResponse
   */
  static mapFhirBundleToPractitionerList(fhirBundle: FhirPractitionerBundle): PractitionerListResponse {
    const practitioners = fhirBundle.entry?.map(entry => 
      this.mapFhirPractitionerToPractitioner(entry.resource)
    ) || [];

    return {
      entry: practitioners,
      total: practitioners.length,
      hasNextPage: false, // TODO: Implement pagination logic based on bundle links
    };
  }

  /**
   * Maps a CreatePractitionerRequest to FHIR Practitioner resource
   */
  static mapCreateRequestToFhirPractitioner(request: CreatePractitionerRequest): FhirPractitioner {
    // Parse name into components
    const nameParts = request.name.trim().split(' ');
    const given = nameParts.slice(0, -1);
    const family = nameParts[nameParts.length - 1];

    const fhirPractitioner: FhirPractitioner = {
      resourceType: 'Practitioner',
      active: request.active,
      name: [
        {
          use: 'official',
          family: family,
          given: given.length > 0 ? given : undefined,
        }
      ],
      gender: request.gender,
      birthDate: request.birthdate,
    };

    // Add telecom if provided
    const telecom = [];
    if (request.contactNumber) {
      telecom.push({
        system: 'phone' as const,
        value: request.contactNumber,
        use: 'work' as const,
      });
    }
    if (request.email) {
      telecom.push({
        system: 'email' as const,
        value: request.email,
        use: 'work' as const,
      });
    }
    if (telecom.length > 0) {
      fhirPractitioner.telecom = telecom;
    }

    // Add address if provided
    if (request.address || request.city || request.state || request.postalCode || request.country) {
      fhirPractitioner.address = [
        {
          use: 'home',
          line: request.address ? [request.address] : undefined,
          city: request.city,
          state: request.state,
          postalCode: request.postalCode,
          country: request.country,
        }
      ];
    }

    // Add qualification if specialty is provided
    if (request.specialty) {
      fhirPractitioner.qualification = [
        {
          code: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0360',
                code: this.mapSpecialtyToCode(request.specialty),
                display: request.specialty,
              }
            ]
          },
          period: {
            start: new Date().toISOString().split('T')[0], // Current date
          },
          issuer: {
            display: 'Healthcare System',
          }
        }
      ];
    }

    return fhirPractitioner;
  }

  /**
   * Maps an UpdatePractitionerRequest to FHIR Practitioner resource
   */
  static mapUpdateRequestToFhirPractitioner(request: UpdatePractitionerRequest): FhirPractitioner {
    const fhirPractitioner = this.mapCreateRequestToFhirPractitioner(request);
    fhirPractitioner.id = request.id;
    return fhirPractitioner;
  }

  /**
   * Maps specialty display names to FHIR codes
   */
  private static mapSpecialtyToCode(specialty: string): string {
    const specialtyMap: Record<string, string> = {
      'Internal Medicine': 'IM',
      'Cardiology': 'CARD',
      'Emergency Medicine': 'EMER',
      'Family Medicine': 'FP',
      'Pediatrics': 'PD',
      'Surgery': 'SUR',
      'Orthopedics': 'ORT',
      'Neurology': 'NEUR',
      'Psychiatry': 'PSY',
      'Radiology': 'RAD',
      'Anesthesiology': 'ANES',
      'Pathology': 'PATH',
      'Medical Doctor': 'MD',
      'Certified Nurse Practitioner': 'CNP',
      'Registered Nurse': 'RN',
      'Physical Therapist': 'PT',
    };

    return specialtyMap[specialty] || 'GEN';
  }

  /**
   * Extracts search parameters for FHIR API calls
   */
  static mapSearchParamsToFhirParams(params: {
    search?: string;
    active?: boolean;
    specialty?: string;
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

    if (params.active !== undefined) {
      fhirParams.active = params.active.toString();
    }

    // TODO: Add specialty search when FHIR server supports qualification searches
    // if (params.specialty) {
    //   fhirParams.qualification = params.specialty;
    // }

    return fhirParams;
  }

  /**
   * Validates a practitioner object has required fields
   */
  static validatePractitioner(practitioner: Partial<CreatePractitionerRequest>): string[] {
    const errors: string[] = [];

    if (!practitioner.name?.trim()) {
      errors.push('Name is required');
    }

    if (!practitioner.gender) {
      errors.push('Gender is required');
    }

    if (!practitioner.birthdate) {
      errors.push('Birth date is required');
    }

    // Validate birth date format (YYYY-MM-DD)
    if (practitioner.birthdate && !/^\d{4}-\d{2}-\d{2}$/.test(practitioner.birthdate)) {
      errors.push('Birth date must be in YYYY-MM-DD format');
    }

    // Validate email format if provided
    if (practitioner.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(practitioner.email)) {
      errors.push('Email format is invalid');
    }

    return errors;
  }
}