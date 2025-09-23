import type {
  FhirLocation,
  FhirLocationBundle,
  Location,
  CreateLocationRequest,
  UpdateLocationRequest,
  GetLocationListParams,
  LocationListResponse,
} from './LocationTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { LocationMapperUtil } from './LocationMapperUtil';

/**
 * RTK Query API for Location FHIR operations
 */
export const LocationApi = createApi({
  reducerPath: 'locationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_FHIR_API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('x-api-key', import.meta.env.VITE_FHIR_API_KEY || '');
      return headers;
    },
  }),
  tagTypes: ['Location', 'LocationList'],
  endpoints: (builder) => ({
    /**
     * Get list of locations with optional filtering
     */
    getLocationList: builder.query<LocationListResponse, GetLocationListParams>({
      query: (params: GetLocationListParams) => {
        const fhirParams = LocationMapperUtil.mapSearchParamsToFhirParams({
          search: params.search,
          status: params.status,
          pageSize: params.pageSize || 100,
        });

        console.log('🔍 [LocationService] Fetching location list with params:', fhirParams);

        // Convert params to URLSearchParams for form encoding
        const searchParams = new URLSearchParams();
        Object.entries(fhirParams).forEach(([key, value]) => {
          searchParams.append(key, value);
        });

        return {
          url: '/Location/_search',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: searchParams.toString(),
        };
      },
      transformResponse: (response: FhirLocationBundle): LocationListResponse => {
        console.log('📦 [LocationService] Raw FHIR Bundle response:', response);
        const mappedResponse = LocationMapperUtil.mapFhirBundleToLocationList(response);
        console.log('🎯 [LocationService] Mapped location list:', mappedResponse);
        return mappedResponse;
      },
      providesTags: (result?: LocationListResponse) => [
        'LocationList',
        ...(result?.entry || []).map((location: Location) => ({ type: 'Location' as const, id: location.id })),
      ],
    }),

    /**
     * Get a single location by ID
     */
    getLocationById: builder.query<Location, string>({
      query: (id: string) => {
        console.log('🔍 [LocationService] Fetching location by ID:', id);
        return {
          url: `/Location/${id}`,
          method: 'GET',
        };
      },
      transformResponse: (response: FhirLocation): Location => {
        console.log('📦 [LocationService] Raw FHIR Location response:', response);
        const mappedResponse = LocationMapperUtil.mapFhirLocationToLocation(response);
        console.log('🎯 [LocationService] Mapped location:', mappedResponse);
        return mappedResponse;
      },
      providesTags: (_result, _error, id) => [{ type: 'Location', id }],
    }),

    /**
     * Create a new location
     */
    createLocation: builder.mutation<Location, CreateLocationRequest>({
      query: (locationData: CreateLocationRequest) => {
        // Validate the request data
        const validationErrors = LocationMapperUtil.validateLocation(locationData);
        if (validationErrors.length > 0) {
          throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
        }

        const fhirLocation = LocationMapperUtil.mapCreateRequestToFhirLocation(locationData);
        console.log('➕ [LocationService] Creating location with FHIR data:', fhirLocation);

        return {
          url: '/Location',
          method: 'POST',
          body: JSON.stringify(fhirLocation),
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      transformResponse: (response: FhirLocation): Location => {
        console.log('📦 [LocationService] Created location response:', response);
        const mappedResponse = LocationMapperUtil.mapFhirLocationToLocation(response);
        console.log('🎯 [LocationService] Mapped created location:', mappedResponse);
        return mappedResponse;
      },
      invalidatesTags: ['LocationList'],
    }),

    /**
     * Update an existing location
     */
    updateLocation: builder.mutation<Location, UpdateLocationRequest>({
      query: (locationData: UpdateLocationRequest) => {
        // Validate the request data
        const validationErrors = LocationMapperUtil.validateLocation(locationData);
        if (validationErrors.length > 0) {
          throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
        }

        const fhirLocation = LocationMapperUtil.mapUpdateRequestToFhirLocation(locationData);
        console.log('✏️ [LocationService] Updating location with FHIR data:', fhirLocation);

        return {
          url: `/Location/${locationData.id}`,
          method: 'PUT',
          body: JSON.stringify(fhirLocation),
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      transformResponse: (response: FhirLocation): Location => {
        console.log('📦 [LocationService] Updated location response:', response);
        const mappedResponse = LocationMapperUtil.mapFhirLocationToLocation(response);
        console.log('🎯 [LocationService] Mapped updated location:', mappedResponse);
        return mappedResponse;
      },
      invalidatesTags: (_result, _error, { id }) => [
        'LocationList',
        { type: 'Location', id },
      ],
    }),

    /**
     * Delete a location (sets status to inactive)
     */
    deleteLocation: builder.mutation<void, string>({
      query: (id: string) => {
        console.log('🗑️ [LocationService] Soft deleting location:', id);
        
        // First fetch the location to get current data
        return {
          url: `/Location/${id}`,
          method: 'GET',
        };
      },
      transformResponse: async (response: FhirLocation, _meta: any, id: string) => {
        // Set status to inactive and update
        const updatedLocation = {
          ...response,
          status: 'inactive' as const,
        };

        console.log('🗑️ [LocationService] Setting location inactive:', updatedLocation);

        // Make the update call
        // Note: This is a simplified approach. In a real implementation, 
        // you might want to use a separate endpoint or handle this differently.
        await fetch(`${import.meta.env.VITE_FHIR_API_BASE_URL}/Location/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_FHIR_API_KEY || '',
          },
          body: JSON.stringify(updatedLocation),
        });

        
      },
      invalidatesTags: (_result, _error, id) => [
        'LocationList',
        { type: 'Location', id },
      ],
    }),

    /**
     * Search locations by name or other criteria
     */
    searchLocations: builder.query<LocationListResponse, { query: string; limit?: number }>({
      query: ({ limit = 20, query }: { query: string; limit?: number }) => {
        console.log('🔍 [LocationService] Searching locations with query:', query);
        
        const searchParams = new URLSearchParams();
        searchParams.append('name', query);
        searchParams.append('_count', limit.toString());
        searchParams.append('status', 'active');

        return {
          url: '/Location/_search',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: searchParams.toString(),
        };
      },
      transformResponse: (response: FhirLocationBundle): LocationListResponse => {
        console.log('📦 [LocationService] Search response:', response);
        const mappedResponse = LocationMapperUtil.mapFhirBundleToLocationList(response);
        console.log('🎯 [LocationService] Mapped search results:', mappedResponse);
        return mappedResponse;
      },
      providesTags: ['LocationList'],
    }),
  }),
});

// Export hooks for use in components
export const {
  useCreateLocationMutation,
  useDeleteLocationMutation,
  useGetLocationByIdQuery,
  useGetLocationListQuery,
  useLazyGetLocationByIdQuery,
  useLazySearchLocationsQuery,
  useSearchLocationsQuery,
  useUpdateLocationMutation,
} = LocationApi;

export default LocationApi;