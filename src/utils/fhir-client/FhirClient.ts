/**
 * A wrapper around the FHIR client to make it easier for use.
 * This util convert the request and response to make it compatible with the Smart on FHIR client.
 */
import type {
  SearchResourceProps,
  SearchResourceResult,
  GetResourceByIdProps,
} from './FhirClientTypes';
import { Bundle, Resource } from 'fhir/r5';
import FHIR from 'fhirclient';
// import { isEmpty } from 'lodash-es';
import { User } from 'oidc-client-ts';
// import queryString from 'query-string';

//* Util -----------------------------------------------------------------------
const FhirClient = (serverUrl: string) => {
  const client = FHIR.client({ serverUrl });

  const getApiKeyHeader = () => {
    const apiKey = import.meta.env.VITE_FHIR_API_KEY;
    if (!apiKey) {
      return null;
    }

    return {
      'x-api-key': apiKey,
    };
  };

  const getAccessTokenHeader = () => {
    const oidcStorage = localStorage.getItem(
      `oidc.user:${import.meta.env.VITE_OIDC_AUTHORITY}:${import.meta.env.VITE_OIDC_CLIENT_ID}`,
    );
    if (!oidcStorage) {
      return null;
    }

    const { access_token: accessToken } = User.fromStorageString(oidcStorage);
    if (!accessToken) {
      return null;
    }
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  };

  //* Resource Search ----------------------------------------------------------
  const searchResource = async <T = Resource>({
    filters = {},
    //page,
    //pageSize,
    resourceType,
    //resultFields = [],
    //sortFields = [],
  }: SearchResourceProps) => {
    // Construct the request body for form-encoded data
    const searchParams = new URLSearchParams();
    
    // Add filters to the request body
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    console.log('🟠 [FhirClient] Final request body being sent to FHIR API:', searchParams.toString());
    console.log('🟠 [FhirClient] Request URL:', `${resourceType}/_search`);
    console.log('🟠 [FhirClient] Original filters object:', filters);
    
    const fetchProps = {
      url: `${resourceType}/_search`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(getApiKeyHeader() && getApiKeyHeader()),
        ...(getAccessTokenHeader() && getAccessTokenHeader()),
      },
      body: searchParams.toString()
    };

    const fhirResponse = await client.request<Bundle<T>>(fetchProps);

    console.log('fhirResponse:', fhirResponse);

    return {
      entry: fhirResponse.entry?.map((entry) => entry.resource) as T[],
      total: fhirResponse.total,
    } as SearchResourceResult<T>;
  };

  //* Get Resource by ID ----------------------------------------------------------------------
  const getResourceById = async <T = Resource>({
    resolveReferences,
    resourceId,
    resourceType,
  }: GetResourceByIdProps): Promise<T> => {
    const requestUrl = `${resourceType}/${resourceId}`;

    const fetchProps = {
      url: requestUrl,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(getApiKeyHeader() && getApiKeyHeader()),
        ...(getAccessTokenHeader() && getAccessTokenHeader()),
      },
    };

    const response = await client.request(fetchProps, {
      resolveReferences: resolveReferences as string[],
    });

    return response;
  };

  //* Resource Create ----------------------------------------------------------
  const createResource = async <T = Resource>(
    resourceBody: Partial<T>,
  ): Promise<T> => {
    const reqOptions = {
      headers: {
        ...(getApiKeyHeader() && getApiKeyHeader()),
        ...(getAccessTokenHeader() && getAccessTokenHeader()),
      },
    };
    
    console.log('🔴 [FhirClient] About to create FHIR resource');
    console.log('🔴 [FhirClient] Resource being created:', resourceBody);
    console.log('🔴 [FhirClient] Request headers:', reqOptions.headers);
    
    const response = await client.create<T>(resourceBody, reqOptions);
    
    console.log('🔴 [FhirClient] Created resource response:', response);
    
    return response;
  };

  //* Resource Update ----------------------------------------------------------
  const updateResource = async <T = Resource>(
    resourceBody: Partial<T>,
  ): Promise<T> => {
    const reqOptions = {
      headers: {
        ...(getApiKeyHeader() && getApiKeyHeader()),
        ...(getAccessTokenHeader() && getAccessTokenHeader()),
      },
    };
    
    console.log('🔴 [FhirClient] About to update FHIR resource');
    console.log('🔴 [FhirClient] Resource being updated:', resourceBody);
    console.log('🔴 [FhirClient] Request headers:', reqOptions.headers);
    
    const response = await client.update<T>(resourceBody, reqOptions);
    
    console.log('🔴 [FhirClient] Updated resource response:', response);
    
    return response;
  };

  //* Resource Delete ----------------------------------------------------------
  const deleteResource = async (
    resourceType: string,
    resourceId: string,
  ): Promise<void> => {
    const requestUrl = `${resourceType}/${resourceId}`;
    const reqOptions = {
      headers: {
        ...(getApiKeyHeader() && getApiKeyHeader()),
        ...(getAccessTokenHeader() && getAccessTokenHeader()),
      },
    };
    return client.delete(requestUrl, reqOptions);
  };

  //* Transaction - Bundle -----------------------------------------------------
  const postBundleRequest = async (bundle: Bundle) => {
    const requestProps = {
      url: '', // Bundle batch or transaction is POST to baseUrl.
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getApiKeyHeader() && getApiKeyHeader()),
        ...(getAccessTokenHeader() && getAccessTokenHeader()),
      },
      body: JSON.stringify(bundle),
    };

    console.log('🔴 [FhirClient] About to make HTTP request to FHIR server');
    console.log('🔴 [FhirClient] Request URL:', `${serverUrl}${requestProps.url}`);
    console.log('🔴 [FhirClient] Request headers:', requestProps.headers);
    console.log('🔴 [FhirClient] Request bundle being sent:', bundle);

    const response = await client.request(requestProps);
    
    console.log('🔴 [FhirClient] HTTP response received from FHIR server:', response);
    
    return response;
  };

  // Return --------------------------------------------------------------------
  return {
    searchResource,
    createResource,
    getResourceById,
    updateResource,
    deleteResource,
    postBundleRequest,
  };
};

//* Export ---------------------------------------------------------------------
export default FhirClient;
