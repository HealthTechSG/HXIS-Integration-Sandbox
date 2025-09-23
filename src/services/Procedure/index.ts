// Types
export type {
  Procedure,
  FhirProcedureCoding,
  FhirProcedureCodeableConcept,
  FhirProcedureReference,
  FhirProcedurePerformer,
  FhirProcedureNote,
  FhirProcedureMeta,
  FhirProcedureResource,
  FhirProcedureBundleEntry,
  FhirProcedureBundle,
  GetProcedureListRequest,
  GetProcedureListResponse,
  CreateProcedureRequest,
  UpdateProcedureRequest,
  SearchProcedureRequest,
} from './ProcedureTypes';

// Constants
export {
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
  OUTCOME_OPTIONS,
  COMMON_PROCEDURE_CODES,
  COMMON_BODY_SITE_CODES,
} from './ProcedureTypes';

// Mapper Utility
export { default as ProcedureMapperUtil } from './ProcedureMapperUtil';

// Service & Hooks
export {
  ProcedureApi,
  useCreateProcedureMutation,
  useDeleteProcedureMutation,
  useGetProcedureByIdQuery,
  useGetProcedureListQuery,
  useGetProcedureListByPatientIdQuery,
  useSearchProceduresQuery,
  useUpdateProcedureMutation,
} from './ProcedureService';