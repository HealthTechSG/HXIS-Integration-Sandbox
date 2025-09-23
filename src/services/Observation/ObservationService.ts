import type {
  Observation,
  GetObservationListRequest,
  CreateObservationRequest,
  UpdateObservationRequest,
} from './ObservationTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Observation as FhirObservation,
} from 'fhir/r5';

import ObservationMapperUtil from './ObservationMapperUtil';
import { UrlUtils } from '@/common/utils';
import type { SearchResourceResult } from '@/utils/fhir-client';
import { RtkFhirClient } from '@/utils/rtk-fhir-client';

//* Base Configs ---------------------------------------------------------------
const REDUCER_PATH = 'ObservationApi';

const API_URL = UrlUtils.getApiUrl();
const client = RtkFhirClient(API_URL);

// Create the API using RTK query ----------------------------------------------
export const ObservationApi = createApi({
  reducerPath: REDUCER_PATH,
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Observation'],
  endpoints: (builder) => ({
    //* ------------------------------------------------------------------------
    //* Observation CRUD
    //* ------------------------------------------------------------------------
    //* Fetch List
    getObservationList: builder.query<
      SearchResourceResult<Observation>,
      GetObservationListRequest
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
          mapFromFhirObservation,
          mapToFhirObservationFilters,
          mapToFhirObservationSortFields,
        } = ObservationMapperUtil;

        return client.searchResource<FhirObservation, Observation>({
          body: {
            resourceType: 'Observation',
            page,
            pageSize,
            sortFields: mapToFhirObservationSortFields(sortFields, sortDirections),
            filters: mapToFhirObservationFilters({ search, ...filters }),
            resultFields: [
              'id',
              'status',
              'category',
              'code',
              'subject',
              'effectiveDateTime',
              'valueQuantity',
              'component',
              'interpretation',
              'referenceRange',
            ],
          },
          mapFn: mapFromFhirObservation,
        });
      },
      providesTags: [{ type: 'Observation' }],
    }),

    //* Fetch List By Patient ID -----------------------------------------------
    getObservationListByPatientId: builder.query<
      SearchResourceResult<Observation>,
      { patientId: string } & Omit<GetObservationListRequest, 'patientId'>
    >({
      queryFn: async ({
        page = 0,
        pageSize = 10,
        patientId,
        search,
        sortDirections = [],
        sortFields = [],
        ...filters
      }) => {
        const {
          mapFromFhirObservation,
          mapToFhirObservationFilters,
          mapToFhirObservationSortFields,
        } = ObservationMapperUtil;

        return client.searchResource<FhirObservation, Observation>({
          body: {
            resourceType: 'Observation',
            page,
            pageSize,
            sortFields: mapToFhirObservationSortFields(sortFields, sortDirections),
            filters: mapToFhirObservationFilters({ 
              patientId, 
              search, 
              ...filters 
            }),
            resultFields: [
              'id',
              'status',
              'category',
              'code',
              'subject',
              'effectiveDateTime',
              'valueQuantity',
              'component',
              'interpretation',
              'referenceRange',
            ],
          },
          mapFn: mapFromFhirObservation,
        });
      },
      providesTags: (_result, _error, { patientId }) => [
        { type: 'Observation', id: `patient-${patientId}` }
      ],
    }),

    //* Fetch Vital Signs By Patient ID ----------------------------------------
    getVitalSignsByPatientId: builder.query<
      Record<string, Observation[]>,
      string
    >({
      queryFn: async (patientId) => {
        const requestBody = {
          resourceType: 'Observation',
          filters: {
            patient: patientId,
            category: 'vital-signs',
            _count: 100
          },
          resultFields: [
            'id',
            'status',
            'category',
            'code',
            'subject',
            'effectiveDateTime',
            'valueQuantity',
            'component',
            'interpretation',
            'referenceRange',
          ],
        };
        
        console.log('🔵 [ObservationService] Request body before sending to FHIR API:', requestBody);
        console.log('🔵 [ObservationService] Filters being sent:', requestBody.filters);
        
        const response = await client.searchResource<FhirObservation, Observation>({
          body: requestBody,
          mapFn: ObservationMapperUtil.mapFromFhirObservation,
        });

        console.log(response);

        if (response.error) {
          return response;
        }

        // Group observations by code for easy access - now as arrays
        const vitalSigns: Record<string, Observation[]> = {
          heartRate: [],
          bloodPressure: [],
          satO2: [],
          temperature: [],
          respiratoryRate: [],
          weight: [],
          height: [],
          bmi: [],
        };
        
        // Handle empty bundles - entry might be undefined or empty
        const entries = response.data.entry || [];
        entries.forEach((observation: Observation) => {
          switch (observation.code) {
            case '8867-4': // Heart rate
              vitalSigns.heartRate.push(observation);
              break;
            case '85354-9': // Blood pressure
              vitalSigns.bloodPressure.push(observation);
              break;
            case '2708-6': // Oxygen saturation
              vitalSigns.satO2.push(observation);
              break;
            case '8310-5': // Temperature
              vitalSigns.temperature.push(observation);
              break;
            case '9279-1': // Respiratory rate
              vitalSigns.respiratoryRate.push(observation);
              break;
            case '29463-7': // Weight
              vitalSigns.weight.push(observation);
              break;
            case '8302-2': // Height
              vitalSigns.height.push(observation);
              break;
            case '39156-5': // BMI
              vitalSigns.bmi.push(observation);
              break;
            default:
              // For other codes, create array if doesn't exist and push
              if (!vitalSigns[observation.code]) {
                vitalSigns[observation.code] = [];
              }
              vitalSigns[observation.code].push(observation);
          }
        });

        return { data: vitalSigns };
      },
      providesTags: (_result, _error, patientId) => [
        { type: 'Observation', id: `vitals-${patientId}` }
      ],
    }),

    //* Fetch By ID ------------------------------------------------------------
    getObservationById: builder.query<Observation, string>({
      queryFn: (id) =>
        client.getResourceById<FhirObservation, Observation>({
          body: {
            resourceType: 'Observation',
            resourceId: id,
          },
          mapFn: ObservationMapperUtil.mapFromFhirObservation,
        }),
      providesTags: (_result, _error, id) => [{ type: 'Observation', id }],
    }),

    //* Create -----------------------------------------------------------------
    createObservation: builder.mutation<Observation, CreateObservationRequest>({
      queryFn: (request) => {
        
        return client.createResource<CreateObservationRequest, FhirObservation, Observation>({
          body: request,
          mapReqFn: ObservationMapperUtil.mapToFhirObservation,
          mapResFn: ObservationMapperUtil.mapFromFhirObservation,
        });
      },
      invalidatesTags: (_result, _error, request) => [
        { type: 'Observation' },
        // Invalidate patient-specific caches
        ...(request.patientId ? [
          { type: 'Observation' as const, id: `patient-${request.patientId}` },
          { type: 'Observation' as const, id: `vitals-${request.patientId}` }
        ] : [])
      ],
    }),

    //* Update -----------------------------------------------------------------
    updateObservation: builder.mutation<Observation, UpdateObservationRequest>({
      queryFn: (observation) =>
        client.updateResource<UpdateObservationRequest, FhirObservation, Observation>({
          body: observation,
          mapReqFn: ObservationMapperUtil.mapToFhirObservation,
          mapResFn: ObservationMapperUtil.mapFromFhirObservation,
        }),
      invalidatesTags: (_result, _error, observation) => [
        { type: 'Observation' },
        // Invalidate patient-specific caches
        ...(observation.patientId ? [
          { type: 'Observation' as const, id: `patient-${observation.patientId}` },
          { type: 'Observation' as const, id: `vitals-${observation.patientId}` }
        ] : [])
      ],
    }),

    //* Delete -----------------------------------------------------------------
    deleteObservation: builder.mutation<void, string>({
      queryFn: (id) => client.deleteResource('Observation', id),
      invalidatesTags: [{ type: 'Observation' }],
    }),

    //* ------------------------------------------------------------------------
  }),
});

//* Export ---------------------------------------------------------------------
export const {
  useCreateObservationMutation,
  useDeleteObservationMutation,
  useGetObservationByIdQuery,
  useGetObservationListByPatientIdQuery,
  useGetObservationListQuery,
  useGetVitalSignsByPatientIdQuery,
  useUpdateObservationMutation,
} = ObservationApi;