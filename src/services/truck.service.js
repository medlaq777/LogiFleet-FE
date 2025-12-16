import apiClient from '../config/axios';

const truckService = {
    getAll: async () => {
        const response = await apiClient.get('/trucks');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/trucks/${id}`);
        return response.data;
    },
    create: async (truckData) => {
        const response = await apiClient.post('/trucks', truckData);
        return response.data;
    },

    update: async (id, truckData) => {
        const response = await apiClient.put(`/trucks/${id}`, truckData);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/trucks/${id}`);
        return response.data;
    },
};

export default truckService;
