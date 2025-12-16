import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FuelChart, MaintenanceChart } from '../components/Charts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faTrailer, faRing, faGasPump, faCheckCircle, faClock, faPlay, faArrowUp, faArrowDown, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import tripService from '../services/trip.service';

const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="premium-card p-6 hover:shadow-premium hover:border-white/10 transition-all duration-300 group relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <FontAwesomeIcon icon={icon} className="text-xl text-white" />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${trend > 0
                    ? 'bg-success-500/10 text-success-400 border border-success-500/20'
                    : 'bg-error-500/10 text-error-400 border border-error-500/20'
                    }`}>
                    <FontAwesomeIcon icon={trend > 0 ? faArrowUp : faArrowDown} />
                    {Math.abs(trend)}%
                </div>
            )}
        </div>

        <div>
            <h3 className="text-4xl font-bold text-white mb-1 tracking-tight">{value}</h3>
            <p className="text-sm text-zinc-400 font-medium">{title}</p>
        </div>
    </div>
);

const DriverDashboard = ({ user }) => {
    const [myTrips, setMyTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyTrips();
    }, []);

    const fetchMyTrips = async () => {
        try {
            setLoading(true);
            const response = await tripService.getMyTrips();
            setMyTrips(response.data || []);
        } catch (err) {
            console.error('Error fetching trips:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (tripId, newStatus) => {
        try {
            await tripService.update(tripId, { status: newStatus });
            await fetchMyTrips();
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update trip status');
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
        return <div className="text-white">Loading trips...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">My Trips</h1>
            <p className="text-zinc-400 mb-6">Manage your assigned routes and status.</p>

            <div className="space-y-4">
                {myTrips.length === 0 ? (
                    <div className="premium-card p-8 text-center text-zinc-400">
                        No trips assigned yet
                    </div>
                ) : (
                    myTrips.map(trip => (
                        <div key={trip._id} className="premium-card p-6 flex flex-col md:flex-row justify-between items-center hover:border-white/10 transition-all duration-200 group">
                            <div className="mb-4 md:mb-0 flex-1">
                                <div className="flex items-center mb-2">
                                    <span className={`w-2.5 h-2.5 rounded-full mr-3 ${trip.status === 'À faire' ? 'bg-zinc-400' :
                                        trip.status === 'En cours' ? 'bg-primary-500 animate-pulse' :
                                            'bg-success-500'
                                        }`}></span>
                                    <h3 className="text-xl font-display font-bold text-white">
                                        {trip.departureLocation} → {trip.arrivalLocation}
                                    </h3>
                                </div>
                                <p className="text-zinc-400 text-sm flex items-center">
                                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                                    {new Date(trip.departureDate).toLocaleDateString()}
                                    <span className="mx-2">•</span>
                                    <FontAwesomeIcon icon={faTruck} className="mr-2" />
                                    {trip.truck?.licensePlate || 'N/A'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {trip.status === 'À faire' && (
                                    <button
                                        onClick={() => handleStatusChange(trip._id, 'En cours')}
                                        className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faPlay} />
                                        Start Trip
                                    </button>
                                )}
                                {trip.status === 'En cours' && (
                                    <button
                                        onClick={() => handleStatusChange(trip._id, 'Terminée')}
                                        className="px-5 py-2.5 bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-600 text-white font-semibold rounded-xl shadow-lg shadow-success-500/30 hover:shadow-success-500/50 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faCheckCircle} />
                                        Complete
                                    </button>
                                )}
                                {trip.status === 'Terminée' && (
                                    <span className="text-success-400 font-semibold flex items-center gap-2 bg-success-500/10 px-5 py-2.5 rounded-xl border border-success-500/20">
                                        <FontAwesomeIcon icon={faCheckCircle} />
                                        Completed
                                    </span>
                                )}
                                <button
                                    onClick={() => handleDownloadPDF(trip._id)}
                                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200"
                                    title="Download Mission Order"
                                >
                                    <FontAwesomeIcon icon={faFilePdf} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const AdminDashboard = () => (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Dashboard Overview</h1>
            <p className="text-zinc-400">Welcome back, here's what's happening with your fleet today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Total Trucks"
                value="12"
                icon={faTruck}
                color="from-primary-500 to-primary-600 shadow-primary-500/50"
                trend={12}
            />
            <StatCard
                title="Total Trailers"
                value="8"
                icon={faTrailer}
                color="from-success-500 to-success-600 shadow-success-500/50"
                trend={5}
            />
            <StatCard
                title="Active Trips"
                value="5"
                icon={faGasPump}
                color="from-accent-500 to-accent-600 shadow-accent-500/50"
                trend={-2}
            />
            <StatCard
                title="Maintenance Alerts"
                value="3"
                icon={faRing}
                color="from-error-500 to-error-600 shadow-error-500/50"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="premium-card p-8 min-h-[24rem] flex flex-col">
                <h3 className="text-xl font-display font-semibold text-white mb-8 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
                    Fuel Consumption Trend
                </h3>
                <div className="flex-1 w-full flex items-center justify-center relative">
                    <FuelChart />
                </div>
            </div>
            <div className="premium-card p-8 min-h-[24rem] flex flex-col">
                <h3 className="text-xl font-display font-semibold text-white mb-8 flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-accent-500 to-accent-600 rounded-full"></div>
                    Maintenance Cost Distribution
                </h3>
                <div className="flex-1 w-full flex items-center justify-center relative">
                    <MaintenanceChart />
                </div>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    // Backend returns role as "Admin" or "Driver" (capitalized)
    const isDriver = user?.role?.toLowerCase() === 'driver';
    return isDriver ? <DriverDashboard user={user} /> : <AdminDashboard />;
};

export default Dashboard;
