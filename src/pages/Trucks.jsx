import { useState, useEffect } from 'react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import truckService from '../services/truck.service';

const Trucks = () => {
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTruck, setCurrentTruck] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(5);

    const [formData, setFormData] = useState({
        licensePlate: '',
        make: '',
        model: '',
        capacity: '',
        fuelType: 'Diesel',
        status: 'Disponible'
    });

    useEffect(() => {
        fetchTrucks();
    }, [currentPage]);

    const fetchTrucks = async () => {
        try {
            setLoading(true);
            const response = await truckService.getAll(currentPage, limit);
            setTrucks(response.data || []);
            setTotalItems(response.count || 0);
            setTotalPages(Math.ceil((response.count || 0) / limit));
            setError('');
        } catch (err) {
            console.error('Error fetching trucks:', err);
            setError('Failed to load trucks');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'License Plate', accessor: 'licensePlate' },
        { header: 'Make', accessor: 'make' },
        { header: 'Model', accessor: 'model' },
        { header: 'Capacity (tons)', accessor: 'capacity' },
        { header: 'Fuel Type', accessor: 'fuelType' },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => (
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border
          ${item.status === 'Disponible' ? 'bg-success-500/10 text-success-400 border-success-500/20' :
                        item.status === 'En service' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' :
                            'bg-error-500/10 text-error-400 border-error-500/20'
                    }
        `}>
                    {item.status}
                </span>
            )
        },
    ];

    const handleOpenModal = (truck = null) => {
        if (truck) {
            setCurrentTruck(truck);
            setFormData({
                licensePlate: truck.licensePlate,
                make: truck.make,
                model: truck.model,
                capacity: truck.capacity,
                fuelType: truck.fuelType,
                status: truck.status
            });
        } else {
            setCurrentTruck(null);
            setFormData({
                licensePlate: '',
                make: '',
                model: '',
                capacity: '',
                fuelType: 'Diesel',
                status: 'Disponible'
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (truck) => {
        if (window.confirm('Are you sure you want to delete this truck?')) {
            try {
                await truckService.delete(truck._id);
                await fetchTrucks();
            } catch (err) {
                console.error('Error deleting truck:', err);
                alert('Failed to delete truck');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentTruck) {
                await truckService.update(currentTruck._id, formData);
            } else {
                await truckService.create(formData);
            }
            setIsModalOpen(false);
            await fetchTrucks();
        } catch (err) {
            console.error('Error saving truck:', err);
            const errorMessage = err.response?.data?.message || 'Failed to save truck';
            alert(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white text-lg">Loading trucks...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-1">
                        Trucks Management <span className="text-xl text-primary-500 font-normal">({totalItems} Trucks)</span>
                    </h1>
                    <p className="text-zinc-400 text-sm">Manage your fleet vehicles</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Add Truck
                </button>
            </div>

            {error && (
                <div className="bg-error-500/10 border border-error-500/50 text-error-400 p-4 rounded-xl mb-6 text-sm">
                    {error}
                </div>
            )}

            <Table
                columns={columns}
                data={trucks}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                itemsPerPage={limit}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentTruck ? 'Edit Truck' : 'Add New Truck'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">License Plate</label>
                        <input
                            type="text"
                            value={formData.licensePlate}
                            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                            className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Make</label>
                            <input
                                type="text"
                                value={formData.make}
                                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Model</label>
                            <input
                                type="text"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Capacity (tons)</label>
                            <input
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                                min="1"
                                max="1000"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Fuel Type</label>
                            <select
                                value={formData.fuelType}
                                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                            >
                                <option value="Diesel">Diesel</option>
                                <option value="Essence">Essence</option>
                                <option value="Electrique">Electrique</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                        >
                            <option value="Disponible">Disponible</option>
                            <option value="En service">En service</option>
                            <option value="En Maintenance">En Maintenance</option>
                        </select>
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

export default Trucks;
