import apiClient from '../config/axios';

const maintenanceService = {
    // Get all maintenance rules
    getRules: async () => {
        const response = await apiClient.get('/maintenance/rules');
        return response.data;
    },

    // Get all alerts
    getAlerts: async () => {
        const response = await apiClient.get('/maintenance/alerts');
        return response.data;
    },

    // Update maintenance rule
    updateRule: async (id, ruleData) => {
        const response = await apiClient.put(`/maintenance/rules/${id}`, ruleData);
        return response.data;
    },
};

export default maintenanceService;
