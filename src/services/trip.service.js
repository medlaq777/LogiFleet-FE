import apiClient from '../config/axios';

const tripService = {
    getAll: async (page = 1, limit = 10) => {
        const response = await apiClient.get('/trips', {
            params: { page, limit }
        });
        return response.data;
    },

    getMyTrips: async () => {
        const response = await apiClient.get('/trip');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/trip/${id}`);
        return response.data;
    },

    create: async (tripData) => {
        const response = await apiClient.post('/trip', tripData);
        return response.data;
    },

    update: async (id, tripData) => {
        const response = await apiClient.put(`/trip/${id}`, tripData);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/trip/${id}`);
        return response.data;
    },

    downloadPDF: async (id) => {
        const response = await apiClient.get(`/trip/${id}/pdf`, {
            responseType: 'blob',
        });
        return response.data;
    },
};

export default tripService;
