import type {
  Encounter,
  GetEncounterListRequest,
  CreateEncounterRequest,
  UpdateEncounterRequest,
  GetEncountersByPatientIdRequest,
} from './EncounterTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { Encounter as FhirEncounter } from 'fhir/r5';

import EncounterMapperUtil from './EncounterMapperUtil';
import { UrlUtils } from '@/common/utils';
import type { SearchResourceResult } from '@/utils/fhir-client';
import { RtkFhirClient } from '@/utils/rtk-fhir-client';

const REDUCER_PATH = 'EncounterApi';

const API_URL = UrlUtils.getApiUrl();
const client = RtkFhirClient(API_URL);

export const EncounterApi = createApi({
  reducerPath: REDUCER_PATH,
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Encounter'],
  endpoints: (builder) => ({
    getEncounterList: builder.query<
      SearchResourceResult<Encounter>,
      GetEncounterListRequest
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
          mapFromFhirEncounter,
          mapToFhirEncounterFilters,
          mapToFhirEncounterSortFields,
        } = EncounterMapperUtil;

        return client.searchResource<any, Encounter>({
          body: {
            resourceType: 'Encounter',
            page,
            pageSize,
            sortFields: mapToFhirEncounterSortFields(sortFields, sortDirections),
            filters: mapToFhirEncounterFilters({ search, ...filters }),
            resultFields: [
              'id',
              'status',
              'class',
              'serviceType',
              'priority',
              'subject',
              'participant',
              'period',
              'location',
              'reasonCode',
              'diagnosis',
            ],
          },
          mapFn: mapFromFhirEncounter,
        });
      },
      providesTags: [{ type: 'Encounter' }],
    }),

    getEncountersByPatientId: builder.query<
      SearchResourceResult<Encounter>,
      GetEncountersByPatientIdRequest
    >({
      queryFn: async ({ patientId, page = 0, pageSize = 10 }) => {
        return client.searchResource<any, Encounter>({
          body: {
            resourceType: 'Encounter',
            page,
            pageSize,
            filters: {
              patient: patientId,
            },
            resultFields: [
              'id',
              'status',
              'class',
              'serviceType',
              'priority',
              'subject',
              'participant',
              'period',
              'location',
              'reasonCode',
              'diagnosis',
            ],
          },
          mapFn: EncounterMapperUtil.mapFromFhirEncounter,
        });
      },
      providesTags: [{ type: 'Encounter' }],
    }),

    getEncounterById: builder.query<Encounter, string>({
      queryFn: (id) =>
        client.getResourceById<any, Encounter>({
          body: {
            resourceType: 'Encounter',
            resourceId: id,
          },
          mapFn: EncounterMapperUtil.mapFromFhirEncounter,
        }),
      providesTags: (_result, _error, id) => [{ type: 'Encounter', id }],
    }),

    createEncounter: builder.mutation<Encounter, CreateEncounterRequest>({
      queryFn: (request) => {
        console.log('🔵 [EncounterService] Received CreateEncounterRequest:', request);

        return client.createResource<CreateEncounterRequest, any, Encounter>({
          body: request,
          mapReqFn: EncounterMapperUtil.mapToFhirEncounter,
          mapResFn: EncounterMapperUtil.mapFromFhirEncounter,
        });
      },
      invalidatesTags: [{ type: 'Encounter' }],
    }),

    updateEncounter: builder.mutation<Encounter, UpdateEncounterRequest>({
      queryFn: (encounter) =>
        client.updateResource<UpdateEncounterRequest, any, Encounter>({
          body: encounter,
          mapReqFn: EncounterMapperUtil.mapToFhirEncounter,
          mapResFn: EncounterMapperUtil.mapFromFhirEncounter,
        }),
      invalidatesTags: [{ type: 'Encounter' }],
    }),

    deleteEncounter: builder.mutation<void, string>({
      queryFn: (id) => client.deleteResource('Encounter', id),
      invalidatesTags: [{ type: 'Encounter' }],
    }),
  }),
});

export const {
  useGetEncounterListQuery,
  useGetEncountersByPatientIdQuery,
  useGetEncounterByIdQuery,
  useCreateEncounterMutation,
  useUpdateEncounterMutation,
  useDeleteEncounterMutation,
} = EncounterApi;