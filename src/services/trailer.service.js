import apiClient from '../config/axios';

const trailerService = {
    // Get all trailers
    getAll: async () => {
        const response = await apiClient.get('/trailers');
        return response.data;
    },

    // Get single trailer by ID
    getById: async (id) => {
        const response = await apiClient.get(`/trailers/${id}`);
        return response.data;
    },

    // Create new trailer
    create: async (trailerData) => {
        const response = await apiClient.post('/trailers', trailerData);
        return response.data;
    },

    // Update trailer
    update: async (id, trailerData) => {
        const response = await apiClient.put(`/trailers/${id}`, trailerData);
        return response.data;
    },

    // Delete trailer
    delete: async (id) => {
        const response = await apiClient.delete(`/trailers/${id}`);
        return response.data;
    },
};

export default trailerService;
