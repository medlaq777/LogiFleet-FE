import apiClient from '../config/axios';

const authService = {
    login: async (email, password) => {
        const response = await apiClient.post('/login', { email, password });
        return response.data;
    },

    register: async (userData) => {
        const response = await apiClient.post('/register', userData);
        return response.data;
    },

    getProfile: async () => {
        const response = await apiClient.get('/profile');
        return response.data;
    },
};

export default authService;
