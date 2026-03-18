// Re-export configuration from the shared @ais/utils package
// Source of truth: packages/utils/config.js
// The Vite config (app/core/vite.config.js) injects __BACKEND_URL__, __CONTEXT_PATH__, etc globally

export {
  APP_NAME, CONTEXT_PATH, API_URL, BACKEND_URL, GRAPHQL_URL, BACKEND_CALL_TYPE,
  dateFormats, ENCRYPT_ON_TRANSIT,
  HTTP_HEADERS
} from '@ais/utils/config.js';

