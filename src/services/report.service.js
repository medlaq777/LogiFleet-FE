import apiClient from '../config/axios';

const reportService = {
    getStatistics: async () => {
        const response = await apiClient.get('/reports/stats');
        return response.data;
    },

    getFuelData: async () => {
        const response = await apiClient.get('/reports/fuel');
        return response.data;
    },

    getMaintenanceCosts: async () => {
        const response = await apiClient.get('/reports/maintenance-costs');
        return response.data;
    },
};

export default reportService;
