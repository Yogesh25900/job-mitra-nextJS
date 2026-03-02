import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
        console.log(' [AXIOS] Detected FormData - removed Content-Type header for multipart/form-data');
    }
    return config;
});

axiosInstance.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response received:', {
            status: response.status,
            url: response.config.url,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Response error:', {
            message: error.message,
            status: error.response?.status,
            url: error.config?.url,
            data: error.response?.data
        });
        
        if (error.response) {
            return Promise.reject({
                success: false,
                message: error.response.data?.message || `Request failed with status code ${error.response.status}`,
                statusCode: error.response.status,
                data: error.response.data
            });
        } else if (error.request) {
            return Promise.reject({
                success: false,
                message: 'No response from server. Please check your network connection.',
            });
        } else {
            return Promise.reject({
                success: false,
                message: error.message || 'An unexpected error occurred',
            });
        }
    }
);

export default axiosInstance;