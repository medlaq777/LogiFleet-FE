import { useState } from 'react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const Maintenance = () => {
    const [alerts, setAlerts] = useState([
        { id: 1, vehicle: 'AA-123-BB', type: 'Oil Change', status: 'Overdue', date: '2023-10-20' },
        { id: 2, vehicle: 'CC-456-DD', type: 'Tire Rotation', status: 'Pending', date: '2023-11-01' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAlert, setCurrentAlert] = useState(null);
    const [formData, setFormData] = useState({ vehicle: '', type: '', status: 'Pending', date: '' });

    const columns = [
        { header: 'Vehicle', accessor: 'vehicle' },
        { header: 'Type', accessor: 'type' },
        { header: 'Due Date', accessor: 'date' },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center w-fit
          ${item.status === 'Pending' ? 'bg-yellow-900/30 text-yellow-400' :
                        item.status === 'Overdue' ? 'bg-red-900/30 text-red-400' :
                            'bg-green-900/30 text-green-400'
                    }
        `}>
                    {item.status === 'Overdue' && <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />}
                    {item.status}
                </span>
            )
        },
    ];

    const handleOpenModal = (alert = null) => {
        if (alert) {
            setCurrentAlert(alert);
            setFormData(alert);
        } else {
            setCurrentAlert(null);
            setFormData({ vehicle: '', type: '', status: 'Pending', date: '' });
        }
        setIsModalOpen(true);
    };

    const handleDelete = (alert) => {
        if (window.confirm('Are you sure you want to delete this alert?')) {
            setAlerts(alerts.filter(a => a.id !== alert.id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentAlert) {
            setAlerts(alerts.map(a => a.id === currentAlert.id ? { ...formData, id: a.id } : a));
        } else {
            setAlerts([...alerts, { ...formData, id: Date.now() }]);
        }
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Maintenance Alerts</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Alert
                </button>
            </div>

            <Table
                columns={columns}
                data={alerts}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentAlert ? 'Edit Alert' : 'Create Maintenance Alert'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Vehicle</label>
                        <input
                            type="text"
                            value={formData.vehicle}
                            onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Oil Change">Oil Change</option>
                            <option value="Tire Rotation">Tire Rotation</option>
                            <option value="Inspection">Inspection</option>
                            <option value="Repair">Repair</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Overdue">Overdue</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="mr-3 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Maintenance;
