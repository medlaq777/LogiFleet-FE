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
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();

    const adminLinks = [
        { path: '/', icon: faChartLine, label: 'Dashboard' },
        { path: '/trucks', icon: faTruck, label: 'Trucks' },
        { path: '/trailers', icon: faTrailer, label: 'Trailers' },
        { path: '/tires', icon: faRing, label: 'Tires' },
        { path: '/trips', icon: faRoute, label: 'Trips' },
        { path: '/maintenance', icon: faTools, label: 'Maintenance' },
    ];

    const driverLinks = [
        { path: '/', icon: faRoute, label: 'My Trips' },
    ];

    // Backend returns role as "Admin" or "Driver" (capitalized)
    const isAdmin = user?.role?.toLowerCase() === 'admin';
    const links = isAdmin ? adminLinks : driverLinks;

    return (
        <>
            {/* Mobile Overlay with enhanced backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 md:hidden animate-fade-in"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-[#0A0A0F] border-r border-white/5 transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:inset-0
      `}>
                {/* Logo Area with gradient accent */}
                <div className="h-20 flex items-center px-6 border-b border-white/5 bg-gradient-to-r from-primary-500/10 to-transparent">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mr-3 shadow-lg shadow-primary-500/30">
                        <FontAwesomeIcon icon={faTruck} className="text-white text-lg" />
                    </div>
                    <h1 className="text-xl font-display font-bold text-white tracking-wide">
                        FLEET<span className="text-gradient-primary">PRO</span>
                    </h1>
                    <button onClick={onClose} className="md:hidden ml-auto text-zinc-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-all duration-200">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-8 px-4 space-y-2">
                    <p className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Menu</p>
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => window.innerWidth < 768 && onClose()}
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                ${isActive
                                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg shadow-primary-500/20'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'}
              `}
                        >
                            <FontAwesomeIcon
                                icon={link.icon}
                                className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
                            />
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile & Logout */}
                <div className="absolute bottom-0 w-full p-6 border-t border-white/5 bg-[#0A0A0F] space-y-3">
                    {/* User Profile Card */}
                    {/* User Profile Card */}
                    <Link to="/profile" className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-[#13131A] to-[#1C1C24] border border-white/5 hover:border-white/20 transition-all duration-200 cursor-pointer group">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
                            {user?.firstName?.charAt(0) || user?.email?.charAt(0)}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-sm font-semibold text-white truncate group-hover:text-primary-400 transition-colors duration-200">
                                {user?.firstName && user?.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user?.email}
                            </p>
                            <p className="text-xs text-zinc-400 capitalize truncate">{user?.role}</p>
                        </div>
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-error-500/10 text-error-400 hover:bg-error-500 hover:text-white border border-error-500/20 hover:border-error-500 transition-all duration-200 font-semibold group"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
