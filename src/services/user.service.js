import apiClient from '../config/axios';

const userService = {
    // Get all users (for admin to select drivers)
    getAll: async (page = 1, limit = 10, role = '') => {
        let url = `/users?page=${page}&limit=${limit}`;
        if (role && role !== 'All') {
            url += `&role=${role}`;
        }
        const response = await apiClient.get(url);
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

    // Create new user (Admin only)
    create: async (userData) => {
        const response = await apiClient.post('/users', userData);
        return response.data;
    },

    // Update user (Admin only)
    update: async (id, userData) => {
        const response = await apiClient.put(`/users/${id}`, userData);
        return response.data;
    },

    // Delete user (Admin only)
    delete: async (id) => {
        const response = await apiClient.delete(`/users/${id}`);
        return response.data;
    },
};

export default userService;
