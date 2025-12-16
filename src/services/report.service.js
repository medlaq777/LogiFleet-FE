import apiClient from '../config/axios';

const reportService = {
    // Get dashboard statistics
    getStatistics: async () => {
        const response = await apiClient.get('/reports/statistics');
        return response.data;
    },

    // Get fuel consumption data
    getFuelData: async () => {
        const response = await apiClient.get('/reports/fuel');
        return response.data;
    },

    // Get maintenance costs data
    getMaintenanceCosts: async () => {
        const response = await apiClient.get('/reports/maintenance-costs');
        return response.data;
    },
};

export default reportService;
