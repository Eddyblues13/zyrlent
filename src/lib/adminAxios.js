import axios from 'axios';

const adminApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // A 401 on the login request is a failed login attempt — let the caller
        // handle it (show the error toast). Only force a redirect for session
        // expiry on already-authenticated requests.
        const isLoginRequest = error.config?.url?.includes('/api/admin/login');
        if (error.response?.status === 401 && !isLoginRequest) {
            localStorage.removeItem('admin_token');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export default adminApi;
