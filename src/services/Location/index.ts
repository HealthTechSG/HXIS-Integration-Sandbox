// Location Service Exports
export { default as LocationApi } from './LocationService';
export {
  useGetLocationListQuery,
  useGetLocationByIdQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  useSearchLocationsQuery,
  useLazyGetLocationByIdQuery,
  useLazySearchLocationsQuery,
} from './LocationService';

// Location Types
export type {
  FhirLocation,
  FhirLocationBundle,
  FhirLocationBundleEntry,
  Location,
  CreateLocationRequest,
  UpdateLocationRequest,
  GetLocationListParams,
  LocationListResponse,
  LocationResponse,
} from './LocationTypes';

// Location Mapper Utility
export { LocationMapperUtil } from './LocationMapperUtil';