import type {
  Flag,
  GetFlagListRequest,
  CreateFlagRequest,
  UpdateFlagRequest,
  SearchFlagRequest,
} from './FlagTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Flag as FhirFlag } from 'fhir/r5';

import FlagMapperUtil from './FlagMapperUtil';
import { UrlUtils } from '@/common/utils';
import type { SearchResourceResult } from '@/utils/fhir-client';
import { RtkFhirClient } from '@/utils/rtk-fhir-client';

//* Base Configs ---------------------------------------------------------------
const REDUCER_PATH = 'FlagApi';

const API_URL = UrlUtils.getApiUrl();
const client = RtkFhirClient(API_URL);

// Create the API using RTK query ----------------------------------------------
export const FlagApi = createApi({
  reducerPath: REDUCER_PATH,
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Flag', 'FlagByPatient'],
  endpoints: (builder) => ({
    //* ------------------------------------------------------------------------
    //* Flag CRUD
    //* ------------------------------------------------------------------------
    //* Fetch List
    getFlagList: builder.query<
      SearchResourceResult<Flag>,
      GetFlagListRequest
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
          mapFromFhirFlag,
          mapToFhirFlagFilters,
          mapToFhirFlagSortFields,
        } = FlagMapperUtil;

        return client.searchResource<FhirFlag, Flag>({
          body: {
            resourceType: 'Flag',
            page,
            pageSize,
            sortFields: mapToFhirFlagSortFields(sortFields, sortDirections),
            filters: mapToFhirFlagFilters({ search, ...filters }),
            resultFields: [
              'id',
              'status',
              'category',
              'code',
              'subject',
              'period',
              'author'
            ],
          },
          mapFn: mapFromFhirFlag,
        });
      },
      providesTags: [{ type: 'Flag' }],
    }),

    //* Fetch By ID ------------------------------------------------------------
    getFlagById: builder.query<Flag, string>({
      queryFn: (id) =>
        client.getResourceById<FhirFlag, Flag>({
          body: {
            resourceType: 'Flag',
            resourceId: id,
          },
          mapFn: FlagMapperUtil.mapFromFhirFlag,
        }),
      providesTags: (_result, _error, id) => [{ type: 'Flag', id }],
    }),

    //* Fetch By Patient ID ----------------------------------------------------
    getFlagListByPatientId: builder.query<
      SearchResourceResult<Flag>,
      string
    >({
      queryFn: async (patientId) =>
        client.searchResource<FhirFlag, Flag>({
          body: {
            resourceType: 'Flag',
            filters: {
              patient: patientId,
            },
            resultFields: [
              'id',
              'status',
              'category',
              'code',
              'subject',
              'period',
              'author'
            ],
          },
          mapFn: FlagMapperUtil.mapFromFhirFlag,
        }),
      providesTags: (_result, _error, patientId) => [
        { type: 'FlagByPatient', id: patientId },
        { type: 'Flag' }
      ],
    }),

    //* Search Flags -----------------------------------------------------------
    searchFlags: builder.query<
      SearchResourceResult<Flag>,
      SearchFlagRequest
    >({
      queryFn: async (searchParams) =>
        client.searchResource<FhirFlag, Flag>({
          body: {
            resourceType: 'Flag',
            filters: FlagMapperUtil.mapToFhirFlagFilters(searchParams),
            resultFields: [
              'id',
              'status',
              'category',
              'code',
              'subject',
              'period',
              'author'
            ],
          },
          mapFn: FlagMapperUtil.mapFromFhirFlag,
        }),
      providesTags: [{ type: 'Flag' }],
    }),

    //* Create -----------------------------------------------------------------
    createFlag: builder.mutation<
      Flag,
      CreateFlagRequest
    >({
      queryFn: (request) => {
        // Validate the request
        const validationErrors = FlagMapperUtil.validateFlag(request);
        if (validationErrors.length > 0) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Validation failed',
              data: { errors: validationErrors },
            },
          };
        }

        console.log('🔵 [FlagService] Received CreateFlagRequest:', request);

        return client.createResource<
          CreateFlagRequest,
          FhirFlag,
          Flag
        >({
          body: request,
          mapReqFn: FlagMapperUtil.mapToFhirFlag as any,
          mapResFn: FlagMapperUtil.mapFromFhirFlag,
        });
      },
      invalidatesTags: (_result, _error, { subject }) => [
        { type: 'Flag' },
        { type: 'FlagByPatient', id: subject }
      ],
    }),

    //* Update -----------------------------------------------------------------
    updateFlag: builder.mutation<
      Flag,
      UpdateFlagRequest
    >({
      queryFn: (flag) => {
        // Validate the request
        const validationErrors = FlagMapperUtil.validateFlag(flag);
        if (validationErrors.length > 0) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Validation failed',
              data: { errors: validationErrors },
            },
          };
        }

        console.log('🔵 [FlagService] Received UpdateFlagRequest:', flag);

        return client.updateResource<
          UpdateFlagRequest,
          FhirFlag,
          Flag
        >({
          body: flag,
          mapReqFn: FlagMapperUtil.mapToFhirFlag as any,
          mapResFn: FlagMapperUtil.mapFromFhirFlag,
        });
      },
      invalidatesTags: (_result, _error, { id, subject }) => [
        { type: 'Flag', id },
        { type: 'Flag' },
        { type: 'FlagByPatient', id: subject }
      ],
    }),

    //* Delete -----------------------------------------------------------------
    deleteFlag: builder.mutation<void, string>({
      queryFn: (id) => {
        console.log('🔵 [FlagService] Deleting Flag with ID:', id);

        return client.deleteResource('Flag', id);
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Flag', id },
        { type: 'Flag' },
        { type: 'FlagByPatient', id: 'LIST' }
      ],
    }),

    //* Get Flags by Author (Practitioner) ------------------------------------
    getFlagsByAuthorId: builder.query<
      SearchResourceResult<Flag>,
      string
    >({
      queryFn: async (authorId) =>
        client.searchResource<FhirFlag, Flag>({
          body: {
            resourceType: 'Flag',
            filters: {
              author: authorId,
            },
            resultFields: [
              'id',
              'status',
              'category',
              'code',
              'subject',
              'period',
              'author'
            ],
          },
          mapFn: FlagMapperUtil.mapFromFhirFlag,
        }),
      providesTags: [{ type: 'Flag' }],
    }),

    //* Get Flags by Category --------------------------------------------------
    getFlagsByCategory: builder.query<
      SearchResourceResult<Flag>,
      { category: string; patientId?: string }
    >({
      queryFn: async ({ category, patientId }) =>
        client.searchResource<FhirFlag, Flag>({
          body: {
            resourceType: 'Flag',
            filters: {
              category,
              ...(patientId && { patient: patientId }),
            },
            resultFields: [
              'id',
              'status',
              'category',
              'code',
              'subject',
              'period',
              'author'
            ],
          },
          mapFn: FlagMapperUtil.mapFromFhirFlag,
        }),
      providesTags: (_result, _error, { patientId }) => [
        { type: 'Flag' },
        ...(patientId ? [{ type: 'FlagByPatient' as const, id: patientId }] : [])
      ],
    }),

    //* ------------------------------------------------------------------------
  }),
});

//* Export ---------------------------------------------------------------------
export const {
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
} = FlagApi;