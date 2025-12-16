import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faSearch } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ onMenuClick }) => {
    return (
        <header className="h-20 glass-effect sticky top-0 z-50 flex items-center justify-between px-6 md:px-8">
            <div className="flex items-center">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 mr-4"
                >
                    <FontAwesomeIcon icon={faBars} className="text-xl" />
                </button>

                {/* Enhanced Search Bar with expand animation */}
                <div className="hidden md:flex items-center relative group">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 text-zinc-500 group-focus-within:text-primary-400 transition-colors duration-200" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-[#1C1C24] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 w-80 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:w-96 transition-all duration-300"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                {/* System Status Indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-500/10 border border-success-500/20">
                    <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></span>
                    <span className="text-xs text-success-400 font-semibold">System Operational</span>
                </div>

                <div className="h-6 w-px bg-white/10"></div>

                {/* Notification Button */}
                <button className="relative p-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group">
                    <FontAwesomeIcon icon={faBell} className="text-xl" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full ring-2 ring-[#0A0A0F] group-hover:scale-110 transition-transform duration-200"></span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
