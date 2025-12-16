import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faTruck,
    faTrailer,
    faRing,
    faRoute,
    faTools,
    faSignOutAlt,
    faTimes,
    faUsers,
    faGlobe,
    faShieldAlt,
    faClipboardList
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const isAdmin = user?.role?.toLowerCase() === 'admin';

    // Grouping Links for better organization
    const adminGroups = [
        {
            title: 'Overview',
            links: [
                { path: '/', icon: faChartLine, label: 'Dashboard' },
            ]
        },
        {
            title: 'Fleet',
            links: [
                { path: '/trucks', icon: faTruck, label: 'Trucks' },
                { path: '/trailers', icon: faTrailer, label: 'Trailers' },
                { path: '/tires', icon: faRing, label: 'Tires' },
            ]
        },
        {
            title: 'Operations',
            links: [
                { path: '/trips', icon: faRoute, label: 'Trips' },
                { path: '/maintenance', icon: faTools, label: 'Maintenance' },
            ]
        },
        {
            title: 'Administration',
            links: [
                { path: '/users', icon: faUsers, label: 'Users' },
            ]
        }
    ];

    const driverGroups = [
        {
            title: 'My Work',
            links: [
                { path: '/', icon: faRoute, label: 'My Trips' },
            ]
        }
    ];

    const navigationGroups = isAdmin ? adminGroups : driverGroups;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 md:hidden animate-fade-in"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-30 w-72 bg-[#0A0A0F] border-r border-white/5 transform transition-transform duration-300 ease-out flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:inset-0
            `}>
                {/* Logo Area */}
                <div className="h-20 flex-shrink-0 flex items-center px-6 border-b border-white/5 bg-gradient-to-r from-primary-500/10 to-transparent">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mr-3 shadow-lg shadow-primary-500/30">
                        <FontAwesomeIcon icon={faTruck} className="text-white" />
                    </div>
                    <h1 className="text-xl font-display font-bold text-white tracking-wide">
                        FLEET<span className="text-gradient-primary">PRO</span>
                    </h1>
                    <button onClick={onClose} className="md:hidden ml-auto text-zinc-400 hover:text-white p-2">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Navigation (Scrollable) */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {navigationGroups.map((group, index) => (
                        <div key={index}>
                            <p className="px-4 text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest mb-3">
                                {group.title}
                            </p>
                            <div className="space-y-1">
                                {group.links.map((link) => (
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => window.innerWidth < 768 && onClose()}
                                        className={({ isActive }) => `
                                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                                            ${isActive
                                                ? 'bg-gradient-to-r from-primary-500/10 to-primary-500/5 text-primary-400 font-semibold border border-primary-500/10'
                                                : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'}
                                        `}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {isActive && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-full" />
                                                )}
                                                <FontAwesomeIcon
                                                    icon={link.icon}
                                                    className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                                                />
                                                <span>{link.label}</span>
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User Profile & Logout (Fixed at bottom) */}
                <div className="p-4 border-t border-white/5 bg-[#0A0A0F]">
                    <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-200 group cursor-pointer mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 font-bold group-hover:border-primary-500/50 group-hover:text-white transition-all duration-200">
                            {user?.firstName?.charAt(0) || user?.email?.charAt(0)}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-sm font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                                {user?.firstName ? user.firstName : 'User'}
                            </p>
                            <p className="text-xs text-zinc-500 capitalize">{user?.role}</p>
                        </div>
                    </Link>

                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-zinc-400 hover:text-error-400 hover:bg-error-500/10 transition-all duration-200 text-sm font-medium"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
