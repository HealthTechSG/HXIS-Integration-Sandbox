import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ListMapperUtil } from './ListMapperUtil';
import { UrlUtils } from '@/common/utils';
import { RtkFhirClient } from '@/utils/rtk-fhir-client';
import type {
  List,
  FhirList,
  FhirListResource,
  CreateListRequest,
  UpdateListRequest,
  GetListParams,
  SearchListsRequest,
  SearchResourceResult,
} from './ListTypes';

//* Base Configs ---------------------------------------------------------------
const REDUCER_PATH = 'listApi';

const API_URL = UrlUtils.getApiUrl();
const client = RtkFhirClient(API_URL);

//* List API Definition -----------------------------------------------------------
const ListApi = createApi({
  reducerPath: REDUCER_PATH,
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['List', 'ListByPatient'],
  endpoints: (builder) => ({
    //* Get List by ID -------------------------------------------------------------
    getListById: builder.query<List, string>({
      queryFn: (id) =>
        client.getResourceById<FhirList, List>({
          body: {
            resourceType: 'List',
            resourceId: id,
          },
          mapFn: ListMapperUtil.mapFromFhirList,
        }),
      providesTags: (_result, _error, id) => [{ type: 'List', id }],
    }),

    //* Get Lists ------------------------------------------------------------------
    getListList: builder.query<
      SearchResourceResult<List>,
      GetListParams
    >({
      queryFn: async (params = {}) =>
        client.searchResource<FhirList, List>({
          body: {
            resourceType: 'List',
            page: params.page || 0,
            pageSize: params.pageSize || 20,
            filters: ListMapperUtil.mapToFhirListFilters(params),
            resultFields: [
              'id',
              'status',
              'mode',
              'title',
              'code',
              'subject',
              'date',
              'source',
              'entry',
              'note'
            ],
          },
          mapFn: ListMapperUtil.mapFromFhirList,
        }),
      providesTags: [{ type: 'List' }],
    }),

    //* Get Lists by Patient ID ---------------------------------------------------
    getListsByPatientId: builder.query<
      SearchResourceResult<List>,
      string
    >({
      queryFn: async (patientId) =>
        client.searchResource<FhirList, List>({
          body: {
            resourceType: 'List',
            filters: {
              patient: patientId,
            },
            resultFields: [
              'id',
              'status',
              'mode',
              'title',
              'code',
              'subject',
              'date',
              'source',
              'entry',
              'note'
            ],
          },
          mapFn: ListMapperUtil.mapFromFhirList,
        }),
      providesTags: (_result, _error, patientId) => [
        { type: 'ListByPatient', id: patientId },
        { type: 'List' }
      ],
    }),

    //* Search Lists ---------------------------------------------------------------
    searchLists: builder.query<
      SearchResourceResult<List>,
      SearchListsRequest
    >({
      queryFn: async (request) =>
        client.searchResource<FhirList, List>({
          body: {
            resourceType: 'List',
            filters: ListMapperUtil.mapToFhirListFilters(request),
            resultFields: [
              'id',
              'status',
              'mode',
              'title',
              'code',
              'subject',
              'date',
              'source',
              'entry',
              'note'
            ],
          },
          mapFn: ListMapperUtil.mapFromFhirList,
        }),
      providesTags: [{ type: 'List' }],
    }),

    //* Create List ----------------------------------------------------------------
    createList: builder.mutation<
      List,
      CreateListRequest
    >({
      queryFn: (request) => {
        // Validate the request
        const validationErrors = ListMapperUtil.validateList(request);
        if (validationErrors.length > 0) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Validation failed',
              data: { errors: validationErrors },
            },
          };
        }

        return client.createResource<
          CreateListRequest,
          FhirListResource,
          List
        >({
          body: request,
          mapReqFn: ListMapperUtil.mapToFhirList as any,
          mapResFn: ListMapperUtil.mapFromFhirListResource,
        });
      },
      invalidatesTags: [
        { type: 'List' },
        { type: 'ListByPatient', id: 'LIST' }
      ],
    }),

    //* Update List ----------------------------------------------------------------
    updateList: builder.mutation<
      List,
      UpdateListRequest
    >({
      queryFn: (request) => {
        // Validate the request
        const validationErrors = ListMapperUtil.validateList(request);
        if (validationErrors.length > 0) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Validation failed',
              data: { errors: validationErrors },
            },
          };
        }

        return client.updateResource<
          UpdateListRequest,
          FhirListResource,
          List
        >({
          body: request,
          mapReqFn: ListMapperUtil.mapToFhirList as any,
          mapResFn: ListMapperUtil.mapFromFhirListResource,
        });
      },
      invalidatesTags: (_result, _error, { id, subject }) => [
        { type: 'List', id },
        { type: 'List' },
        { type: 'ListByPatient', id: subject }
      ],
    }),

    //* Delete List ----------------------------------------------------------------
    deleteList: builder.mutation<void, string>({
      queryFn: (id) => client.deleteResource('List', id),
      invalidatesTags: (_result, _error, id) => [
        { type: 'List', id },
        { type: 'List' },
        { type: 'ListByPatient', id: 'LIST' }
      ],
    }),

    //* Add Entry to List ----------------------------------------------------------
    addEntryToList: builder.mutation<
      List,
      { listId: string; entry: { reference: string; type?: string; display?: string } }
    >({
      queryFn: async ({ listId, entry }) => {
        try {
          // First, get the current list
          const currentListResult = await client.getResourceById<FhirListResource, List>({
            body: {
              resourceType: 'List',
              resourceId: listId,
            },
            mapFn: ListMapperUtil.mapFromFhirListResource,
          });

          if (currentListResult.error) {
            return { error: currentListResult.error };
          }

          const currentList = currentListResult.data as List;

          // Add the entry to the list
          const updatedList = ListMapperUtil.addEntryToList(currentList, {
            reference: entry.reference,
            type: entry.type,
            display: entry.display,
            date: new Date().toISOString(),
          });

          // Update the list
          return client.updateResource<
            UpdateListRequest,
            FhirListResource,
            List
          >({
            body: { ...updatedList, id: listId },
            mapReqFn: ListMapperUtil.mapToFhirList as any,
            mapResFn: ListMapperUtil.mapFromFhirListResource,
          });
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Failed to add entry to list',
              data: { message: error instanceof Error ? error.message : 'Unknown error' },
            },
          };
        }
      },
      invalidatesTags: (_result, _error, { listId }) => [
        { type: 'List', id: listId },
        { type: 'List' },
        { type: 'ListByPatient', id: 'LIST' }
      ],
    }),

    //* Remove Entry from List -----------------------------------------------------
    removeEntryFromList: builder.mutation<
      List,
      { listId: string; entryReference: string; entryType?: string }
    >({
      queryFn: async ({ listId, entryReference, entryType }) => {
        try {
          // First, get the current list
          const currentListResult = await client.getResourceById<FhirListResource, List>({
            body: {
              resourceType: 'List',
              resourceId: listId,
            },
            mapFn: ListMapperUtil.mapFromFhirListResource,
          });

          if (currentListResult.error) {
            return { error: currentListResult.error };
          }

          const currentList = currentListResult.data as List;

          // Remove the entry from the list
          const updatedList = ListMapperUtil.removeEntryFromList(
            currentList,
            entryReference,
            entryType
          );

          // Update the list
          return client.updateResource<
            UpdateListRequest,
            FhirListResource,
            List
          >({
            body: { ...updatedList, id: listId },
            mapReqFn: ListMapperUtil.mapToFhirList as any,
            mapResFn: ListMapperUtil.mapFromFhirListResource,
          });
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: 'Failed to remove entry from list',
              data: { message: error instanceof Error ? error.message : 'Unknown error' },
            },
          };
        }
      },
      invalidatesTags: (_result, _error, { listId }) => [
        { type: 'List', id: listId },
        { type: 'List' },
        { type: 'ListByPatient', id: 'LIST' }
      ],
    }),

    //* Get Lists by Code ----------------------------------------------------------
    getListsByCode: builder.query<
      SearchResourceResult<List>,
      { code: string; patientId?: string }
    >({
      queryFn: async ({ code, patientId }) =>
        client.searchResource<FhirList, List>({
          body: {
            resourceType: 'List',
            filters: {
              code,
              ...(patientId && { patient: patientId }),
            },
            resultFields: [
              'id',
              'status',
              'mode',
              'title',
              'code',
              'subject',
              'date',
              'source',
              'entry',
              'note'
            ],
          },
          mapFn: ListMapperUtil.mapFromFhirList,
        }),
      providesTags: (_result, _error, { patientId }) => [
        { type: 'List' },
        ...(patientId ? [{ type: 'ListByPatient' as const, id: patientId }] : [])
      ],
    }),
  }),
});

//* Export ---------------------------------------------------------------------
export const {
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
} = ListApi;

export default ListApi;