import type {
  Condition,
  GetConditionListRequest,
  CreateConditionRequest,
  UpdateConditionRequest,
  SearchConditionRequest,
} from './ConditionTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Condition as FhirCondition } from 'fhir/r5';

import ConditionMapperUtil from './ConditionMapperUtil';
import { UrlUtils } from '@/common/utils';
import type { SearchResourceResult } from '@/utils/fhir-client';
import { RtkFhirClient } from '@/utils/rtk-fhir-client';

//* Base Configs ---------------------------------------------------------------
const REDUCER_PATH = 'ConditionApi';

const API_URL = UrlUtils.getApiUrl();
const client = RtkFhirClient(API_URL);

// Create the API using RTK query ----------------------------------------------
export const ConditionApi = createApi({
  reducerPath: REDUCER_PATH,
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Condition'],
  endpoints: (builder) => ({
    //* ------------------------------------------------------------------------
    //* Condition CRUD
    //* ------------------------------------------------------------------------
    //* Fetch List
    getConditionList: builder.query<
      SearchResourceResult<Condition>,
      GetConditionListRequest
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
          mapFromFhirCondition,
          mapToFhirConditionFilters,
          mapToFhirConditionSortFields,
        } = ConditionMapperUtil;

        return client.searchResource<FhirCondition, Condition>({
          body: {
            resourceType: 'Condition',
            page,
            pageSize,
            sortFields: mapToFhirConditionSortFields(sortFields, sortDirections),
            filters: mapToFhirConditionFilters({ search, ...filters }),
            resultFields: [
              'id',
              'clinicalStatus',
              'verificationStatus',
              'category',
              'severity',
              'code',
              'bodySite',
              'subject',
              'recordedDate'
            ],
          },
          mapFn: mapFromFhirCondition,
        });
      },
      providesTags: [{ type: 'Condition' }],
    }),

    //* Fetch By ID ------------------------------------------------------------
    getConditionById: builder.query<Condition, string>({
      queryFn: (id) =>
        client.getResourceById<FhirCondition, Condition>({
          body: {
            resourceType: 'Condition',
            resourceId: id,
          },
          mapFn: ConditionMapperUtil.mapFromFhirCondition,
        }),
      providesTags: (_result, _error, id) => [{ type: 'Condition', id }],
    }),

    //* Fetch By Patient ID ----------------------------------------------------
    getConditionListByPatientId: builder.query<
      SearchResourceResult<Condition>,
      string
    >({
      queryFn: async (patientId) =>
        client.searchResource<FhirCondition, Condition>({
          body: {
            resourceType: 'Condition',
            filters: {
              patient: patientId,
            },
            resultFields: [
              'id',
              'clinicalStatus',
              'verificationStatus',
              'category',
              'severity',
              'code',
              'bodySite',
              'subject',
              'recordedDate'
            ],
          },
          mapFn: ConditionMapperUtil.mapFromFhirCondition,
        }),
      providesTags: [{ type: 'Condition' }],
    }),

    //* Search Conditions ------------------------------------------------------
    searchConditions: builder.query<
      SearchResourceResult<Condition>,
      SearchConditionRequest
    >({
      queryFn: async (searchParams) =>
        client.searchResource<FhirCondition, Condition>({
          body: {
            resourceType: 'Condition',
            filters: ConditionMapperUtil.mapToFhirConditionFilters(searchParams),
            resultFields: [
              'id',
              'clinicalStatus',
              'verificationStatus',
              'category',
              'severity',
              'code',
              'bodySite',
              'subject',
              'recordedDate'
            ],
          },
          mapFn: ConditionMapperUtil.mapFromFhirCondition,
        }),
      providesTags: [{ type: 'Condition' }],
    }),

    //* Create -----------------------------------------------------------------
    createCondition: builder.mutation<
      Condition,
      CreateConditionRequest
    >({
      queryFn: (request) => {
        console.log('🔵 [ConditionService] Received CreateConditionRequest:', request);

        return client.createResource<
          CreateConditionRequest,
          FhirCondition,
          Condition
        >({
          body: request,
          mapReqFn: ConditionMapperUtil.mapToFhirCondition as any,
          mapResFn: ConditionMapperUtil.mapFromFhirCondition,
        });
      },
      invalidatesTags: [{ type: 'Condition' }],
    }),

    //* Update -----------------------------------------------------------------
    updateCondition: builder.mutation<
      Condition,
      UpdateConditionRequest
    >({
      queryFn: (condition) => {
        console.log('🔵 [ConditionService] Received UpdateConditionRequest:', condition);

        return client.updateResource<
          UpdateConditionRequest,
          FhirCondition,
          Condition
        >({
          body: condition,
          mapReqFn: ConditionMapperUtil.mapToFhirCondition as any,
          mapResFn: ConditionMapperUtil.mapFromFhirCondition,
        });
      },
      invalidatesTags: [{ type: 'Condition' }],
    }),

    //* Delete -----------------------------------------------------------------
    deleteCondition: builder.mutation<void, string>({
      queryFn: (id) => {
        console.log('🔵 [ConditionService] Deleting Condition with ID:', id);

        return client.deleteResource('Condition', id);
      },
      invalidatesTags: [{ type: 'Condition' }],
    }),

    //* ------------------------------------------------------------------------
  }),
});

//* Export ---------------------------------------------------------------------
export const {
  useCreateConditionMutation,
  useDeleteConditionMutation,
  useGetConditionByIdQuery,
  useGetConditionListQuery,
  useGetConditionListByPatientIdQuery,
  useSearchConditionsQuery,
  useUpdateConditionMutation,
} = ConditionApi;