import apiClient from '../config/axios';

const maintenanceService = {
    // Get all maintenance rules
    getRules: async (page = 1, limit = 5) => {
        const response = await apiClient.get('/maintenance/rules', {
            params: { page, limit }
        });
        return response.data;
    },

    // Get all alerts
    getAlerts: async (page = 1, limit = 5) => {
        const response = await apiClient.get('/maintenance/alerts', {
            params: { page, limit }
        });
        return response.data;
    },

    // Update maintenance rule
    updateRule: async (id, ruleData) => {
        const response = await apiClient.put(`/maintenance/rules/${id}`, ruleData);
        return response.data;
    },
};

export default maintenanceService;
