import apiClient from '../config/axios';

const userService = {
    // Get all users (for admin to select drivers)
    getAll: async () => {
        const response = await apiClient.get('/users');
        return response.data;
    },

    // Get drivers only
    getDrivers: async () => {
        const response = await apiClient.get('/users?role=Driver');
        return response.data;
    },

    // Get single user by ID
    getById: async (id) => {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    },
};

export default userService;
