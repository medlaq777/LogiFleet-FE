import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCog } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ onMenuClick }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <header className="h-20 glass-effect sticky top-0 z-50 flex items-center justify-between px-6 md:px-8">
            <div className="flex items-center">
                <button
                    onClick={onMenuClick}
                    className="md:hidden btn-icon mr-4"
                >
                    <FontAwesomeIcon icon={faBars} className="text-xl" />
                </button>

                {/* Page Title - Hidden on mobile, shown on desktop */}
                <div className="hidden md:block">
                    <h2 className="text-lg font-bold text-white">Fleet Management</h2>
                    <p className="text-xs text-zinc-500">Monitor and control your operations</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Date & Time Display */}
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <div className="text-right">
                        <p className="text-xs text-zinc-500 font-medium">{formatDate(currentTime)}</p>
                        <p className="text-sm text-white font-semibold">{formatTime(currentTime)}</p>
                    </div>
                </div>

                <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

                {/* Settings Button */}
                <button className="btn-icon group">
                    <FontAwesomeIcon icon={faCog} className="text-xl group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
