import { useState } from 'react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';

const Trips = () => {
    const [trips, setTrips] = useState([
        {
            id: 1,
            driver: 'John Driver',
            truck: 'AA-123-BB',
            trailer: 'TR-101-XX',
            route: 'Paris - Lyon',
            date: '2023-10-25',
            status: 'To Do'
        },
        {
            id: 2,
            driver: 'Jane Doe',
            truck: 'CC-456-DD',
            trailer: 'TR-202-YY',
            route: 'Marseille - Nice',
            date: '2023-10-26',
            status: 'In Progress'
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTrip, setCurrentTrip] = useState(null);
    const [formData, setFormData] = useState({
        driver: '', truck: '', trailer: '', route: '', date: '', status: 'To Do'
    });

    const columns = [
        { header: 'Driver', accessor: 'driver' },
        { header: 'Truck', accessor: 'truck' },
        { header: 'Trailer', accessor: 'trailer' },
        { header: 'Route', accessor: 'route' },
        { header: 'Date', accessor: 'date' },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
          ${item.status === 'To Do' ? 'bg-gray-700 text-gray-300' :
                        item.status === 'In Progress' ? 'bg-blue-900/30 text-blue-400' :
                            'bg-green-900/30 text-green-400'
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
            setFormData(trip);
        } else {
            setCurrentTrip(null);
            setFormData({ driver: '', truck: '', trailer: '', route: '', date: '', status: 'To Do' });
        }
        setIsModalOpen(true);
    };

    const handleDelete = (trip) => {
        if (window.confirm('Are you sure you want to delete this trip?')) {
            setTrips(trips.filter(t => t.id !== trip.id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentTrip) {
            setTrips(trips.map(t => t.id === currentTrip.id ? { ...formData, id: t.id } : t));
        } else {
            setTrips([...trips, { ...formData, id: Date.now() }]);
        }
        setIsModalOpen(false);
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Trip Report", 20, 10);
        trips.forEach((trip, index) => {
            doc.text(`${index + 1}. ${trip.route} (${trip.driver}) - ${trip.status}`, 20, 20 + (index * 10));
        });
        doc.save("trips.pdf");
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Trip Management</h1>
                <div className="space-x-3">
                    <button
                        onClick={generatePDF}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors"
                    >
                        <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                        Export PDF
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        New Trip
                    </button>
                </div>
            </div>

            <Table
                columns={columns}
                data={trips}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentTrip ? 'Edit Trip' : 'Create New Trip'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Driver</label>
                        <input
                            type="text"
                            value={formData.driver}
                            onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Truck</label>
                            <input
                                type="text"
                                value={formData.truck}
                                onChange={(e) => setFormData({ ...formData, truck: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Trailer</label>
                            <input
                                type="text"
                                value={formData.trailer}
                                onChange={(e) => setFormData({ ...formData, trailer: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Route</label>
                        <input
                            type="text"
                            value={formData.route}
                            onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            required
                        />
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
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Trips;
