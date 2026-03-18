import axios from 'axios';
import { getConfig, getConfigByName } from './config';
import { sdkRequestInterceptor, sdkResponseInterceptor } from './views/Interceptor';

const AISInstance = axios.create({
    baseURL: getConfigByName("baseURL"),
    headers: {
        'Content-Type': 'application/json'
    }
});


export function initApi() {
    const config = getConfig();
    AISInstance.defaults.baseURL = config.baseURL;
}







AISInstance.interceptors.request.use(sdkRequestInterceptor);
AISInstance.interceptors.response.use(sdkResponseInterceptor);


export async function apiCall(endpoint, method = "POST", data = {}, headers = {}) {
    try {

        const config = {
            method,
            url: endpoint,
            data,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const response = await AISInstance(config);

        return response.data
    } catch (error) {
        console.error("API Call Error: ", error);
        throw error;
    }
}

export function addInterceptor(type, interceptorFn) {
    if (type === "request") {
        AISInstance.interceptors.request.use(interceptorFn);
    } else if (type === "response") {
        AISInstance.interceptors.response.use(interceptorFn);
    }
}
