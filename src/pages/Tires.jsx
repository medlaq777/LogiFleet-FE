import { useState, useEffect } from 'react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import tireService from '../services/tire.service';

const Tires = () => {
    const [tires, setTires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTire, setCurrentTire] = useState(null);
    const [formData, setFormData] = useState({
        serialNumber: '',
        brand: '',
        type: '',
        currentMileageOnTire: 0,
        expectedLife: ''
    });

    useEffect(() => {
        fetchTires();
    }, []);

    const fetchTires = async () => {
        try {
            setLoading(true);
            const response = await tireService.getAll();
            setTires(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching tires:', err);
            setError('Failed to load tires');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Serial Number', accessor: 'serialNumber' },
        { header: 'Brand', accessor: 'brand' },
        { header: 'Type', accessor: 'type' },
        { header: 'Current Mileage (km)', accessor: 'currentMileageOnTire' },
        { header: 'Expected Life (km)', accessor: 'expectedLife' },
        {
            header: 'Health',
            render: (item) => {
                const percentage = (item.currentMileageOnTire / item.expectedLife) * 100;
                return (
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border
              ${percentage < 70 ? 'bg-success-500/10 text-success-400 border-success-500/20' :
                            percentage < 90 ? 'bg-warning-500/10 text-warning-400 border-warning-500/20' :
                                'bg-error-500/10 text-error-400 border-error-500/20'
                        }
            `}>
                        {percentage.toFixed(0)}%
                    </span>
                );
            }
        },
    ];

    const handleOpenModal = (tire = null) => {
        if (tire) {
            setCurrentTire(tire);
            setFormData({
                serialNumber: tire.serialNumber,
                brand: tire.brand,
                type: tire.type,
                currentMileageOnTire: tire.currentMileageOnTire,
                expectedLife: tire.expectedLife
            });
        } else {
            setCurrentTire(null);
            setFormData({
                serialNumber: '',
                brand: '',
                type: '',
                currentMileageOnTire: 0,
                expectedLife: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (tire) => {
        if (window.confirm('Are you sure you want to delete this tire?')) {
            try {
                await tireService.delete(tire._id);
                await fetchTires();
            } catch (err) {
                console.error('Error deleting tire:', err);
                alert('Failed to delete tire');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentTire) {
                await tireService.update(currentTire._id, formData);
            } else {
                await tireService.create(formData);
            }
            setIsModalOpen(false);
            await fetchTires();
        } catch (err) {
            console.error('Error saving tire:', err);
            const errorMessage = err.response?.data?.message || 'Failed to save tire';
            alert(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white text-lg">Loading tires...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-1">Tires Management</h1>
                    <p className="text-zinc-400 text-sm">Track and manage tire inventory</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Add Tire
                </button>
            </div>

            {error && (
                <div className="bg-error-500/10 border border-error-500/50 text-error-400 p-4 rounded-xl mb-6 text-sm">
                    {error}
                </div>
            )}

            <Table
                columns={columns}
                data={tires}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentTire ? 'Edit Tire' : 'Add New Tire'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">Serial Number</label>
                        <input
                            type="text"
                            value={formData.serialNumber}
                            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                            className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Brand</label>
                            <input
                                type="text"
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Type</label>
                            <input
                                type="text"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Current Mileage (km)</label>
                            <input
                                type="number"
                                value={formData.currentMileageOnTire}
                                onChange={(e) => setFormData({ ...formData, currentMileageOnTire: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Expected Life (km)</label>
                            <input
                                type="number"
                                value={formData.expectedLife}
                                onChange={(e) => setFormData({ ...formData, expectedLife: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                                min="1"
                                max="1000"
                                required
                            />
                        </div>
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
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Tires;
