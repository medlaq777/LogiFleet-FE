import axios from 'axios';
import config from './api.config';


const apiClient = axios.create({
    baseURL: config.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {

        if (error.response?.status === 401) {
            window.dispatchEvent(new Event('auth:unauthorized'));
        }


        if (error.response?.status === 403) {
            console.error('Access forbidden');
        }


        if (!error.response) {
            console.error('Network error - please check your connection');
        }

        return Promise.reject(error);
    }
);

export default apiClient;
