import apiClient from '../config/axios';

const trailerService = {
    getAll: async (page = 1, limit = 10) => {
        const response = await apiClient.get('/trailers', { params: { page, limit } });
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/trailers/${id}`);
        return response.data;
    },

    create: async (trailerData) => {
        const response = await apiClient.post('/trailers', trailerData);
        return response.data;
    },
    update: async (id, trailerData) => {
        const response = await apiClient.put(`/trailers/${id}`, trailerData);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/trailers/${id}`);
        return response.data;
    },
};

export default trailerService;
