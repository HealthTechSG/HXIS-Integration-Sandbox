import type { Education, GetEducationListRequest } from './EducationTypes';
import type { FhirEducation } from './FhirEducationTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import EducationMapperUtil from './EducationMapperUtil';
import { UrlUtils } from '@/common/utils';
import type { SearchResourceResult } from '@/utils/fhir-client';
import { RtkFhirClient } from '@/utils/rtk-fhir-client';

//* Base Configs ---------------------------------------------------------------
const REDUCER_PATH = 'EducationApi';

const API_URL = UrlUtils.getApiUrl();
const client = RtkFhirClient(API_URL);

// Create the API using RTK query ----------------------------------------------
export const EducationApi = createApi({
  reducerPath: REDUCER_PATH,
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Education'],
  endpoints: (builder) => ({
    //* ------------------------------------------------------------------------
    //* Education CRUD
    //* ------------------------------------------------------------------------
    //* Fetch List
    getEducationList: builder.query<
      SearchResourceResult<Education>,
      GetEducationListRequest
    >({
      queryFn: async ({ page = 0, pageSize = 10 }) => {
        const { mapFromFhirEducation } = EducationMapperUtil;

        return client.searchResource<FhirEducation, Education>({
          body: {
            resourceType: 'Education',
            page,
            pageSize,
          },
          mapFn: mapFromFhirEducation,
        });
      },
      providesTags: [{ type: 'Education' }],
    }),

    //* Fetch By ID ------------------------------------------------------------
    getEducationById: builder.query<Education, string>({
      queryFn: (id) =>
        client.getResourceById<FhirEducation, Education>({
          body: {
            resourceType: 'Education',
            resourceId: id,
          },
          mapFn: EducationMapperUtil.mapFromFhirEducation,
        }),
      providesTags: (_result, _error, id) => [{ type: 'Education', id }],
    }),

    //* Create -----------------------------------------------------------------
    createEducation: builder.mutation<Education, Partial<Education>>({
      queryFn: (education) =>
        client.createResource<Partial<Education>, FhirEducation, Education>({
          body: education,
          mapReqFn: EducationMapperUtil.mapToFhirEducation,
          mapResFn: EducationMapperUtil.mapFromFhirEducation,
        }),
      invalidatesTags: [{ type: 'Education' }],
    }),

    //* Update -----------------------------------------------------------------
    updateEducation: builder.mutation<Education, Education>({
      queryFn: (education) =>
        client.updateResource<Education, FhirEducation, Education>({
          body: education,
          mapReqFn: EducationMapperUtil.mapToFhirEducation,
          mapResFn: EducationMapperUtil.mapFromFhirEducation,
        }),
      invalidatesTags: [{ type: 'Education' }],
    }),

    //* Delete -----------------------------------------------------------------
    deleteEducation: builder.mutation<void, string>({
      queryFn: (id) => client.deleteResource('Education', id),
      invalidatesTags: [{ type: 'Education' }],
    }),

    //* ------------------------------------------------------------------------
  }),
});

//* Export ---------------------------------------------------------------------
export const {
  useCreateEducationMutation,
  useDeleteEducationMutation,
  useGetEducationByIdQuery,
  useGetEducationListQuery,
  useUpdateEducationMutation,
} = EducationApi;
