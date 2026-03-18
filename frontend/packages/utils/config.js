const RUNTIME =
    typeof window !== 'undefined' && window.__RUNTIME_CONFIG__
        ? window.__RUNTIME_CONFIG__
        : {};

// no slash at the end of the url
export const APP_NAME = RUNTIME.APP_NAME || __APP_NAME__;
export const CONTEXT_PATH = RUNTIME.CONTEXT_PATH || __CONTEXT_PATH__;
export const API_URL = RUNTIME.API_URL || __PLUGIN_URL__;
export const GRAPHQL_URL = RUNTIME.GRAPHQL_URL || __GRAPHQL_URL__;
export const BACKEND_URL = RUNTIME.BACKEND_URL || __BACKEND_URL__;

export const BACKEND_CALL_TYPE = 'GRAPHQL';
export const ENCRYPT_ON_TRANSIT = false;

export const HTTP_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization',
    Accept: '*/*',
};

export const dateFormats = {
    longDate: 'DD-MM-YYYY hh:mm:SS A',
    shortDate: 'DD-MMM-YY hh:mm A',
};
