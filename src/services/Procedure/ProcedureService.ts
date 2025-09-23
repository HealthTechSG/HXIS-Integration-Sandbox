import type {
  Procedure,
  GetProcedureListRequest,
  CreateProcedureRequest,
  UpdateProcedureRequest,
  SearchProcedureRequest,
} from './ProcedureTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Procedure as FhirProcedure } from 'fhir/r5';

import ProcedureMapperUtil from './ProcedureMapperUtil';
import { UrlUtils } from '@/common/utils';
import type { SearchResourceResult } from '@/utils/fhir-client';
import { RtkFhirClient } from '@/utils/rtk-fhir-client';

//* Base Configs ---------------------------------------------------------------
const REDUCER_PATH = 'ProcedureApi';

const API_URL = UrlUtils.getApiUrl();
const client = RtkFhirClient(API_URL);

// Create the API using RTK query ----------------------------------------------
export const ProcedureApi = createApi({
  reducerPath: REDUCER_PATH,
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Procedure'],
  endpoints: (builder) => ({
    //* ------------------------------------------------------------------------
    //* Procedure CRUD
    //* ------------------------------------------------------------------------
    //* Fetch List
    getProcedureList: builder.query<
      SearchResourceResult<Procedure>,
      GetProcedureListRequest
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
          mapFromFhirProcedure,
          mapToFhirProcedureFilters,
          mapToFhirProcedureSortFields,
        } = ProcedureMapperUtil;

        return client.searchResource<FhirProcedure, Procedure>({
          body: {
            resourceType: 'Procedure',
            page,
            pageSize,
            sortFields: mapToFhirProcedureSortFields(sortFields, sortDirections),
            filters: mapToFhirProcedureFilters({ search, ...filters }),
            resultFields: [
              'id',
              'status',
              'category',
              'code',
              'subject',
              'performedDateTime',
              'performer',
              'location',
              'bodySite',
              'outcome',
              'note'
            ],
          },
          mapFn: mapFromFhirProcedure,
        });
      },
      providesTags: [{ type: 'Procedure' }],
    }),

    //* Fetch By ID ------------------------------------------------------------
    getProcedureById: builder.query<Procedure, string>({
      queryFn: (id) =>
        client.getResourceById<FhirProcedure, Procedure>({
          body: {
            resourceType: 'Procedure',
            resourceId: id,
          },
          mapFn: ProcedureMapperUtil.mapFromFhirProcedure,
        }),
      providesTags: (_result, _error, id) => [{ type: 'Procedure', id }],
    }),

    //* Fetch By Patient ID ----------------------------------------------------
    getProcedureListByPatientId: builder.query<
      SearchResourceResult<Procedure>,
      string
    >({
      queryFn: async (patientId) =>
        client.searchResource<FhirProcedure, Procedure>({
          body: {
            resourceType: 'Procedure',
            filters: {
              patient: patientId,
            },
            resultFields: [
              'id',
              'status',
              'category',
              'code',
              'subject',
              'performedDateTime',
              'performer',
              'location',
              'bodySite',
              'outcome',
              'note'
            ],
          },
          mapFn: ProcedureMapperUtil.mapFromFhirProcedure,
        }),
      providesTags: [{ type: 'Procedure' }],
    }),

    //* Search Procedures ------------------------------------------------------
    searchProcedures: builder.query<
      SearchResourceResult<Procedure>,
      SearchProcedureRequest
    >({
      queryFn: async (searchParams) =>
        client.searchResource<FhirProcedure, Procedure>({
          body: {
            resourceType: 'Procedure',
            filters: ProcedureMapperUtil.mapToFhirProcedureFilters(searchParams),
            resultFields: [
              'id',
              'status',
              'category',
              'code',
              'subject',
              'performedDateTime',
              'performer',
              'location',
              'bodySite',
              'outcome',
              'note'
            ],
          },
          mapFn: ProcedureMapperUtil.mapFromFhirProcedure,
        }),
      providesTags: [{ type: 'Procedure' }],
    }),

    //* Create -----------------------------------------------------------------
    createProcedure: builder.mutation<
      Procedure,
      CreateProcedureRequest
    >({
      queryFn: (request) => client.createResource<
        CreateProcedureRequest,
        FhirProcedure,
        Procedure
      >({
        body: request,
        mapReqFn: ProcedureMapperUtil.mapToFhirProcedure as any,
        mapResFn: ProcedureMapperUtil.mapFromFhirProcedure,
      }),
      invalidatesTags: [{ type: 'Procedure' }],
    }),

    //* Update -----------------------------------------------------------------
    updateProcedure: builder.mutation<
      Procedure,
      UpdateProcedureRequest
    >({
      queryFn: (procedure) => client.updateResource<
        UpdateProcedureRequest,
        FhirProcedure,
        Procedure
      >({
        body: procedure,
        mapReqFn: ProcedureMapperUtil.mapToFhirProcedure as any,
        mapResFn: ProcedureMapperUtil.mapFromFhirProcedure,
      }),
      invalidatesTags: [{ type: 'Procedure' }],
    }),

    //* Delete -----------------------------------------------------------------
    deleteProcedure: builder.mutation<void, string>({
      queryFn: (id) => client.deleteResource('Procedure', id),
      invalidatesTags: [{ type: 'Procedure' }],
    }),

    //* ------------------------------------------------------------------------
  }),
});

//* Export ---------------------------------------------------------------------
export const {
  useCreateProcedureMutation,
  useDeleteProcedureMutation,
  useGetProcedureByIdQuery,
  useGetProcedureListByPatientIdQuery,
  useGetProcedureListQuery,
  useSearchProceduresQuery,
  useUpdateProcedureMutation,
} = ProcedureApi;