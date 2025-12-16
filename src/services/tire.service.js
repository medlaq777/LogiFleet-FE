import apiClient from '../config/axios';

const tireService = {
    // Get all tires
    // Get all tires
    getAll: async (page = 1, limit = 10) => {
        const response = await apiClient.get('/tires', { params: { page, limit } });
        return response.data;
    },

    // Get single tire by ID
    getById: async (id) => {
        const response = await apiClient.get(`/tires/${id}`);
        return response.data;
    },

    // Create new tire
    create: async (tireData) => {
        const response = await apiClient.post('/tires', tireData);
        return response.data;
    },

    // Update tire
    update: async (id, tireData) => {
        const response = await apiClient.put(`/tires/${id}`, tireData);
        return response.data;
    },

    // Delete tire
    delete: async (id) => {
        const response = await apiClient.delete(`/tires/${id}`);
        return response.data;
    },

    // Get tire maintenance status
    getMaintenanceStatus: async (id) => {
        const response = await apiClient.get(`/tires/${id}/maintenance`);
        return response.data;
    },
};

export default tireService;
