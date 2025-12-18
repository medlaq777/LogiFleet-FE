import apiClient from '../config/axios';

const userService = {
    getAll: async (page = 1, limit = 10, role = '') => {
        let url = `/users?page=${page}&limit=${limit}`;
        if (role && role !== 'All') {
            url += `&role=${role}`;
        }
        const response = await apiClient.get(url);
        return response.data;
    },

    getDrivers: async () => {
        const response = await apiClient.get('/users?role=Driver');
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    },
    create: async (userData) => {
        const response = await apiClient.post('/users', userData);
        return response.data;
    },
    update: async (id, userData) => {
        const response = await apiClient.put(`/users/${id}`, userData);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/users/${id}`);
        return response.data;
    },
};

export default userService;
