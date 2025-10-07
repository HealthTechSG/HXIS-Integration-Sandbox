// Types
export type {
  Medication,
  FhirMedicationCoding,
  FhirMedicationCodeableConcept,
  FhirMedicationMeta,
  FhirMedicationResource,
  FhirMedicationBundleEntry,
  FhirMedicationBundle,
  GetMedicationListRequest,
  GetMedicationListResponse,
  CreateMedicationRequest,
  UpdateMedicationRequest,
  SearchMedicationRequest,
} from './MedicationTypes';

// Constants
export {
  MEDICATION_STATUS_OPTIONS,
  COMMON_MEDICATION_CODES,
  COMMON_DOSE_FORM_CODES,
} from './MedicationTypes';

// Mapper Utility
export { default as MedicationMapperUtil } from './MedicationMapperUtil';

// Service & Hooks
export {
  MedicationApi,
  useCreateMedicationMutation,
  useDeleteMedicationMutation,
  useGetMedicationByIdQuery,
  useGetMedicationListQuery,
  useSearchMedicationsQuery,
  useUpdateMedicationMutation,
} from './MedicationService';