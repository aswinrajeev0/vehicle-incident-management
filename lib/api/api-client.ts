import axios from 'axios';

export const apiClient = axios.create({
    baseURL: '/api',
    // headers: {
    //     'Content-Type': 'application/json',
    // },
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        const message = error.response?.data?.error || error.message || 'API request failed';
        return Promise.reject(new Error(message));
    }
);
