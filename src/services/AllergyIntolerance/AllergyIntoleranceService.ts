import type {
  AllergyIntolerance,
  GetAllergyIntoleranceListRequest,
  CreateAllergyIntoleranceRequest,
  UpdateAllergyIntoleranceRequest,
  SearchAllergyIntoleranceRequest,
} from './AllergyIntoleranceTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AllergyIntolerance as FhirAllergyIntolerance } from 'fhir/r5';

import AllergyIntoleranceMapperUtil from './AllergyIntoleranceMapperUtil';
import { UrlUtils } from '@/common/utils';
import type { SearchResourceResult } from '@/utils/fhir-client';
import { RtkFhirClient } from '@/utils/rtk-fhir-client';

//* Base Configs ---------------------------------------------------------------
const REDUCER_PATH = 'AllergyIntoleranceApi';

const API_URL = UrlUtils.getApiUrl();
const client = RtkFhirClient(API_URL);

// Create the API using RTK query ----------------------------------------------
export const AllergyIntoleranceApi = createApi({
  reducerPath: REDUCER_PATH,
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['AllergyIntolerance'],
  endpoints: (builder) => ({
    //* ------------------------------------------------------------------------
    //* AllergyIntolerance CRUD
    //* ------------------------------------------------------------------------
    //* Fetch List
    getAllergyIntoleranceList: builder.query<
      SearchResourceResult<AllergyIntolerance>,
      GetAllergyIntoleranceListRequest
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
          mapFromFhirAllergyIntolerance,
          mapToFhirAllergyIntoleranceFilters,
          mapToFhirAllergyIntoleranceSortFields,
        } = AllergyIntoleranceMapperUtil;

        return client.searchResource<FhirAllergyIntolerance, AllergyIntolerance>({
          body: {
            resourceType: 'AllergyIntolerance',
            page,
            pageSize,
            sortFields: mapToFhirAllergyIntoleranceSortFields(sortFields, sortDirections),
            filters: mapToFhirAllergyIntoleranceFilters({ search, ...filters }),
            resultFields: [
              'id',
              'clinicalStatus',
              'verificationStatus',
              'type',
              'category',
              'criticality',
              'code',
              'patient',
              'recordedDate',
              'note'
            ],
          },
          mapFn: mapFromFhirAllergyIntolerance,
        });
      },
      providesTags: [{ type: 'AllergyIntolerance' }],
    }),

    //* Fetch By ID ------------------------------------------------------------
    getAllergyIntoleranceById: builder.query<AllergyIntolerance, string>({
      queryFn: (id) =>
        client.getResourceById<FhirAllergyIntolerance, AllergyIntolerance>({
          body: {
            resourceType: 'AllergyIntolerance',
            resourceId: id,
          },
          mapFn: AllergyIntoleranceMapperUtil.mapFromFhirAllergyIntolerance,
        }),
      providesTags: (_result, _error, id) => [{ type: 'AllergyIntolerance', id }],
    }),

    //* Fetch By Patient ID ----------------------------------------------------
    getAllergyIntoleranceListByPatientId: builder.query<
      SearchResourceResult<AllergyIntolerance>,
      string
    >({
      queryFn: async (patientId) =>
        client.searchResource<FhirAllergyIntolerance, AllergyIntolerance>({
          body: {
            resourceType: 'AllergyIntolerance',
            filters: {
              patient: patientId,
            },
            resultFields: [
              'id',
              'clinicalStatus',
              'verificationStatus',
              'type',
              'category',
              'criticality',
              'code',
              'patient',
              'recordedDate',
              'note'
            ],
          },
          mapFn: AllergyIntoleranceMapperUtil.mapFromFhirAllergyIntolerance,
        }),
      providesTags: [{ type: 'AllergyIntolerance' }],
    }),

    //* Search AllergyIntolerances ---------------------------------------------
    searchAllergyIntolerances: builder.query<
      SearchResourceResult<AllergyIntolerance>,
      SearchAllergyIntoleranceRequest
    >({
      queryFn: async (searchParams) =>
        client.searchResource<FhirAllergyIntolerance, AllergyIntolerance>({
          body: {
            resourceType: 'AllergyIntolerance',
            filters: AllergyIntoleranceMapperUtil.mapToFhirAllergyIntoleranceFilters(searchParams),
            resultFields: [
              'id',
              'clinicalStatus',
              'verificationStatus',
              'type',
              'category',
              'criticality',
              'code',
              'patient',
              'recordedDate',
              'note'
            ],
          },
          mapFn: AllergyIntoleranceMapperUtil.mapFromFhirAllergyIntolerance,
        }),
      providesTags: [{ type: 'AllergyIntolerance' }],
    }),

    //* Create -----------------------------------------------------------------
    createAllergyIntolerance: builder.mutation<
      AllergyIntolerance,
      CreateAllergyIntoleranceRequest
    >({
      queryFn: (request) => {
        console.log('🔵 [AllergyIntoleranceService] Received CreateAllergyIntoleranceRequest:', request);
        
        return client.createResource<
          CreateAllergyIntoleranceRequest,
          FhirAllergyIntolerance,
          AllergyIntolerance
        >({
          body: request,
          mapReqFn: AllergyIntoleranceMapperUtil.mapToFhirAllergyIntolerance as any,
          mapResFn: AllergyIntoleranceMapperUtil.mapFromFhirAllergyIntolerance,
        });
      },
      invalidatesTags: [{ type: 'AllergyIntolerance' }],
    }),

    //* Update -----------------------------------------------------------------
    updateAllergyIntolerance: builder.mutation<
      AllergyIntolerance,
      UpdateAllergyIntoleranceRequest
    >({
      queryFn: (allergyIntolerance) => {
        console.log('🔵 [AllergyIntoleranceService] Received UpdateAllergyIntoleranceRequest:', allergyIntolerance);
        
        return client.updateResource<
          UpdateAllergyIntoleranceRequest,
          FhirAllergyIntolerance,
          AllergyIntolerance
        >({
          body: allergyIntolerance,
          mapReqFn: AllergyIntoleranceMapperUtil.mapToFhirAllergyIntolerance as any,
          mapResFn: AllergyIntoleranceMapperUtil.mapFromFhirAllergyIntolerance,
        });
      },
      invalidatesTags: [{ type: 'AllergyIntolerance' }],
    }),

    //* Delete -----------------------------------------------------------------
    deleteAllergyIntolerance: builder.mutation<void, string>({
      queryFn: (id) => {
        console.log('🔵 [AllergyIntoleranceService] Deleting AllergyIntolerance with ID:', id);
        
        return client.deleteResource('AllergyIntolerance', id);
      },
      invalidatesTags: [{ type: 'AllergyIntolerance' }],
    }),

    //* ------------------------------------------------------------------------
  }),
});

//* Export ---------------------------------------------------------------------
export const {
  useCreateAllergyIntoleranceMutation,
  useDeleteAllergyIntoleranceMutation,
  useGetAllergyIntoleranceByIdQuery,
  useGetAllergyIntoleranceListQuery,
  useGetAllergyIntoleranceListByPatientIdQuery,
  useSearchAllergyIntolerancesQuery,
  useUpdateAllergyIntoleranceMutation,
} = AllergyIntoleranceApi;