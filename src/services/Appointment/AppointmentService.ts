import type {
  Appointment,
  CreateAppointmentRequest,
  GetAppointmentListRequest,
  GetAppointmentsByPatientIdRequest,
  UpdateAppointmentRequest,
} from './AppointmentTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import AppointmentMapperUtil from './AppointmentMapperUtil';
import { UrlUtils } from '@/common/utils';
import type { SearchResourceResult } from '@/utils/fhir-client';
import { RtkFhirClient } from '@/utils/rtk-fhir-client';

const REDUCER_PATH = 'AppointmentApi';

const API_URL = UrlUtils.getApiUrl();
const client = RtkFhirClient(API_URL);

export const AppointmentApi = createApi({
  reducerPath: REDUCER_PATH,
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Appointment'],
  endpoints: (builder) => ({
    getAppointmentList: builder.query<
      SearchResourceResult<Appointment>,
      GetAppointmentListRequest
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
          mapFromFhirAppointment,
          mapToFhirAppointmentFilters,
          mapToFhirAppointmentSortFields,
        } = AppointmentMapperUtil;

        return client.searchResource<any, Appointment>({
          body: {
            resourceType: 'Appointment',
            page,
            pageSize,
            sortFields: mapToFhirAppointmentSortFields(sortFields, sortDirections),
            filters: mapToFhirAppointmentFilters({ search, ...filters }),
            resultFields: [
              'id',
              'status',
              'serviceCategory',
              'serviceType',
              'specialty',
              'appointmentType',
              'reasonReference',
              'priority',
              'description',
              'start',
              'end',
              'created',
              'comment',
              'participant',
            ],
          },
          mapFn: mapFromFhirAppointment,
        });
      },
      providesTags: [{ type: 'Appointment' }],
    }),

    getAppointmentsByPatientId: builder.query<
      SearchResourceResult<Appointment>,
      GetAppointmentsByPatientIdRequest
    >({
      queryFn: async ({ page = 0, pageSize = 10, patientId }) =>
        client.searchResource<any, Appointment>({
          body: {
            resourceType: 'Appointment',
            page,
            pageSize,
            filters: {
              actor: `Patient/${patientId}`,
            },
            resultFields: [
              'id',
              'status',
              'serviceCategory',
              'serviceType',
              'specialty',
              'appointmentType',
              'reasonReference',
              'priority',
              'description',
              'start',
              'end',
              'created',
              'comment',
              'participant',
            ],
          },
          mapFn: AppointmentMapperUtil.mapFromFhirAppointment,
        }),
      providesTags: [{ type: 'Appointment' }],
    }),

    getAppointmentById: builder.query<Appointment, string>({
      queryFn: (id) =>
        client.getResourceById<any, Appointment>({
          body: {
            resourceType: 'Appointment',
            resourceId: id,
          },
          mapFn: AppointmentMapperUtil.mapFromFhirAppointment,
        }),
      providesTags: (_result, _error, id) => [{ type: 'Appointment', id }],
    }),

    createAppointment: builder.mutation<Appointment, CreateAppointmentRequest>({
      queryFn: (request) =>
        client.createResource<CreateAppointmentRequest, any, Appointment>({
          body: request,
          mapReqFn: AppointmentMapperUtil.mapToFhirAppointment,
          mapResFn: AppointmentMapperUtil.mapFromFhirAppointment,
        }),
      invalidatesTags: [{ type: 'Appointment' }],
    }),

    updateAppointment: builder.mutation<Appointment, UpdateAppointmentRequest>({
      queryFn: (appointment) =>
        client.updateResource<UpdateAppointmentRequest, any, Appointment>({
          body: appointment,
          mapReqFn: AppointmentMapperUtil.mapToFhirAppointment,
          mapResFn: AppointmentMapperUtil.mapFromFhirAppointment,
        }),
      invalidatesTags: [{ type: 'Appointment' }],
    }),

    deleteAppointment: builder.mutation<void, string>({
      queryFn: (id) => client.deleteResource('Appointment', id),
      invalidatesTags: [{ type: 'Appointment' }],
    }),
  }),
});

export const {
  useCreateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentByIdQuery,
  useGetAppointmentListQuery,
  useGetAppointmentsByPatientIdQuery,
  useUpdateAppointmentMutation,
} = AppointmentApi;
