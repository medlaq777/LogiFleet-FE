import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../components/Pagination';
import tripService from '../services/trip.service';
import truckService from '../services/truck.service';
import trailerService from '../services/trailer.service';
import userService from '../services/user.service';

const Trips = () => {
    const { user } = useAuth();
    const isAdmin = user?.role?.toLowerCase() === 'admin';

    const [trips, setTrips] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const [trailers, setTrailers] = useState([]);
    const [drivers, setDrivers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTrip, setCurrentTrip] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(5);

    const [formData, setFormData] = useState({
        user: '',
        truck: '',
        trailer: '',
        departureLocation: '',
        arrivalLocation: '',
        departureDate: '',
        status: 'À faire',
        mileageStart: 0,
        mileageEnd: 0,
        fuelStart: 0,
        fuelEnd: 0,
        notes: ''
    });

    useEffect(() => {
        fetchTrips();
        if (isAdmin) {
            fetchTrucksAndTrailers();
        }
    }, [isAdmin, currentPage]);

    const fetchTrips = async () => {
        try {
            setLoading(true);
            const response = isAdmin
                ? await tripService.getAll(currentPage, limit)
                : await tripService.getMyTrips();

            setTrips(response.data || []);
            setTotalItems(response.count || 0);
            if (isAdmin) {
                setTotalPages(Math.ceil((response.count || 0) / limit));
            }
            setError('');
        } catch (err) {
            console.error('Error fetching trips:', err);
            const errorMsg = err.response?.data?.message || 'Failed to load trips';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrucksAndTrailers = async () => {
        try {
            const [trucksRes, trailersRes, driversRes] = await Promise.all([
                truckService.getAll(),
                trailerService.getAll(),
                userService.getDrivers()
            ]);
            setTrucks(trucksRes.data || []);
            setTrailers(trailersRes.data || []);
            setDrivers(driversRes.data || []);
        } catch (err) {
            console.error('Error fetching trucks/trailers:', err);
        }
    };

    const columns = [
        {
            header: 'Driver',
            render: (item) => (
                <div>
                    <div className="font-semibold text-white">
                        {item.driverId?.firstName} {item.driverId?.lastName}
                    </div>
                    <div className="text-xs text-zinc-400">{item.driverId?.email}</div>
                </div>
            )
        },
        {
            header: 'Departure',
            accessor: 'departureLocation',
            render: (item) => (
                <div>
                    <div className="font-semibold text-white">{item.departureLocation}</div>
                    <div className="text-xs text-zinc-400">
                        {item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A'}
                    </div>
                </div>
            )
        },
        { header: 'Arrival', accessor: 'arrivalLocation' },
        {
            header: 'Truck',
            render: (item) => item.truckId?.licensePlate || 'N/A'
        },
        {
            header: 'Trailer',
            render: (item) => item.trailerId?.licensePlate || 'N/A'
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => (
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border
          ${item.status === 'À faire' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' :
                        item.status === 'En cours' ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' :
                            'bg-success-500/10 text-success-400 border-success-500/20'
                    }
        `}>
                    {item.status}
                </span>
            )
        },
    ];

    const handleOpenModal = (trip = null) => {
        if (trip) {
            setCurrentTrip(trip);
            setFormData({
                driverId: typeof trip.driverId === 'object' ? trip.driverId?._id : trip.driverId || '',
                truckId: typeof trip.truckId === 'object' ? trip.truckId?._id : trip.truckId || '',
                trailerId: typeof trip.trailerId === 'object' ? trip.trailerId?._id : trip.trailerId || '',
                departureLocation: trip.departureLocation || '',
                arrivalLocation: trip.arrivalLocation || '',
                startDate: trip.startDate ? trip.startDate.split('T')[0] : '',
                status: trip.status || 'À faire',
                startMileage: trip.startMileage || 0,
                endMileage: trip.endMileage || 0,
                fuelVolumeAdded: trip.fuelVolumeAdded || 0,
                notes: trip.notes || ''
            });
        } else {
            setCurrentTrip(null);
            setFormData({
                driverId: '',
                truckId: '',
                trailerId: '',
                departureLocation: '',
                arrivalLocation: '',
                startDate: '',
                status: 'À faire',
                startMileage: 0,
                endMileage: 0,
                fuelVolumeAdded: 0,
                notes: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (trip) => {
        if (window.confirm('Are you sure you want to delete this trip?')) {
            try {
                await tripService.delete(trip._id);
                await fetchTrips();
            } catch (err) {
                console.error('Error deleting trip:', err);
                alert('Failed to delete trip');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentTrip) {
                await tripService.update(currentTrip._id, formData);
            } else {
                await tripService.create(formData);
            }
            setIsModalOpen(false);
            await fetchTrips();
        } catch (err) {
            console.error('Error saving trip:', err);
            const errorMessage = err.response?.data?.message || 'Failed to save trip';
            alert(errorMessage);
        }
    };

    const handleDownloadPDF = async (tripId) => {
        try {
            const blob = await tripService.downloadPDF(tripId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `mission-${tripId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading PDF:', err);
            alert('Failed to download PDF');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white text-lg">Loading trips...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-1">
                        {isAdmin ? 'Trips Management' : 'My Trips'}
                        {isAdmin && <span className="text-xl text-primary-500 font-normal ml-2">({totalItems} Trips)</span>}
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        {isAdmin ? 'Manage all fleet trips' : 'View and manage your assigned trips'}
                    </p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        New Trip
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-error-500/10 border border-error-500/50 text-error-400 p-4 rounded-xl mb-6 text-sm">
                    {error}
                </div>
            )}

            <Table
                columns={columns}
                data={trips}
                onEdit={isAdmin ? handleOpenModal : undefined}
                onDelete={isAdmin ? handleDelete : undefined}
            />

            {isAdmin && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={totalItems}
                    itemsPerPage={limit}
                />
            )}

            {isAdmin && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={currentTrip ? 'Edit Trip' : 'Create New Trip'}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Assign Driver</label>
                            <select
                                value={formData.driverId}
                                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                                required
                            >
                                <option value="">Select Driver</option>
                                {drivers.map(driver => (
                                    <option key={driver._id} value={driver._id}>
                                        {driver.firstName} {driver.lastName} - {driver.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-2">Truck</label>
                                <select
                                    value={formData.truckId}
                                    onChange={(e) => setFormData({ ...formData, truckId: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                                    required
                                >
                                    <option value="">Select Truck</option>
                                    {trucks.map(truck => (
                                        <option key={truck._id} value={truck._id}>
                                            {truck.licensePlate} - {truck.make} {truck.model}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-2">Trailer</label>
                                <select
                                    value={formData.trailerId}
                                    onChange={(e) => setFormData({ ...formData, trailerId: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                                    required
                                >
                                    <option value="">Select Trailer</option>
                                    {trailers.map(trailer => (
                                        <option key={trailer._id} value={trailer._id}>
                                            {trailer.licensePlate} - {trailer.make} {trailer.model}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-2">Departure Location</label>
                                <input
                                    type="text"
                                    value={formData.departureLocation}
                                    onChange={(e) => setFormData({ ...formData, departureLocation: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-2">Arrival Location</label>
                                <input
                                    type="text"
                                    value={formData.arrivalLocation}
                                    onChange={(e) => setFormData({ ...formData, arrivalLocation: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Departure Date</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
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
                                <option value="À faire">À faire</option>
                                <option value="En cours">En cours</option>
                                <option value="Terminée">Terminée</option>
                                <option value="Annulé">Annulé</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Notes</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full px-4 py-3 bg-[#1C1C24] border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                                rows="3"
                            />
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
            )}
        </div>
    );
};

export default Trips;
