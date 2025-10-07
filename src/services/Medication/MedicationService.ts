import type {
  Medication,
  GetMedicationListRequest,
  CreateMedicationRequest,
  UpdateMedicationRequest,
  SearchMedicationRequest,
} from './MedicationTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Medication as FhirMedication } from 'fhir/r5';

import MedicationMapperUtil from './MedicationMapperUtil';
import { UrlUtils } from '@/common/utils';
import type { SearchResourceResult } from '@/utils/fhir-client';
import { RtkFhirClient } from '@/utils/rtk-fhir-client';

//* Base Configs ---------------------------------------------------------------
const REDUCER_PATH = 'MedicationApi';

const API_URL = UrlUtils.getApiUrl();
const client = RtkFhirClient(API_URL);

// Create the API using RTK query ----------------------------------------------
export const MedicationApi = createApi({
  reducerPath: REDUCER_PATH,
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Medication'],
  endpoints: (builder) => ({
    //* ------------------------------------------------------------------------
    //* Medication CRUD
    //* ------------------------------------------------------------------------
    //* Fetch List
    getMedicationList: builder.query<
      SearchResourceResult<Medication>,
      GetMedicationListRequest
    >({
      queryFn: async ({
        page = 0,
        pageSize = 10,
        search,
        sortDirections = [],
        sortFields = [],
        ...filters
      }) => {
        const {
          mapFromFhirMedication,
          mapToFhirMedicationFilters,
          mapToFhirMedicationSortFields,
        } = MedicationMapperUtil;

        return client.searchResource<FhirMedication, Medication>({
          body: {
            resourceType: 'Medication',
            page,
            pageSize,
            sortFields: mapToFhirMedicationSortFields(sortFields, sortDirections),
            filters: mapToFhirMedicationFilters({ search, ...filters }),
            resultFields: [
              'id',
              'code',
              'status',
              'form',
            ],
          },
          mapFn: mapFromFhirMedication,
        });
      },
      providesTags: [{ type: 'Medication' }],
    }),

    //* Fetch By ID ------------------------------------------------------------
    getMedicationById: builder.query<Medication, string>({
      queryFn: (id) =>
        client.getResourceById<FhirMedication, Medication>({
          body: {
            resourceType: 'Medication',
            resourceId: id,
          },
          mapFn: MedicationMapperUtil.mapFromFhirMedication,
        }),
      providesTags: (_result, _error, id) => [{ type: 'Medication', id }],
    }),

    //* Search Medications -----------------------------------------------------
    searchMedications: builder.query<
      SearchResourceResult<Medication>,
      SearchMedicationRequest
    >({
      queryFn: async (searchParams) =>
        client.searchResource<FhirMedication, Medication>({
          body: {
            resourceType: 'Medication',
            filters: MedicationMapperUtil.mapToFhirMedicationFilters(searchParams),
            resultFields: [
              'id',
              'code',
              'status',
              'form',
            ],
          },
          mapFn: MedicationMapperUtil.mapFromFhirMedication,
        }),
      providesTags: [{ type: 'Medication' }],
    }),

    //* Create -----------------------------------------------------------------
    createMedication: builder.mutation<
      Medication,
      CreateMedicationRequest
    >({
      queryFn: (request) => {
        console.log('🔵 [MedicationService] Received CreateMedicationRequest:', request);

        return client.createResource<
          CreateMedicationRequest,
          FhirMedication,
          Medication
        >({
          body: request,
          mapReqFn: MedicationMapperUtil.mapToFhirMedication as any,
          mapResFn: MedicationMapperUtil.mapFromFhirMedication,
        });
      },
      invalidatesTags: [{ type: 'Medication' }],
    }),

    //* Update -----------------------------------------------------------------
    updateMedication: builder.mutation<
      Medication,
      UpdateMedicationRequest
    >({
      queryFn: (medication) => {
        console.log('🔵 [MedicationService] Received UpdateMedicationRequest:', medication);

        return client.updateResource<
          UpdateMedicationRequest,
          FhirMedication,
          Medication
        >({
          body: medication,
          mapReqFn: MedicationMapperUtil.mapToFhirMedication as any,
          mapResFn: MedicationMapperUtil.mapFromFhirMedication,
        });
      },
      invalidatesTags: [{ type: 'Medication' }],
    }),

    //* Delete -----------------------------------------------------------------
    deleteMedication: builder.mutation<void, string>({
      queryFn: (id) => {
        console.log('🔵 [MedicationService] Deleting Medication with ID:', id);

        return client.deleteResource('Medication', id);
      },
      invalidatesTags: [{ type: 'Medication' }],
    }),

    //* ------------------------------------------------------------------------
  }),
});

//* Export ---------------------------------------------------------------------
export const {
  useCreateMedicationMutation,
  useDeleteMedicationMutation,
  useGetMedicationByIdQuery,
  useGetMedicationListQuery,
  useSearchMedicationsQuery,
  useUpdateMedicationMutation,
} = MedicationApi;