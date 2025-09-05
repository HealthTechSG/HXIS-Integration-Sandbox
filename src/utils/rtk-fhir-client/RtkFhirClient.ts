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
      const fhirSearchResult = await fhirClient.searchResource<TFhirData>(body);

      // Transform the FhirPatient into the format we use.
      const entry = fhirSearchResult.entry?.map((fhirData) => mapFn(fhirData));
      const { total } = fhirSearchResult;

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
      const fhirRequestData = mapReqFn(body);

      const fhirResponseData =
        await fhirClient.createResource<TFhirData>(fhirRequestData);

      const data = mapResFn(fhirResponseData);

      return { data };
    } catch (error) {
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
      const fhirRequestData = mapReqFn(body);

      const fhirResponseData =
        await fhirClient.updateResource<TFhirData>(fhirRequestData);

      const data = mapResFn(fhirResponseData);

      return { data };
    } catch (error) {
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
      const requestBundleData = mapReqFn(body);
      const responseBundleData =
        await fhirClient.postBundleRequest(requestBundleData);

      const data = mapResFn(responseBundleData);

      return { data };
    } catch (error) {
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
