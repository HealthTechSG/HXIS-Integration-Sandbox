/**
 * Another wrapper, to make it easier to use in RTK Query's QueryFn.
 * This util will convert the input and output to make it easier to use in RTK Query.
 */
import type {
  CreateResourceProps,
  GetResourceByIdProps,
  SearchResourceProps,
  UpdateResourceProps,
  PostBundleRequestProps,
} from './RtkFhirClientTypes';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import type { SearchResourceResult } from '@/utils/fhir-client';
import { FhirClient } from '@/utils/fhir-client';

//* Util -----------------------------------------------------------------------
const RtkFhirClient = (baseUrl: string) => {
  const fhirClient = FhirClient(baseUrl);

  //* Search Resource ----------------------------------------------------------
  const searchResource = async <TFhirData, TResponseData>({
    body,
    mapFn,
  }: SearchResourceProps<TFhirData, TResponseData>) => {
    try {
      console.log('🟡 [RtkFhirClient] Body received from ObservationService:', body);
      console.log('🟡 [RtkFhirClient] About to call fhirClient.searchResource with body:', body);
      
      const fhirSearchResult = await fhirClient.searchResource<TFhirData>(body);

      // Transform the FhirPatient into the format we use.
      const entry = fhirSearchResult.entry?.map((fhirData) => mapFn(fhirData)) || [];
      const total = fhirSearchResult.total || 0;

      const data = { entry, total } as SearchResourceResult<TResponseData>;
      return { data };
    } catch (error) {
      return { error: error as FetchBaseQueryError };
    }
  };

  //* Get Resource by ID -------------------------------------------------------
  const getResourceById = async <TFhirData, TResponseData>({
    body,
    mapFn,
  }: GetResourceByIdProps<TFhirData, TResponseData>) => {
    try {
      const fhirData = await fhirClient.getResourceById<TFhirData>(body);

      // Transform the FhirPatient into the format we use.
      const data = mapFn(fhirData);

      return { data };
    } catch (error) {
      return { error: error as FetchBaseQueryError };
    }
  };

  //* Create Resource ----------------------------------------------------------
  const createResource = async <TRequestData, TFhirData, TResponseData>({
    body,
    mapReqFn,
    mapResFn,
  }: CreateResourceProps<TRequestData, TFhirData, TResponseData>) => {
    try {
      console.log('🟡 [RtkFhirClient] Input request data for createResource:', body);
      
      const fhirRequestData = mapReqFn(body);
      console.log('🟡 [RtkFhirClient] After mapReqFn transformation to FHIR Patient:', fhirRequestData);

      const fhirResponseData =
        await fhirClient.createResource<TFhirData>(fhirRequestData);
      console.log('🟡 [RtkFhirClient] Raw FHIR response from server:', fhirResponseData);

      const data = mapResFn(fhirResponseData);
      console.log('🟡 [RtkFhirClient] After mapResFn transformation back to app format:', data);

      return { data };
    } catch (error) {
      console.log('🟡 [RtkFhirClient] Error occurred in createResource:', error);
      return { error: error as FetchBaseQueryError };
    }
  };

  //* Update Resource ----------------------------------------------------------
  const updateResource = async <TRequestData, TFhirData, TResponseData>({
    body,
    mapReqFn,
    mapResFn,
  }: UpdateResourceProps<TRequestData, TFhirData, TResponseData>) => {
    try {
      console.log('🟡 [RtkFhirClient] Input request data for updateResource:', body);
      
      const fhirRequestData = mapReqFn(body);
      console.log('🟡 [RtkFhirClient] After mapReqFn transformation to FHIR Patient:', fhirRequestData);

      const fhirResponseData =
        await fhirClient.updateResource<TFhirData>(fhirRequestData);
      console.log('🟡 [RtkFhirClient] Raw FHIR response from server:', fhirResponseData);

      const data = mapResFn(fhirResponseData);
      console.log('🟡 [RtkFhirClient] After mapResFn transformation back to app format:', data);

      return { data };
    } catch (error) {
      console.log('🟡 [RtkFhirClient] Error occurred in updateResource:', error);
      return { error: error as FetchBaseQueryError };
    }
  };

  //* Delete Resource ----------------------------------------------------------
  const deleteResource = async (resourceType: string, resourceId: string) => {
    try {
      await fhirClient.deleteResource(resourceType, resourceId);

      return { data: undefined };
    } catch (error) {
      return { error: error as FetchBaseQueryError };
    }
  };

  //* Bundle Request -----------------------------------------------------------
  const postBundleRequest = async <TRequestData, TResponseData>({
    body,
    mapReqFn,
    mapResFn,
  }: PostBundleRequestProps<TRequestData, TResponseData>) => {
    try {
      console.log('🟡 [RtkFhirClient] Input request data:', body);
      
      const requestBundleData = mapReqFn(body);
      console.log('🟡 [RtkFhirClient] After mapReqFn transformation to FHIR Bundle:', requestBundleData);
      
      const responseBundleData =
        await fhirClient.postBundleRequest(requestBundleData);
      console.log('🟡 [RtkFhirClient] Raw FHIR response from server:', responseBundleData);

      const data = mapResFn(responseBundleData);
      console.log('🟡 [RtkFhirClient] After mapResFn transformation back to app format:', data);

      return { data };
    } catch (error) {
      console.log('🟡 [RtkFhirClient] Error occurred:', error);
      return { error: error as FetchBaseQueryError };
    }
  };

  //* Return -------------------------------------------------------------------
  return {
    searchResource,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
    postBundleRequest,
  };
};

//* Export ---------------------------------------------------------------------
export default RtkFhirClient;
