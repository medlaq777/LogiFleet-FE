import apiClient from '../config/axios';

const truckService = {
    // Get all trucks
    getAll: async () => {
        const response = await apiClient.get('/trucks');
        return response.data;
    },

    // Get single truck by ID
    getById: async (id) => {
        const response = await apiClient.get(`/trucks/${id}`);
        return response.data;
    },

    // Create new truck
    create: async (truckData) => {
        const response = await apiClient.post('/trucks', truckData);
        return response.data;
    },

    // Update truck
    update: async (id, truckData) => {
        const response = await apiClient.put(`/trucks/${id}`, truckData);
        return response.data;
    },

    // Delete truck
    delete: async (id) => {
        const response = await apiClient.delete(`/trucks/${id}`);
        return response.data;
    },
};

export default truckService;
