import apiClient from '../config/axios';

const tripService = {
    // Get all trips (Admin only)
    getAll: async (page = 1, limit = 10) => {
        const response = await apiClient.get('/trips', {
            params: { page, limit }
        });
        return response.data;
    },

    // Get driver's trips (Driver only)
    getMyTrips: async () => {
        const response = await apiClient.get('/trip');
        return response.data;
    },

    // Get single trip by ID
    getById: async (id) => {
        const response = await apiClient.get(`/trip/${id}`);
        return response.data;
    },

    // Create new trip (Admin only)
    create: async (tripData) => {
        const response = await apiClient.post('/trip', tripData);
        return response.data;
    },

    // Update trip (Driver can update status)
    update: async (id, tripData) => {
        const response = await apiClient.put(`/trip/${id}`, tripData);
        return response.data;
    },

    // Delete trip
    delete: async (id) => {
        const response = await apiClient.delete(`/trip/${id}`);
        return response.data;
    },

    // Download mission order PDF
    downloadPDF: async (id) => {
        const response = await apiClient.get(`/trip/${id}/pdf`, {
            responseType: 'blob', // Important for file download
        });
        return response.data;
    },
};

export default tripService;
