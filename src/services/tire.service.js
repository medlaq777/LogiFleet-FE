import apiClient from '../config/axios';

const tireService = {


    getAll: async (page = 1, limit = 10) => {
        const response = await apiClient.get('/tires', { params: { page, limit } });
        return response.data;
    },


    getById: async (id) => {
        const response = await apiClient.get(`/tires/${id}`);
        return response.data;
    },


    create: async (tireData) => {
        const response = await apiClient.post('/tires', tireData);
        return response.data;
    },


    update: async (id, tireData) => {
        const response = await apiClient.put(`/tires/${id}`, tireData);
        return response.data;
    },


    delete: async (id) => {
        const response = await apiClient.delete(`/tires/${id}`);
        return response.data;
    },


    getMaintenanceStatus: async (id) => {
        const response = await apiClient.get(`/tires/${id}/maintenance`);
        return response.data;
    },
};

export default tireService;
