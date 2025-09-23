// List Service Exports
export { default as ListApi } from './ListService';
export {
  useGetListByIdQuery,
  useGetListListQuery,
  useGetListsByPatientIdQuery,
  useSearchListsQuery,
  useCreateListMutation,
  useUpdateListMutation,
  useDeleteListMutation,
  useAddEntryToListMutation,
  useRemoveEntryFromListMutation,
  useGetListsByCodeQuery,
  useLazyGetListByIdQuery,
  useLazyGetListListQuery,
  useLazyGetListsByPatientIdQuery,
  useLazySearchListsQuery,
  useLazyGetListsByCodeQuery,
} from './ListService';

// List Types
export type {
  // FHIR Types
  FhirList,
  FhirListResource,
  FhirListBundle,
  FhirListEntry,
  FhirListReference,
  FhirListCoding,
  FhirListCodeableConcept,
  FhirListMeta,

  // Application Types
  List,
  ListEntry,
  CreateListRequest,
  UpdateListRequest,

  // API Types
  GetListParams,
  SearchListsRequest,
  ListResponse,
  SearchResourceResult,

  // Type Unions
  ListCode,
  ListStatus,
  ListMode,
} from './ListTypes';

// List Constants and Options
export {
  LIST_STATUS_OPTIONS,
  LIST_MODE_OPTIONS,
  LIST_CODE_OPTIONS,
  COMMON_LIST_TEMPLATES,
} from './ListTypes';

// List Mapper Utility
export { ListMapperUtil } from './ListMapperUtil';