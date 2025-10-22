import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  FhirPractitioner,
  FhirPractitionerBundle,
  Practitioner,
  CreatePractitionerRequest,
  UpdatePractitionerRequest,
  GetPractitionerListParams,
  PractitionerListResponse,
} from './PractitionerTypes';
import { PractitionerMapperUtil } from './PractitionerMapperUtil';

/**
 * RTK Query API for Practitioner FHIR operations
 */
export const PractitionerApi = createApi({
  reducerPath: 'practitionerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_FHIR_API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('x-api-key', import.meta.env.VITE_FHIR_API_KEY || '');
      return headers;
    },
  }),
  tagTypes: ['Practitioner', 'PractitionerList'],
  endpoints: (builder) => ({
    /**
     * Get list of practitioners with optional filtering
     */
    getPractitionerList: builder.query<PractitionerListResponse, GetPractitionerListParams>({
      query: (params: GetPractitionerListParams) => {
        const fhirParams: Record<string, any> = PractitionerMapperUtil.mapSearchParamsToFhirParams({
          search: params.search,
          active: params.active,
          specialty: params.specialty,
          pageSize: params.pageSize || 100,
        });

        // Add count parameter if provided
        if (params.count !== undefined) {
          fhirParams._count = params.count;
        }

        console.log('🔍 [PractitionerService] Fetching practitioner list with params:', fhirParams);

        // Convert params to URLSearchParams for form encoding
        const searchParams = new URLSearchParams();
        Object.entries(fhirParams).forEach(([key, value]) => {
          searchParams.append(key, value);
        });

        return {
          url: '/Practitioner/_search',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: searchParams.toString(),
        };
      },
      transformResponse: (response: FhirPractitionerBundle): PractitionerListResponse => {
        console.log('📦 [PractitionerService] Raw FHIR Bundle response:', response);
        const mappedResponse = PractitionerMapperUtil.mapFhirBundleToPractitionerList(response);
        console.log('🎯 [PractitionerService] Mapped practitioner list:', mappedResponse);
        return mappedResponse;
      },
      providesTags: (result?: PractitionerListResponse) => [
        'PractitionerList',
        ...(result?.entry || []).map((practitioner: Practitioner) => ({ type: 'Practitioner' as const, id: practitioner.id })),
      ],
    }),

    /**
     * Get a single practitioner by ID
     */
    getPractitionerById: builder.query<Practitioner, string>({
      query: (id: string) => {
        console.log('🔍 [PractitionerService] Fetching practitioner by ID:', id);
        return {
          url: `/Practitioner/${id}`,
          method: 'GET',
        };
      },
      transformResponse: (response: FhirPractitioner): Practitioner => {
        console.log('📦 [PractitionerService] Raw FHIR Practitioner response:', response);
        const mappedResponse = PractitionerMapperUtil.mapFhirPractitionerToPractitioner(response);
        console.log('🎯 [PractitionerService] Mapped practitioner:', mappedResponse);
        return mappedResponse;
      },
      providesTags: (_result, _error, id) => [{ type: 'Practitioner', id }],
    }),

    /**
     * Create a new practitioner
     */
    createPractitioner: builder.mutation<Practitioner, CreatePractitionerRequest>({
      query: (practitionerData: CreatePractitionerRequest) => {
        // Validate the request data
        const validationErrors = PractitionerMapperUtil.validatePractitioner(practitionerData);
        if (validationErrors.length > 0) {
          throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
        }

        const fhirPractitioner = PractitionerMapperUtil.mapCreateRequestToFhirPractitioner(practitionerData);
        console.log('➕ [PractitionerService] Creating practitioner with FHIR data:', fhirPractitioner);

        return {
          url: '/Practitioner',
          method: 'POST',
          body: JSON.stringify(fhirPractitioner),
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      transformResponse: (response: FhirPractitioner): Practitioner => {
        console.log('📦 [PractitionerService] Created practitioner response:', response);
        const mappedResponse = PractitionerMapperUtil.mapFhirPractitionerToPractitioner(response);
        console.log('🎯 [PractitionerService] Mapped created practitioner:', mappedResponse);
        return mappedResponse;
      },
      invalidatesTags: ['PractitionerList'],
    }),

    /**
     * Update an existing practitioner
     */
    updatePractitioner: builder.mutation<Practitioner, UpdatePractitionerRequest>({
      query: (practitionerData: UpdatePractitionerRequest) => {
        // Validate the request data
        const validationErrors = PractitionerMapperUtil.validatePractitioner(practitionerData);
        if (validationErrors.length > 0) {
          throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
        }

        const fhirPractitioner = PractitionerMapperUtil.mapUpdateRequestToFhirPractitioner(practitionerData);
        console.log('✏️ [PractitionerService] Updating practitioner with FHIR data:', fhirPractitioner);

        return {
          url: `/Practitioner/${practitionerData.id}`,
          method: 'PUT',
          body: JSON.stringify(fhirPractitioner),
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      transformResponse: (response: FhirPractitioner): Practitioner => {
        console.log('📦 [PractitionerService] Updated practitioner response:', response);
        const mappedResponse = PractitionerMapperUtil.mapFhirPractitionerToPractitioner(response);
        console.log('🎯 [PractitionerService] Mapped updated practitioner:', mappedResponse);
        return mappedResponse;
      },
      invalidatesTags: (_result, _error, { id }) => [
        'PractitionerList',
        { type: 'Practitioner', id },
      ],
    }),

    /**
     * Delete a practitioner (sets active to false)
     */
    deletePractitioner: builder.mutation<void, string>({
      query: (id: string) => {
        console.log('🗑️ [PractitionerService] Soft deleting practitioner:', id);
        
        // First fetch the practitioner to get current data
        return {
          url: `/Practitioner/${id}`,
          method: 'GET',
        };
      },
      transformResponse: async (response: FhirPractitioner, _meta: any, id: string) => {
        // Set active to false and update
        const updatedPractitioner = {
          ...response,
          active: false,
        };

        console.log('🗑️ [PractitionerService] Setting practitioner inactive:', updatedPractitioner);

        // Make the update call
        // Note: This is a simplified approach. In a real implementation, 
        // you might want to use a separate endpoint or handle this differently.
        await fetch(`${process.env.VITE_FHIR_API_BASE_URL}/Practitioner/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.VITE_FHIR_API_KEY || '',
          },
          body: JSON.stringify(updatedPractitioner),
        });

        return;
      },
      invalidatesTags: (_result, _error, id) => [
        'PractitionerList',
        { type: 'Practitioner', id },
      ],
    }),

    /**
     * Search practitioners by name or other criteria
     */
    searchPractitioners: builder.query<PractitionerListResponse, { query: string; limit?: number }>({
      query: ({ query, limit = 20 }: { query: string; limit?: number }) => {
        console.log('🔍 [PractitionerService] Searching practitioners with query:', query);
        
        const searchParams = new URLSearchParams();
        searchParams.append('name', query);
        searchParams.append('_count', limit.toString());
        searchParams.append('active', 'true');

        return {
          url: '/Practitioner/_search',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: searchParams.toString(),
        };
      },
      transformResponse: (response: FhirPractitionerBundle): PractitionerListResponse => {
        console.log('📦 [PractitionerService] Search response:', response);
        const mappedResponse = PractitionerMapperUtil.mapFhirBundleToPractitionerList(response);
        console.log('🎯 [PractitionerService] Mapped search results:', mappedResponse);
        return mappedResponse;
      },
      providesTags: ['PractitionerList'],
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetPractitionerListQuery,
  useGetPractitionerByIdQuery,
  useCreatePractitionerMutation,
  useUpdatePractitionerMutation,
  useDeletePractitionerMutation,
  useSearchPractitionersQuery,
  useLazyGetPractitionerByIdQuery,
  useLazySearchPractitionersQuery,
} = PractitionerApi;

export default PractitionerApi;