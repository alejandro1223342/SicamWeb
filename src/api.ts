import axios from 'axios';

let globalAbortController = new AbortController();

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Asignar la señal para poder cancelar peticiones en cascada
    config.signal = globalAbortController.signal;
    
    return config;
});

export const cancelAllRequests = () => {
    globalAbortController.abort('Logout - Request cancelled to prevent leakage');
    globalAbortController = new AbortController(); // Generar una nueva instancia para el siguiente usuario
};

export const clearAxiosAuth = () => {
    delete api.defaults.headers.common['Authorization'];
};

export default api;
