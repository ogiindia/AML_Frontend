import {
  GenerateSecretKey,
  decodeSnowFlakeID,
  decrypt,
  encrypt,
  generateHmac,
  generateSnowFlakeID,
} from '@ais/crypto';
import axios from 'axios';
import {
  BACKEND_URL,
  CONTEXT_PATH,
  ENCRYPT_ON_TRANSIT,
  GRAPHQL_URL,
  HTTP_HEADERS,
} from './config';
// import { addNotification } from '../redux/notifySlice';

let store;
export const injectStore = (_store) => {
  store = _store;
};



var BackendAPI = axios.create({
  headers: {
    //requestid: crypto.randomUUID(),
    'Access-Control-Expose-Headers': 'requestid,authorization',
    ...HTTP_HEADERS,
  },
  baseURL: BACKEND_URL,
  timeout: 50000,
});

BackendAPI.interceptors.request.use(
  async function (config) {
    // in case need to do any modifications in the request data.
    if (config.data === undefined) config.data = {};

    const authToken = store.getState().auth.authToken;
    // const authToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzeXNhZG1pbiIsImlhdCI6MTczMzExNDEwMiwiZXhwIjoxNzMzMTE1OTAyfQ.QOXRaYZlC0Fa8GBjiH2K8GpyWnFtmwBeTx0jUNryjLA";
    if (authToken != '' && authToken != undefined)
      config.headers['Authorization'] = 'Bearer ' + authToken;

    if (ENCRYPT_ON_TRANSIT) {
      //handle encryption

      const [p, g, ka] = GenerateSecretKey();

      const [id, salt] = generateSnowFlakeID(p, g);

      config.headers['requestid'] = id;

      console.debug(config);
      console.debug(p, g, ka, id, salt);
      //yet to work.
      const encryptedString = await encrypt(config.data, ka, salt);

      if (encryptedString != null && encryptedString != undefined) {
        //form a standard bean
        var data = {
          request: encryptedString,
          hmac: await generateHmac(encryptedString, ka),
        };

        config.data = data;
      }
    }

    // console.warn(store.getState());

    return config;
  },
  function (error) {
    console.warn('Error in request' + error);
    return Promise.reject(error);
  },
);

BackendAPI.interceptors.response.use(
  async function (response) {
    // incase need to decrpt or do any alterations in response data
    //decryption process have to find salt and p to get ka

    if (ENCRYPT_ON_TRANSIT) {
      const data = response.data;

      const requestId = response.headers.requestid;

      const [P, salt] = decodeSnowFlakeID(requestId);

      const [p, g, ka] = GenerateSecretKey(P);

      const hmac = await generateHmac(data.response, ka);
      if (hmac === data.hmac) {
        const decrypted = await decrypt(data.response, ka, salt);
        var responsedata = {};
        if (typeof decrypted === 'string' || decrypted instanceof String) {
          responsedata = JSON.parse(decrypted);
        } else {
          responsedata = decrypted;
        }
        console.debug(responsedata);
        response.data = responsedata;
      }
    }
    return response;
  },
  function (err) {
    console.warn('error' + err);
    if (err.response) {
      switch (err.response.status) {
        case 503:
          break;
        default:
          break;
      }
    }

    return Promise.reject(err);
  },
);

const api = {
  get: async (url, params) => {
    try {
      const response = await BackendAPI.get(url.trim(), { params });
      console.debug(response.data);
      if (typeof response.data == 'object') {
        if ('error' in response.data) {
          console.warn('got error in api');
          // store.dispatch(
          //   addNotification({
          //     id: Math.random(),
          //     type: 'error',
          //     title: response.data.error,
          //     desc: response.data.cause,
          //   }),
          // );
        } else {
          return response.data;
        }
      } else {
        // store.dispatch(
        //   addNotification({
        //     id: Math.random(),
        //     type: 'error',
        //     title: 'CODE 001',
        //     desc: 'Error Receving response please contact administrator',
        //   }),
        // );

        throw new Error('Error');
      }
    } catch (error) {
      console.error('GET Request Failed:' + error);
      throw error;
    }
  },
  graphql: async (query, variables) => {
    let loading = true;
    let error = false;
    let data = null;

    if (!variables) variables = {};

    try {
      const response = await BackendAPI.post(GRAPHQL_URL, { query, variables });
      if ('errors' in response['data']) throw response['data']['errors'];
      else data = response.data['data'];
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status == 401) {
          alert('Session Expired please re-login');
          window.location.replace(CONTEXT_PATH + '/');
        }
        error = err.response?.data?.message || err.message;
      } else if (Array.isArray(err)) {
        error = err.map(({ message }) => message).join(', ');
      } else {
        error = err;
      }
    } finally {
      loading = false;
    }
    return { loading, data, error };
  },
  post: async (url, data) => {
    try {
      const response = await BackendAPI.post(url.trim(), JSON.stringify(data));
      return response.data;
    } catch (error) {
      console.error('Post Request failed :' + error);
      throw error;
    }
  },
  postUpload: async (url, data) => {
    try {
      // Ensure multipart/form-data requests do NOT use the default JSON Content-Type header
      // so the browser/axios can set the correct boundary header for FormData.
      const headers = { ...(BackendAPI.defaults && BackendAPI.defaults.headers ? BackendAPI.defaults.headers.common : {}) };
      if (headers['Content-Type']) delete headers['Content-Type'];
      const response = await BackendAPI.post(url.trim(), data, { headers });
      return response.data;
    } catch (error) {
      console.error('Post Upload Request failed :', error);
      if (error.response) console.error('Upload response data:', error.response.data);
      throw error;
    }
  },
  // download binary/blob (preserves interceptors/auth)
  // download binary/blob (preserves interceptors/auth)
  // download binary/blob (preserves interceptors/auth)
  // download binary/blob (preserves interceptors/auth)
  // download binary/blob (preserves interceptors/auth)
  // usage: api.download(url, { params: { customerId, transactionId, filename }, responseType: 'arraybuffer' })
  download: async (url, { params = {}, responseType = 'blob' } = {}) => {
    try {
      const response = await BackendAPI.get(url.trim(), { params, responseType });
      const blob = response.data;
      const contentType = response.headers && (response.headers['content-type'] || response.headers['Content-Type']) || '';
      return { blob, contentType };
    } catch (error) {
      console.error('Download Request failed :', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        try {
          // try to read error body if it's a Blob (helps debug 400)
          const maybeBlob = error.response.data;
          if (maybeBlob && typeof maybeBlob.text === 'function') {
            const txt = await maybeBlob.text();
            console.error('Response body:', txt);
          } else {
            console.error('Response data:', error.response.data);
          }
        } catch (e) {
          console.error('Failed reading error body', e);
        }
      }
      throw error;
    }
  },
};
export default api;
