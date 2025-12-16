import { useState, useEffect } from 'react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import trailerService from '../services/trailer.service';

const Trailers = () => {
    const [trailers, setTrailers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTrailer, setCurrentTrailer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(5);
    const [formData, setFormData] = useState({
        licensePlate: '',
        make: '',
        model: '',
        capacity: '',
        status: 'Disponible'
    });

    useEffect(() => {
        fetchTrailers();
    }, [currentPage]);

    const fetchTrailers = async () => {
        try {
            setLoading(true);
            const response = await trailerService.getAll(currentPage, limit);
            setTrailers(response.data || []);
            setTotalItems(response.count || 0);
            setTotalPages(Math.ceil((response.count || 0) / limit));
            setError('');
        } catch (err) {
            console.error('Error fetching trailers:', err);
            setError('Failed to load trailers');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'License Plate', accessor: 'licensePlate' },
        { header: 'Make', accessor: 'make' },
        { header: 'Model', accessor: 'model' },
        { header: 'Capacity (tons)', accessor: 'capacity' },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => (
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border
          ${item.status === 'Disponible' ? 'bg-success-500/10 text-success-400 border-success-500/20' :
                        item.status === 'Attachée' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' :
                            'bg-error-500/10 text-error-400 border-error-500/20'
                    }
        `}>
                    {item.status}
                </span>
            )
        },
    ];

    const handleOpenModal = (trailer = null) => {
        if (trailer) {
            setCurrentTrailer(trailer);
            setFormData({
                licensePlate: trailer.licensePlate,
                make: trailer.make,
                model: trailer.model,
                capacity: trailer.capacity,
                status: trailer.status
            });
        } else {
            setCurrentTrailer(null);
            setFormData({
                licensePlate: '',
                make: '',
                model: '',
                capacity: '',
                status: 'Disponible'
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (trailer) => {
        if (window.confirm('Are you sure you want to delete this trailer?')) {
            try {
                await trailerService.delete(trailer._id);
                await fetchTrailers();
            } catch (err) {
                console.error('Error deleting trailer:', err);
                alert('Failed to delete trailer');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentTrailer) {
                await trailerService.update(currentTrailer._id, formData);
            } else {
                await trailerService.create(formData);
            }
            setIsModalOpen(false);
            await fetchTrailers();
        } catch (err) {
            console.error('Error saving trailer:', err);
            const errorMessage = err.response?.data?.message || 'Failed to save trailer';
            alert(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white text-lg">Loading trailers...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-1">
                        Trailers Management <span className="text-xl text-primary-500 font-normal">({totalItems} Trailers)</span>
                    </h1>
                    <p className="text-zinc-400 text-sm">Manage your fleet trailers</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Add Trailer
                </button>
            </div>

            {error && (
                <div className="bg-error-500/10 border border-error-500/50 text-error-400 p-4 rounded-xl mb-6 text-sm">
                    {error}
                </div>
            )}

            <Table
                columns={columns}
                data={trailers}
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
                title={currentTrailer ? 'Edit Trailer' : 'Add New Trailer'}
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
                                max="100"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                            >
                                <option value="Disponible">Disponible</option>
                                <option value="Attachée">Attachée</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
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

export default Trailers;
