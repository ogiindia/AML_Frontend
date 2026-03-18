// Re-export configuration from the shared @ais/utils package
// Source of truth: packages/utils/config.js

const RUNTIME =
  typeof window !== 'undefined' && window.__RUNTIME_CONFIG__
    ? window.__RUNTIME_CONFIG__
    : {};

export const APP_NAME = RUNTIME.APP_NAME || __APP_NAME__;
export const CONTEXT_PATH = RUNTIME.CONTEXT_PATH || __CONTEXT_PATH__;
export const API_URL = RUNTIME.API_URL || __PLUGIN_URL__;
export const GRAPHQL_URL = RUNTIME.GRAPHQL_URL || __GRAPHQL_URL__;
export const BACKEND_URL = RUNTIME.BACKEND_URL || __BACKEND_URL__;

export {
  BACKEND_CALL_TYPE,
  dateFormats, ENCRYPT_ON_TRANSIT,
  HTTP_HEADERS
} from '@ais/utils';


