import type {
  MedicationRequest,
  GetMedicationRequestListRequest,
  CreateMedicationRequestRequest,
  UpdateMedicationRequestRequest,
  SearchMedicationRequestRequest,
} from './MedicationRequestTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MedicationRequest as FhirMedicationRequest } from 'fhir/r5';

import MedicationRequestMapperUtil from './MedicationRequestMapperUtil';
import { UrlUtils } from '@/common/utils';
import type { SearchResourceResult } from '@/utils/fhir-client';
import { RtkFhirClient } from '@/utils/rtk-fhir-client';

//* Base Configs ---------------------------------------------------------------
const REDUCER_PATH = 'MedicationRequestApi';

const API_URL = UrlUtils.getApiUrl();
const client = RtkFhirClient(API_URL);

// Create the API using RTK query ----------------------------------------------
export const MedicationRequestApi = createApi({
  reducerPath: REDUCER_PATH,
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['MedicationRequest'],
  endpoints: (builder) => ({
    //* ------------------------------------------------------------------------
    //* MedicationRequest CRUD
    //* ------------------------------------------------------------------------
    //* Fetch List
    getMedicationRequestList: builder.query<
      SearchResourceResult<MedicationRequest>,
      GetMedicationRequestListRequest
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
          mapFromFhirMedicationRequest,
          mapToFhirMedicationRequestFilters,
          mapToFhirMedicationRequestSortFields,
        } = MedicationRequestMapperUtil;

        return client.searchResource<FhirMedicationRequest, MedicationRequest>({
          body: {
            resourceType: 'MedicationRequest',
            page,
            pageSize,
            sortFields: mapToFhirMedicationRequestSortFields(sortFields, sortDirections),
            filters: mapToFhirMedicationRequestFilters({ search, ...filters }),
            resultFields: [
              'id',
              'status',
              'intent',
              'medicationReference',
              'subject',
              'authoredOn',
              'requester',
              'dosageInstruction',
            ],
          },
          mapFn: mapFromFhirMedicationRequest,
        });
      },
      providesTags: [{ type: 'MedicationRequest' }],
    }),

    //* Fetch By ID ------------------------------------------------------------
    getMedicationRequestById: builder.query<MedicationRequest, string>({
      queryFn: (id) =>
        client.getResourceById<FhirMedicationRequest, MedicationRequest>({
          body: {
            resourceType: 'MedicationRequest',
            resourceId: id,
          },
          mapFn: MedicationRequestMapperUtil.mapFromFhirMedicationRequest,
        }),
      providesTags: (_result, _error, id) => [{ type: 'MedicationRequest', id }],
    }),

    //* Fetch By Patient ID ----------------------------------------------------
    getMedicationRequestListByPatientId: builder.query<
      SearchResourceResult<MedicationRequest>,
      string
    >({
      queryFn: async (patientId) =>
        client.searchResource<FhirMedicationRequest, MedicationRequest>({
          body: {
            resourceType: 'MedicationRequest',
            filters: {
              patient: patientId,
            },
            resultFields: [
              'id',
              'status',
              'intent',
              'medicationReference',
              'subject',
              'authoredOn',
              'requester',
              'dosageInstruction',
            ],
          },
          mapFn: MedicationRequestMapperUtil.mapFromFhirMedicationRequest,
        }),
      providesTags: [{ type: 'MedicationRequest' }],
    }),

    //* Search MedicationRequests ----------------------------------------------
    searchMedicationRequests: builder.query<
      SearchResourceResult<MedicationRequest>,
      SearchMedicationRequestRequest
    >({
      queryFn: async (searchParams) =>
        client.searchResource<FhirMedicationRequest, MedicationRequest>({
          body: {
            resourceType: 'MedicationRequest',
            filters: MedicationRequestMapperUtil.mapToFhirMedicationRequestFilters(searchParams),
            resultFields: [
              'id',
              'status',
              'intent',
              'medicationReference',
              'subject',
              'authoredOn',
              'requester',
              'dosageInstruction',
            ],
          },
          mapFn: MedicationRequestMapperUtil.mapFromFhirMedicationRequest,
        }),
      providesTags: [{ type: 'MedicationRequest' }],
    }),

    //* Create -----------------------------------------------------------------
    createMedicationRequest: builder.mutation<
      MedicationRequest,
      CreateMedicationRequestRequest
    >({
      queryFn: (request) => {
        console.log('🔵 [MedicationRequestService] Received CreateMedicationRequestRequest:', request);

        return client.createResource<
          CreateMedicationRequestRequest,
          FhirMedicationRequest,
          MedicationRequest
        >({
          body: request,
          mapReqFn: MedicationRequestMapperUtil.mapToFhirMedicationRequest as any,
          mapResFn: MedicationRequestMapperUtil.mapFromFhirMedicationRequest,
        });
      },
      invalidatesTags: [{ type: 'MedicationRequest' }],
    }),

    //* Update -----------------------------------------------------------------
    updateMedicationRequest: builder.mutation<
      MedicationRequest,
      UpdateMedicationRequestRequest
    >({
      queryFn: (medicationRequest) => {
        console.log('🔵 [MedicationRequestService] Received UpdateMedicationRequestRequest:', medicationRequest);

        return client.updateResource<
          UpdateMedicationRequestRequest,
          FhirMedicationRequest,
          MedicationRequest
        >({
          body: medicationRequest,
          mapReqFn: MedicationRequestMapperUtil.mapToFhirMedicationRequest as any,
          mapResFn: MedicationRequestMapperUtil.mapFromFhirMedicationRequest,
        });
      },
      invalidatesTags: [{ type: 'MedicationRequest' }],
    }),

    //* Delete -----------------------------------------------------------------
    deleteMedicationRequest: builder.mutation<void, string>({
      queryFn: (id) => {
        console.log('🔵 [MedicationRequestService] Deleting MedicationRequest with ID:', id);

        return client.deleteResource('MedicationRequest', id);
      },
      invalidatesTags: [{ type: 'MedicationRequest' }],
    }),

    //* ------------------------------------------------------------------------
  }),
});

//* Export ---------------------------------------------------------------------
export const {
  useCreateMedicationRequestMutation,
  useDeleteMedicationRequestMutation,
  useGetMedicationRequestByIdQuery,
  useGetMedicationRequestListQuery,
  useGetMedicationRequestListByPatientIdQuery,
  useSearchMedicationRequestsQuery,
  useUpdateMedicationRequestMutation,
} = MedicationRequestApi;