import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faIdBadge, faCalendarAlt, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const ProfileField = ({ icon, label, value }) => (
    <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center mr-4">
            <FontAwesomeIcon icon={icon} className="text-primary-400" />
        </div>
        <div>
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-white font-semibold text-lg">{value || 'N/A'}</p>
        </div>
    </div>
);

const Profile = () => {
    const { user, fetchProfile } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Refresh profile data on mount to ensure we have the latest from backend
        const loadProfile = async () => {
            setLoading(true);
            await fetchProfile();
            setLoading(false);
        };
        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white mb-2">My Profile</h1>
                <p className="text-zinc-400">View and manage your account information</p>
            </div>

            <div className="premium-card p-8 md:p-12 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-4 border-zinc-800 flex items-center justify-center shadow-xl">
                            <span className="text-4xl font-bold text-zinc-500">
                                {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-grow w-full">
                        <div className="pb-6 mb-6 border-b border-white/5 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-white mb-2">
                                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                            </h2>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium">
                                <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
                                {user.role}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ProfileField
                                icon={faEnvelope}
                                label="Email Address"
                                value={user.email}
                            />
                            <ProfileField
                                icon={faIdBadge}
                                label="User ID"
                                value={user._id ? user._id.slice(-6).toUpperCase() : '...'}
                            />
                            {/* Add more fields if available in user object, e.g., phone, department */}
                            <ProfileField
                                icon={faCalendarAlt}
                                label="Account Status"
                                value="Active"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
