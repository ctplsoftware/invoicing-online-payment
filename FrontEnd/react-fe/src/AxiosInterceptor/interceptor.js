import axios from 'axios';
import { BaseURL } from "../utils" // Import the BaseURL from your utils file

const apiClient = axios.create({
    baseURL: BaseURL, // Use the BaseURL from utils
    headers: { 'Content-Type': 'application/json' },
});


apiClient.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
});


apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status === 401 && error.config && !error.config._retry) {
            error.config._retry = true; // Prevent infinite retries
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const response = await axios.post(`${BaseURL}/refresh/`, {
                        refresh: refreshToken,
                    });

                    // Update tokens
                    localStorage.setItem('accessToken', response.data.access);
                    error.config.headers['Authorization'] = `Bearer ${response.data.access}`;
                    return apiClient.request(error.config); // Retry the failed request
                } catch (refreshError) {
                    console.error('Refresh token failed:', refreshError);
                    localStorage.clear(); // Clear tokens
                    window.location.href = '/login'; // Redirect to login
                }
            } else {
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
