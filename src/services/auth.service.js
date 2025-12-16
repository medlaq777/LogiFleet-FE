import apiClient from '../config/axios';

const authService = {
    // Login user
    login: async (email, password) => {
        const response = await apiClient.post('/login', { email, password });
        return response.data;
    },

    // Register new user
    register: async (userData) => {
        const response = await apiClient.post('/register', userData);
        return response.data;
    },

    // Get current user profile
    getProfile: async () => {
        const response = await apiClient.get('/profile');
        return response.data;
    },
};

export default authService;
