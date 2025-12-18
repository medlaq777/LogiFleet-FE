import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FuelChart, MaintenanceChart } from '../components/Charts';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faTrailer, faRing, faRoute, faArrowUp, faArrowDown, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import reportService from '../services/report.service';
import Trips from './Trips';

const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-[#1A1F2E] border border-zinc-800 rounded-xl p-6 hover:border-white/10 transition-all duration-300 group relative overflow-hidden">

        <div className={`absolute inset-0 bg-linear-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-5">
                <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <FontAwesomeIcon icon={icon} className="text-xl text-white" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full ${trend > 0
                        ? 'bg-success-500/10 text-success-400 border border-success-500/20'
                        : 'bg-error-500/10 text-error-400 border border-error-500/20'
                        }`}>
                        <FontAwesomeIcon icon={trend > 0 ? faArrowUp : faArrowDown} className="text-[10px]" />
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">{value}</h3>
                <p className="text-sm text-zinc-400 font-medium">{title}</p>
            </div>
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
        <div className="animate-fade-in">

            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center">
                        <FontAwesomeIcon icon={faTachometerAlt} className="text-primary-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard Overview</h1>
                    </div>
                </div>
                <p className="text-zinc-400 ml-13">Welcome back! Here's what's happening with your fleet today.</p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Trucks"
                    value={stats.totalTrucks || 0}
                    icon={faTruck}
                    color="from-primary-600 to-primary-700"
                />
                <StatCard
                    title="Total Trailers"
                    value={stats.totalTrailers || 0}
                    icon={faTrailer}
                    color="from-success-600 to-success-700"
                />
                <StatCard
                    title="Active Trips"
                    value={stats.activeTrips || 0}
                    icon={faRoute}
                    color="from-warning-600 to-warning-700"
                />
                <StatCard
                    title="Maintenance Alerts"
                    value={stats.maintenanceAlerts || stats.pendingMaintenance || 0}
                    icon={faRing}
                    color="from-error-600 to-error-700"
                />
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#1A1F2E] border border-zinc-800 rounded-xl p-8 min-h-24rem flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1 h-8 bg-linear-to-b from-primary-600 to-primary-700 rounded-full"></div>
                        <h3 className="text-xl font-bold text-white">Fuel Consumption Trend</h3>
                    </div>
                    <div className="flex-1 w-full flex items-center justify-center relative">
                        <FuelChart
                            labels={stats.fuelChart?.labels}
                            data={stats.fuelChart?.data}
                        />
                    </div>
                </div>

                <div className="bg-[#1A1F2E] border border-zinc-800 rounded-xl p-8 min-h-24rem flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1 h-8 bg-linear-to-b from-warning-600 to-warning-700 rounded-full"></div>
                        <h3 className="text-xl font-bold text-white">Maintenance Cost Distribution</h3>
                    </div>
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

    const isDriver = user?.role?.toLowerCase() === 'driver';
    return isDriver ? <Trips /> : <AdminDashboard />;
};

export default Dashboard;
