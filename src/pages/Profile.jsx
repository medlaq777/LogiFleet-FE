import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/auth.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faIdBadge, faCalendarAlt, faShieldAlt, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const ProfileField = ({ icon, label, value }) => (
    <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 h-full">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center mr-4">
            <FontAwesomeIcon icon={icon} className="text-primary-400" />
        </div>
        <div>
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-white font-semibold text-lg truncate w-full">{value || 'N/A'}</p>
        </div>
    </div>
);

const EditInput = ({ label, name, value, onChange, type = "text" }) => (
    <div className="mb-4">
        <label className="block text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
        />
    </div>
);

const Profile = () => {
    const { user, fetchProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '' // Optional for updates
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            await fetchProfile();
            setLoading(false);
        };
        loadProfile();
    }, []);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                password: ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            await authService.updateProfile(updateData);
            await fetchProfile(); // Refresh context
            setSuccess('Profile updated successfully');
            setIsEditing(false);
            setFormData(prev => ({ ...prev, password: '' })); // Clear password
        } catch (err) {
            console.error('Update failed:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    if (loading && !user) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">My Profile</h1>
                    <p className="text-zinc-400">View and manage your account information</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all duration-200 flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                        Edit Profile
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-error-500/10 border border-error-500/20 text-error-400 rounded-xl">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-success-500/10 border border-success-500/20 text-success-400 rounded-xl">
                    {success}
                </div>
            )}

            <div className="premium-card p-8 md:p-12 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:block">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-4 border-zinc-800 flex items-center justify-center shadow-xl">
                            <span className="text-4xl font-bold text-zinc-500">
                                {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-grow w-full">
                        {!isEditing ? (
                            <>
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
                                        icon={faCalendarAlt}
                                        label="Account Status"
                                        value="Active"
                                    />
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleSubmit} className="w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <EditInput
                                        label="First Name"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                    />
                                    <EditInput
                                        label="Last Name"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <EditInput
                                    label="Email Address"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    type="email"
                                />

                                <EditInput
                                    label="New Password (Optional)"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    type="password"
                                />

                                <div className="flex items-center gap-3 mt-6">
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 transition-all duration-200 flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faSave} />
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all duration-200 flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
