import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faEdit } from '@fortawesome/free-solid-svg-icons';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import maintenanceService from '../services/maintenance.service';

const Maintenance = () => {
    const [activeTab, setActiveTab] = useState('rules');
    const [rules, setRules] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRule, setCurrentRule] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(5);

    const [formData, setFormData] = useState({
        type: '',
        intervalKm: 0
    });

    useEffect(() => {
        setCurrentPage(1); // Reset page when tab changes
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [activeTab, currentPage]);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (activeTab === 'rules') {
                const response = await maintenanceService.getRules(currentPage, limit);
                setRules(response.data || []);
                setTotalItems(response.count || 0);
                setTotalPages(Math.ceil((response.count || 0) / limit));
            } else {
                const response = await maintenanceService.getAlerts(currentPage, limit);
                setAlerts(response.data || []);
                setTotalItems(response.count || 0);
                setTotalPages(Math.ceil((response.count || 0) / limit));
            }
            setError('');
        } catch (err) {
            console.error('Error fetching data:', err);
            const errorMsg = err.response?.data?.message || 'Failed to load data';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const rulesColumns = [
        {
            header: 'Maintenance Type',
            accessor: 'type',
            render: (item) => (
                <div className="font-semibold text-white">{item.type}</div>
            )
        },
        {
            header: 'Interval (km)',
            accessor: 'intervalKm',
            render: (item) => (
                <div className="text-zinc-300">
                    {item.intervalKm?.toLocaleString()} km
                </div>
            )
        },
    ];

    const alertsColumns = [
        {
            header: 'Truck',
            render: (item) => (
                <div>
                    <div className="font-semibold text-white">
                        {item.truckId?.licensePlate || 'N/A'}
                    </div>
                    <div className="text-xs text-zinc-400">
                        {item.truckId?.make} {item.truckId?.model}
                    </div>
                </div>
            )
        },
        {
            header: 'Type',
            accessor: 'type',
            render: (item) => (
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-warning-500/10 text-warning-400 border border-warning-500/20">
                    {item.type}
                </span>
            )
        },
        {
            header: 'Message',
            accessor: 'message',
            render: (item) => (
                <div className="text-zinc-300">{item.message}</div>
            )
        },
        {
            header: 'Date',
            render: (item) => (
                <div className="text-zinc-400 text-sm">
                    {new Date(item.createdAt).toLocaleDateString()}
                </div>
            )
        },
    ];

    const handleOpenModal = (rule) => {
        setCurrentRule(rule);
        setFormData({
            type: rule.type,
            intervalKm: rule.intervalKm
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await maintenanceService.updateRule(currentRule._id, formData);
            setIsModalOpen(false);
            await fetchData();
        } catch (err) {
            console.error('Error updating rule:', err);
            const errorMessage = err.response?.data?.message || 'Failed to update rule';
            alert(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white mb-1">
                    Maintenance Management
                    <span className="text-xl text-primary-500 font-normal ml-2">
                        ({totalItems} {activeTab === 'rules' ? 'Rules' : 'Alerts'})
                    </span>
                </h1>
                <p className="text-zinc-400 text-sm">Configure maintenance rules and view alerts</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('rules')}
                    className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${activeTab === 'rules'
                        ? 'text-primary-400 border-primary-500'
                        : 'text-zinc-400 border-transparent hover:text-white'
                        }`}
                >
                    Maintenance Rules
                </button>
                <button
                    onClick={() => setActiveTab('alerts')}
                    className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 ${activeTab === 'alerts'
                        ? 'text-warning-400 border-warning-500'
                        : 'text-zinc-400 border-transparent hover:text-white'
                        }`}
                >
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    Alerts
                </button>
            </div>

            {error && (
                <div className="bg-error-500/10 border border-error-500/50 text-error-400 p-4 rounded-xl mb-6 text-sm">
                    {error}
                </div>
            )}

            {/* Rules Tab */}
            {activeTab === 'rules' && (
                <div>
                    <Table
                        columns={rulesColumns}
                        data={rules}
                        onEdit={handleOpenModal}
                    />
                </div>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
                <div>
                    {alerts.length === 0 ? (
                        <div className="premium-card p-8 text-center text-zinc-400">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl mb-3 text-zinc-500" />
                            <p>No maintenance alerts at this time</p>
                        </div>
                    ) : (
                        <Table
                            columns={alertsColumns}
                            data={alerts}
                        />
                    )}
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                itemsPerPage={limit}
            />

            {/* Edit Rule Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Edit Maintenance Rule"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">Maintenance Type</label>
                        <input
                            type="text"
                            value={formData.type}
                            className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-zinc-400 cursor-not-allowed"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">Interval (km)</label>
                        <input
                            type="number"
                            value={formData.intervalKm}
                            onChange={(e) => setFormData({ ...formData, intervalKm: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                            min="1"
                            required
                        />
                        <p className="text-xs text-zinc-500 mt-2">
                            Maintenance will be triggered every {formData.intervalKm?.toLocaleString()} kilometers
                        </p>
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-200 hover:-translate-y-0.5"
                        >
                            Update Rule
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Maintenance;
