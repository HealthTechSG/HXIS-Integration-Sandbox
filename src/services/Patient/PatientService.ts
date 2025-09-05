import type {
  Patient,
  GetPatientListRequest,
  PatientAllergy,
  PatientNextOfKin,
  PatientRemarks,
  CreatePatientRequest,
  PatientImmunization,
} from './PatientTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Patient as FhirPatient,
  Communication as FhirCommunication,
  AllergyIntolerance as FhirAllergy,
  RelatedPerson as FhirRelatedPerson,
  Immunization as FhirImmunization,
} from 'fhir/r5';

import PatientMapperUtil from './PatientMapperUtil';
import { UrlUtils } from '@/common/utils';
import type { SearchResourceResult } from '@/utils/fhir-client';
import { RtkFhirClient } from '@/utils/rtk-fhir-client';

//* Base Configs ---------------------------------------------------------------
const REDUCER_PATH = 'PatientApi';

const API_URL = UrlUtils.getApiUrl();
const client = RtkFhirClient(API_URL);

// Create the API using RTK query ----------------------------------------------
export const PatientApi = createApi({
  reducerPath: REDUCER_PATH,
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: [
    'Patient',
    'PatientAllergy',
    'PatientNextOfKin',
    'PatientImmunization',
    'PatientRemarks',
  ],
  endpoints: (builder) => ({
    //* ------------------------------------------------------------------------
    //* Patient CRUD
    //* ------------------------------------------------------------------------
    //* Fetch List
    getPatientList: builder.query<
      SearchResourceResult<Patient>,
      GetPatientListRequest
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
          mapFromFhirPatient,
          mapToFhirPatientFilters,
          mapToFhirPatientSortFields,
        } = PatientMapperUtil;

        return client.searchResource<FhirPatient, Patient>({
          body: {
            resourceType: 'Patient',
            page,
            pageSize,
            sortFields: mapToFhirPatientSortFields(sortFields, sortDirections),
            filters: mapToFhirPatientFilters({ search, ...filters }),
            resultFields: ['id', 'identifier', 'name', 'telecom', 'gender'],
          },
          mapFn: mapFromFhirPatient,
        });
      },
      providesTags: [{ type: 'Patient' }],
    }),

    //* Fetch By ID ------------------------------------------------------------
    getPatientById: builder.query<Patient, string>({
      queryFn: (id) =>
        client.getResourceById<FhirPatient, Patient>({
          body: {
            resourceType: 'Patient',
            resourceId: id,
          },
          mapFn: PatientMapperUtil.mapFromFhirPatient,
        }),
      providesTags: (_result, _error, id) => [{ type: 'Patient', id }],
    }),

    //* Create -----------------------------------------------------------------
    // The Create Patient is done in a transaction bundle, to create the references together.
    createPatient: builder.mutation<Patient, CreatePatientRequest>({
      queryFn: (request) =>
        client.postBundleRequest<CreatePatientRequest, Patient>({
          body: request,
          mapReqFn: PatientMapperUtil.mapCreatePatientRequestToFhirBundle,
          mapResFn: PatientMapperUtil.mapCreatePatientResponseFromFhirBundle,
        }),
      invalidatesTags: [{ type: 'Patient' }],
    }),

    //* Update -----------------------------------------------------------------
    updatePatient: builder.mutation<Patient, Patient>({
      queryFn: (patient) =>
        client.updateResource<Patient, FhirPatient, Patient>({
          body: patient,
          mapReqFn: PatientMapperUtil.mapToFhirPatient,
          mapResFn: PatientMapperUtil.mapFromFhirPatient,
        }),
      invalidatesTags: [{ type: 'Patient' }],
    }),

    //* Delete -----------------------------------------------------------------
    deletePatient: builder.mutation<void, string>({
      queryFn: (id) => client.deleteResource('Patient', id),
      invalidatesTags: [{ type: 'Patient' }],
    }),

    //* ------------------------------------------------------------------------
    //* Patient Allergy
    //* ------------------------------------------------------------------------
    //* Fetch List
    getPatientAllergyListByPatientId: builder.query<
      SearchResourceResult<PatientAllergy>,
      string
    >({
      queryFn: async (patientId) =>
        client.searchResource<FhirAllergy, PatientAllergy>({
          body: {
            resourceType: 'AllergyIntolerance',
            filters: {
              patient: patientId,
            },
          },
          mapFn: PatientMapperUtil.mapFromFhirAllergy,
        }),
      providesTags: [{ type: 'PatientAllergy' }],
    }),

    //* Fetch By ID ------------------------------------------------------------
    getPatientAllergyById: builder.query<PatientAllergy, string>({
      queryFn: async (id) =>
        client.getResourceById<FhirAllergy, PatientAllergy>({
          body: {
            resourceType: 'AllergyIntolerance',
            resourceId: id,
          },
          mapFn: PatientMapperUtil.mapFromFhirAllergy,
        }),
      providesTags: (_result, _error, id) => [{ type: 'PatientAllergy', id }],
    }),

    //* Create -----------------------------------------------------------------
    createPatientAllergy: builder.mutation<
      PatientAllergy,
      Partial<PatientAllergy>
    >({
      queryFn: async (patientAllergy) =>
        client.createResource<
          Partial<PatientAllergy>,
          FhirAllergy,
          PatientAllergy
        >({
          body: patientAllergy,
          mapReqFn: PatientMapperUtil.mapToFhirAllergy,
          mapResFn: PatientMapperUtil.mapFromFhirAllergy,
        }),
      invalidatesTags: [{ type: 'PatientAllergy' }],
    }),

    //* Update -----------------------------------------------------------------
    updatePatientAllergy: builder.mutation<PatientAllergy, PatientAllergy>({
      queryFn: async (patientAllergy) =>
        client.updateResource<PatientAllergy, FhirAllergy, PatientAllergy>({
          body: patientAllergy,
          mapReqFn: PatientMapperUtil.mapToFhirAllergy,
          mapResFn: PatientMapperUtil.mapFromFhirAllergy,
        }),
      invalidatesTags: [{ type: 'PatientAllergy' }],
    }),

    //* Delete -----------------------------------------------------------------
    deletePatientAllergy: builder.mutation<void, string>({
      queryFn: async (id) => client.deleteResource('AllergyIntolerance', id),
      invalidatesTags: [{ type: 'PatientAllergy' }],
    }),

    //* ------------------------------------------------------------------------
    //* Patient Next of Kin
    //* ------------------------------------------------------------------------
    //* Fetch List
    getPatientNextOfKinListByPatientId: builder.query<
      SearchResourceResult<PatientNextOfKin>,
      string
    >({
      queryFn: async (patientId) =>
        client.searchResource<FhirRelatedPerson, PatientNextOfKin>({
          body: {
            resourceType: 'RelatedPerson',
            filters: {
              patient: patientId,
            },
          },
          mapFn: PatientMapperUtil.mapFromFhirRelatedPerson,
        }),
      providesTags: [{ type: 'PatientNextOfKin' }],
    }),

    //* Fetch By ID ------------------------------------------------------------
    getPatientNextOfKinById: builder.query<PatientNextOfKin, string>({
      queryFn: async (id) =>
        client.getResourceById<FhirRelatedPerson, PatientNextOfKin>({
          body: {
            resourceType: 'RelatedPerson',
            resourceId: id,
          },
          mapFn: PatientMapperUtil.mapFromFhirRelatedPerson,
        }),
      providesTags: (_result, _error, id) => [{ type: 'PatientNextOfKin', id }],
    }),

    //* Create -----------------------------------------------------------------
    createPatientNextOfKin: builder.mutation<
      PatientNextOfKin,
      Partial<PatientNextOfKin>
    >({
      queryFn: async (patientNextOfKin) =>
        client.createResource<
          Partial<PatientNextOfKin>,
          FhirRelatedPerson,
          PatientNextOfKin
        >({
          body: patientNextOfKin,
          mapReqFn: PatientMapperUtil.mapToFhirRelatedPerson,
          mapResFn: PatientMapperUtil.mapFromFhirRelatedPerson,
        }),
      invalidatesTags: [{ type: 'PatientNextOfKin' }],
    }),

    //* Update -----------------------------------------------------------------
    updatePatientNextOfKin: builder.mutation<
      PatientNextOfKin,
      PatientNextOfKin
    >({
      queryFn: async (patientNextOfKin) =>
        client.updateResource<
          PatientNextOfKin,
          FhirRelatedPerson,
          PatientNextOfKin
        >({
          body: patientNextOfKin,
          mapReqFn: PatientMapperUtil.mapToFhirRelatedPerson,
          mapResFn: PatientMapperUtil.mapFromFhirRelatedPerson,
        }),
      invalidatesTags: [{ type: 'PatientNextOfKin' }],
    }),

    //* Delete -----------------------------------------------------------------
    deletePatientNextOfKin: builder.mutation<void, string>({
      queryFn: async (id) => client.deleteResource('RelatedPerson', id),
      invalidatesTags: [{ type: 'PatientNextOfKin' }],
    }),

    //* ------------------------------------------------------------------------
    //* Patient Immunization
    //* ------------------------------------------------------------------------
    //* Fetch List
    getPatientImmunizationByPatientId: builder.query<
      SearchResourceResult<PatientImmunization>,
      string
    >({
      queryFn: async (patientId) =>
        client.searchResource<FhirImmunization, PatientImmunization>({
          body: {
            resourceType: 'Immunization',
            filters: {
              patient: patientId,
            },
            resultFields: [
              'id',
              'vaccineCode',
              'administeredProduct',
              'manufacturer',
              'occurrence',
            ],
          },
          mapFn: PatientMapperUtil.mapFromFhirImmunization,
        }),
      providesTags: [{ type: 'PatientImmunization' }],
    }),

    //* Fetch By ID ------------------------------------------------------------
    getPatientImmunizationById: builder.query<PatientImmunization, string>({
      queryFn: async (id) =>
        client.getResourceById<FhirImmunization, PatientImmunization>({
          body: {
            resourceType: 'Immunization',
            resourceId: id,
          },
          mapFn: PatientMapperUtil.mapFromFhirImmunization,
        }),
      providesTags: (_result, _error, id) => [
        { type: 'PatientImmunization', id },
      ],
    }),

    //* Create -----------------------------------------------------------------
    createPatientImmunization: builder.mutation<
      PatientImmunization,
      Partial<PatientImmunization>
    >({
      queryFn: async (data) =>
        client.createResource<
          Partial<PatientImmunization>,
          FhirImmunization,
          PatientImmunization
        >({
          body: data,
          mapReqFn: PatientMapperUtil.mapToFhirImmunization,
          mapResFn: PatientMapperUtil.mapFromFhirImmunization,
        }),
      invalidatesTags: [{ type: 'PatientImmunization' }],
    }),

    //* Update -----------------------------------------------------------------
    updatePatientImmunization: builder.mutation<
      PatientImmunization,
      PatientImmunization
    >({
      queryFn: async (data) =>
        client.updateResource<
          PatientImmunization,
          FhirImmunization,
          PatientImmunization
        >({
          body: data,
          mapReqFn: PatientMapperUtil.mapToFhirImmunization,
          mapResFn: PatientMapperUtil.mapFromFhirImmunization,
        }),
      invalidatesTags: [{ type: 'PatientImmunization' }],
    }),

    //* Delete -----------------------------------------------------------------
    deletePatientImmunization: builder.mutation<void, string>({
      queryFn: async (id) => client.deleteResource('Immunization', id),
      invalidatesTags: [{ type: 'PatientImmunization' }],
    }),

    //* ------------------------------------------------------------------------
    //* Patient Remarks
    //* ------------------------------------------------------------------------
    //* Fetch List
    getPatientRemarksListByPatientId: builder.query<
      SearchResourceResult<PatientRemarks>,
      string
    >({
      queryFn: async (patientId) =>
        client.searchResource<FhirCommunication, PatientRemarks>({
          body: {
            resourceType: 'Communication',
            filters: {
              patient: patientId,
            },
          },
          mapFn: PatientMapperUtil.mapFromFhirCommunication,
        }),
      providesTags: [{ type: 'PatientRemarks' }],
    }),

    //* Fetch By ID ------------------------------------------------------------
    getPatientRemarksById: builder.query<PatientRemarks, string>({
      queryFn: async (id) =>
        client.getResourceById<FhirCommunication, PatientRemarks>({
          body: {
            resourceType: 'Communication',
            resourceId: id,
          },
          mapFn: PatientMapperUtil.mapFromFhirCommunication,
        }),
      providesTags: (_result, _error, id) => [{ type: 'PatientRemarks', id }],
    }),

    //* Create -----------------------------------------------------------------
    createPatientRemarks: builder.mutation<
      PatientRemarks,
      Partial<PatientRemarks>
    >({
      queryFn: async (patientRemarks) =>
        client.createResource<
          Partial<PatientRemarks>,
          FhirCommunication,
          PatientRemarks
        >({
          body: patientRemarks,
          mapReqFn: PatientMapperUtil.mapToFhirCommunication,
          mapResFn: PatientMapperUtil.mapFromFhirCommunication,
        }),
      invalidatesTags: [{ type: 'PatientRemarks' }],
    }),

    //* Update -----------------------------------------------------------------
    updatePatientRemarks: builder.mutation<PatientRemarks, PatientRemarks>({
      queryFn: async (patientRemarks) =>
        client.updateResource<
          PatientRemarks,
          FhirCommunication,
          PatientRemarks
        >({
          body: patientRemarks,
          mapReqFn: PatientMapperUtil.mapToFhirCommunication,
          mapResFn: PatientMapperUtil.mapFromFhirCommunication,
        }),
      invalidatesTags: [{ type: 'PatientRemarks' }],
    }),

    //* Delete -----------------------------------------------------------------
    deletePatientRemarks: builder.mutation<void, string>({
      queryFn: async (id) => client.deleteResource('Communication', id),
      invalidatesTags: [{ type: 'PatientRemarks' }],
    }),

    //* ------------------------------------------------------------------------
  }),
});

//* Export ---------------------------------------------------------------------
export const {
  useCreatePatientAllergyMutation,
  useCreatePatientImmunizationMutation,
  useCreatePatientMutation,
  useCreatePatientNextOfKinMutation,
  useCreatePatientRemarksMutation,
  useDeletePatientAllergyMutation,
  useDeletePatientImmunizationMutation,
  useDeletePatientMutation,
  useDeletePatientNextOfKinMutation,
  useDeletePatientRemarksMutation,
  useGetPatientAllergyByIdQuery,
  useGetPatientAllergyListByPatientIdQuery,
  useGetPatientByIdQuery,
  useGetPatientImmunizationByIdQuery,
  useGetPatientImmunizationByPatientIdQuery,
  useGetPatientListQuery,
  useGetPatientNextOfKinByIdQuery,
  useGetPatientNextOfKinListByPatientIdQuery,
  useGetPatientRemarksByIdQuery,
  useGetPatientRemarksListByPatientIdQuery,
  useUpdatePatientAllergyMutation,
  useUpdatePatientImmunizationMutation,
  useUpdatePatientMutation,
  useUpdatePatientNextOfKinMutation,
  useUpdatePatientRemarksMutation,
} = PatientApi;
