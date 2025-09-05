import type {
  CustomInventory,
  GetCustomInventoryListRequest,
} from './CustomInventoryTypes';
import type { FhirCustomInventory } from './FhirCustomInventoryTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import CustomInventoryMapperUtil from './CustomInventoryMapperUtil';
import { UrlUtils } from '@/common/utils';
import type { SearchResourceResult } from '@/utils/fhir-client';
import { RtkFhirClient } from '@/utils/rtk-fhir-client';

//* Base Configs ---------------------------------------------------------------
const REDUCER_PATH = 'CustomInventoryApi';

const API_URL = UrlUtils.getApiUrl();
const client = RtkFhirClient(API_URL);

// Create the API using RTK query ----------------------------------------------
export const CustomInventoryApi = createApi({
  reducerPath: REDUCER_PATH,
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['CustomInventory'],
  endpoints: (builder) => ({
    //* ------------------------------------------------------------------------
    //* Education CRUD
    //* ------------------------------------------------------------------------
    //* Fetch List
    getCustomInventoryList: builder.query<
      SearchResourceResult<CustomInventory>,
      GetCustomInventoryListRequest
    >({
      queryFn: async ({
        page = 0,
        pageSize = 10,
        sortDirections = [],
        sortFields = [],
        ...filters
      }) => {
        const {
          mapFromFhirCustomInventory,
          mapToFhirCustomInventoryFilters,
          mapToFhirCustomInventorySortFields,
        } = CustomInventoryMapperUtil;

        return client.searchResource<FhirCustomInventory, CustomInventory>({
          body: {
            resourceType: 'CustomInventory',
            page,
            pageSize,
            sortFields: mapToFhirCustomInventorySortFields(
              sortFields,
              sortDirections,
            ),
            filters: mapToFhirCustomInventoryFilters(filters),
          },
          mapFn: mapFromFhirCustomInventory,
        });
      },
      providesTags: [{ type: 'CustomInventory' }],
    }),

    //* Fetch By ID ------------------------------------------------------------
    getCustomInventoryById: builder.query<CustomInventory, string>({
      queryFn: (id) =>
        client.getResourceById<FhirCustomInventory, CustomInventory>({
          body: {
            resourceType: 'CustomInventory',
            resourceId: id,
          },
          mapFn: CustomInventoryMapperUtil.mapFromFhirCustomInventory,
        }),
      providesTags: (_result, _error, id) => [{ type: 'CustomInventory', id }],
    }),

    //* Create -----------------------------------------------------------------
    createCustomInventory: builder.mutation<
      CustomInventory,
      Partial<CustomInventory>
    >({
      queryFn: (education) =>
        client.createResource<
          Partial<CustomInventory>,
          FhirCustomInventory,
          CustomInventory
        >({
          body: education,
          mapReqFn: CustomInventoryMapperUtil.mapToFhirCustomInventory,
          mapResFn: CustomInventoryMapperUtil.mapFromFhirCustomInventory,
        }),
      invalidatesTags: [{ type: 'CustomInventory' }],
    }),

    //* Update -----------------------------------------------------------------
    updateCustomInventory: builder.mutation<CustomInventory, CustomInventory>({
      queryFn: (education) =>
        client.updateResource<
          CustomInventory,
          FhirCustomInventory,
          CustomInventory
        >({
          body: education,
          mapReqFn: CustomInventoryMapperUtil.mapToFhirCustomInventory,
          mapResFn: CustomInventoryMapperUtil.mapFromFhirCustomInventory,
        }),
      invalidatesTags: [{ type: 'CustomInventory' }],
    }),

    //* Delete -----------------------------------------------------------------
    deleteCustomInventory: builder.mutation<void, string>({
      queryFn: (id) => client.deleteResource('CustomInventory', id),
      invalidatesTags: [{ type: 'CustomInventory' }],
    }),

    //* ------------------------------------------------------------------------
  }),
});

//* Export ---------------------------------------------------------------------
export const {
  useCreateCustomInventoryMutation,
  useDeleteCustomInventoryMutation,
  useGetCustomInventoryByIdQuery,
  useGetCustomInventoryListQuery,
  useUpdateCustomInventoryMutation,
} = CustomInventoryApi;
