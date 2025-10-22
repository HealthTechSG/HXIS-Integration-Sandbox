//* This file is used to define the environment variables that are required for the application to run.
//* You can customize the schema to fit your needs.

import { defineConfig as defineEnvConfig } from '@julr/vite-plugin-validate-env';
import { z } from 'zod';

// =============================================================================
// ! These are the required environment variables for the application to run.
// ! Only edit them if you know what you are doing.
// =============================================================================
const requiredSchema = {
  //* Application ==============================================================
  // VITE_APP_BASE_URL can be configured per environment (e.g., "/" or "/apps")
  VITE_APP_BASE_URL: z.string().min(1, {
    message: 'Base URL is required, e.g. / or /apps',
  }),
  VITE_APP_TITLE: z.string().min(1, {
    message: 'App Title is required, e.g. Mini-EMR',
  }),
  VITE_APP_ID: z.string().min(1, {
    message:
      'App ID (uuid) is required, e.g. g59846c5-fc5e-4f3e-8cb3-6491578195ad',
  }),
  VITE_FHIR_API_BASE_URL: z.string().min(1, {
    message:
      'FHIR API Base URL is required, e.g. https://api.healthx.sg/fhir/r4b/<tenant>',
  }),
  VITE_FHIR_API_KEY: z.string().min(1, {
    message:
      'FHIR API Key is required, e.g. <fhir-api-key>, to access the FHIR API',
  }),

  //* Authentication ===========================================================
  VITE_OIDC_AUTHORITY: z.string().min(1, {
    message:
      'OIDC Authority is required, e.g. https://auth.healthx.sg/realms/<realm>',
  }),
  VITE_OIDC_CLIENT_ID: z.string().min(1, {
    message: 'OIDC Client ID is required, e.g. <client-id>',
  }),
  VITE_OIDC_REDIRECT_URI: z.string().min(1, {
    message:
      'OIDC Redirect URI is required, e.g https://userapps.healthx.sg/apps/<app-id>',
  }),

  //* SmartonFHIR ==============================================================
  VITE_SMART_LAUNCH_TOKEN_URL: z
    .string()
    .url({
      message:
        'Need a valid URL for the Smart Launch Token, e.g. https://auth.healthx.sg/launch',
    })
    .optional(),
  VITE_SMART_APP_BASE_URL: z
    .string()
    .url({
      message:
        'Need a valid URL for the Smart App Base URL, e.g. https://userapps.healthx.sg/apps/<app-id>/launch',
    })
    .optional(),
  VITE_SMART_FHIR_RESOURCE_BASE_URL: z
    .string()
    .url({
      message:
        'Need a valid URL for the Smart FHIR Resource Base URL, e.g. https://api.healthx.sg/fhir/r4b/<tenant>',
    })
    .optional(),
};

// =============================================================================
// * Define the environment variables configuration below
// =============================================================================
export default defineEnvConfig({
  validator: 'zod',
  schema: {
    ...requiredSchema,
    // More environment variables... (add to your use case)
  },
});
