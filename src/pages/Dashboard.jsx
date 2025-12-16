import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FuelChart, MaintenanceChart } from '../components/Charts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faTrailer, faRing, faGasPump, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import reportService from '../services/report.service';
import Trips from './Trips';

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

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalTrucks: 0,
        totalTrailers: 0,
        activeTrips: 0,
        maintenanceAlerts: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await reportService.getStatistics();
                if (response.success) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-zinc-400">Welcome back, here's what's happening with your fleet today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Trucks"
                    value={stats.totalTrucks || 0}
                    icon={faTruck}
                    color="from-primary-500 to-primary-600 shadow-primary-500/50"
                />
                <StatCard
                    title="Total Trailers"
                    value={stats.totalTrailers || 0}
                    icon={faTrailer}
                    color="from-success-500 to-success-600 shadow-success-500/50"
                />
                <StatCard
                    title="Active Trips"
                    value={stats.activeTrips || 0}
                    icon={faGasPump}
                    color="from-accent-500 to-accent-600 shadow-accent-500/50"
                />
                <StatCard
                    title="Maintenance Alerts"
                    value={stats.maintenanceAlerts || stats.pendingMaintenance || 0}
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
                        <FuelChart
                            labels={stats.fuelChart?.labels}
                            data={stats.fuelChart?.data}
                        />
                    </div>
                </div>
                <div className="premium-card p-8 min-h-[24rem] flex flex-col">
                    <h3 className="text-xl font-display font-semibold text-white mb-8 flex items-center gap-3">
                        <div className="w-2 h-8 bg-gradient-to-b from-accent-500 to-accent-600 rounded-full"></div>
                        Maintenance Cost Distribution
                    </h3>
                    <div className="flex-1 w-full flex items-center justify-center relative">
                        <MaintenanceChart
                            labels={stats.maintenanceChart?.labels}
                            data={stats.maintenanceChart?.data}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    // Backend returns role as "Admin" or "Driver" (capitalized)
    const isDriver = user?.role?.toLowerCase() === 'driver';
    return isDriver ? <Trips /> : <AdminDashboard />;
};

export default Dashboard;
