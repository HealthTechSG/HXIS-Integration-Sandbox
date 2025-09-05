import { Bundle } from 'fhir/r5';

import {
  GetResourceByIdProps as FhirClientGetResourceByIdProps,
  SearchResourceProps as FhirClientSearchResourceProps,
} from '../fhir-client/FhirClientTypes';

//* Common Types ---------------------------------------------------------------
export type MapFromFhirData<TFhirData, TResponseData> = (
  fhirData: TFhirData,
) => TResponseData;

export type MapToFhirData<TRequestData, TFhirData> = (
  requestData: TRequestData,
) => TFhirData;

//* Function Params ------------------------------------------------------------
export type SearchResourceProps<TFhirData, TResponseData> = {
  body: FhirClientSearchResourceProps;
  mapFn: MapFromFhirData<TFhirData, TResponseData>;
};

export type GetResourceByIdProps<TFhirData, TResponseData> = {
  body: FhirClientGetResourceByIdProps;
  mapFn: MapFromFhirData<TFhirData, TResponseData>;
};

export type CreateResourceProps<TRequestData, TFhirData, TResponseData> = {
  body: TRequestData;
  mapReqFn: MapToFhirData<TRequestData, TFhirData>;
  mapResFn: MapFromFhirData<TFhirData, TResponseData>;
};

// Update and Create have the same type.
export type UpdateResourceProps<TRequestData, TFhirData, TResponseData> =
  CreateResourceProps<TRequestData, TFhirData, TResponseData>;

export type PostBundleRequestProps<TRequestData, TResponseData> = {
  body: TRequestData;
  mapReqFn: MapToFhirData<TRequestData, Bundle>;
  mapResFn: MapFromFhirData<Bundle, TResponseData>;
};
