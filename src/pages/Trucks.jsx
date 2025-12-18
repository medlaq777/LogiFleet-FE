import { useState, useEffect } from 'react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
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
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredTrucks = trucks.filter(truck => {
        return (truck.licensePlate?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (truck.make?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (truck.model?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white text-lg">Loading trucks...</div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Trucks Management <span className="text-lg text-primary-400 font-medium">({totalItems})</span>
                    </h1>
                    <p className="text-zinc-400">Manage and monitor your fleet vehicles</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Add New Truck
                </button>
            </div>


            <div className="mb-6">
                <div className="relative max-w-md">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search by license plate, make, or model..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-[#11141F] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors pl-11"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-error-500/10 border border-error-500/50 text-error-400 p-4 rounded-xl mb-6 text-sm">
                    {error}
                </div>
            )}

            <Table
                columns={columns}
                data={filteredTrucks}
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
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1.5">License Plate</label>
                        <input
                            type="text"
                            value={formData.licensePlate}
                            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                            className="w-full px-4 py-3 bg-[#11141F] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                            placeholder="e.g., ABC-1234"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Make</label>
                            <input
                                type="text"
                                value={formData.make}
                                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                className="w-full px-4 py-3 bg-[#11141F] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                placeholder="e.g., Volvo"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Model</label>
                            <input
                                type="text"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                className="w-full px-4 py-3 bg-[#11141F] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                placeholder="e.g., FH16"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Capacity (tons)</label>
                            <input
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                className="w-full px-4 py-3 bg-[#11141F] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                placeholder="e.g., 25"
                                min="1"
                                max="1000"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Fuel Type</label>
                            <select
                                value={formData.fuelType}
                                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                                className="w-full px-4 py-3 bg-[#11141F] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors cursor-pointer"
                            >
                                <option value="Diesel">Diesel</option>
                                <option value="Essence">Essence</option>
                                <option value="Electrique">Electrique</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1.5">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-3 bg-[#11141F] border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors cursor-pointer"
                        >
                            <option value="Disponible">Disponible</option>
                            <option value="En service">En service</option>
                            <option value="En Maintenance">En Maintenance</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-white/[0.08]">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors border border-zinc-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {currentTruck ? 'Update Truck' : 'Add Truck'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Trucks;
