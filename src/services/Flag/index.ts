// Types
export type {
  Flag,
  FhirFlagCoding,
  FhirFlagCodeableConcept,
  FhirFlagReference,
  FhirFlagPeriod,
  FhirFlagMeta,
  FhirFlagResource,
  FhirFlagBundleEntry,
  FhirFlagBundle,
  GetFlagListRequest,
  GetFlagListResponse,
  CreateFlagRequest,
  UpdateFlagRequest,
  SearchFlagRequest,
  FlagStatus,
  FlagCategory,
} from './FlagTypes';

// Constants
export {
  FLAG_STATUS_OPTIONS,
  FLAG_CATEGORY_OPTIONS,
  COMMON_FLAG_CODES,
} from './FlagTypes';

// Mapper Utility
export { default as FlagMapperUtil } from './FlagMapperUtil';

// Service & Hooks
export {
  FlagApi,
  useCreateFlagMutation,
  useDeleteFlagMutation,
  useGetFlagByIdQuery,
  useGetFlagListQuery,
  useGetFlagListByPatientIdQuery,
  useGetFlagsByAuthorIdQuery,
  useGetFlagsByCategoryQuery,
  useSearchFlagsQuery,
  useUpdateFlagMutation,
  useLazyGetFlagByIdQuery,
  useLazyGetFlagListQuery,
  useLazyGetFlagListByPatientIdQuery,
  useLazyGetFlagsByAuthorIdQuery,
  useLazyGetFlagsByCategoryQuery,
  useLazySearchFlagsQuery,
} from './FlagService';