import { useState, useEffect } from 'react';
import userService from '../services/user.service';
import Modal from '../components/common/Modal';
import Table from '../components/common/Table';
import Pagination from '../components/common/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUserShield, faUserTie, faSearch } from '@fortawesome/free-solid-svg-icons';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Driver'
    });

    useEffect(() => {
        fetchUsers();
    }, [currentPage, roleFilter]); // Refetch when page or filter changes

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAll(currentPage, itemsPerPage, roleFilter === 'All' ? '' : roleFilter);

            // Expected response from User Controller: { success: true, count: 123, data: [...] }
            if (response.success || response.data) {
                const data = response.data || [];
                const count = response.count || response.total || 0;
                setUsers(data);
                setTotalItems(count);
                setTotalPages(Math.ceil(count / itemsPerPage));
            } else {
                setUsers([]);
            }

        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openModal = (user = null) => {
        if (user) {
            setCurrentUser(user);
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: '', // Don't show password
                role: user.role
            });
        } else {
            setCurrentUser(null);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                role: 'Driver'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentUser) {
                // Update
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password; // Don't send empty password
                await userService.update(currentUser._id, updateData);
            } else {
                // Create
                await userService.create(formData);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            alert(error.response?.data?.message || 'Failed to save user');
        }
    };

    const handleDelete = async (user) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.delete(user._id);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        }
    };

    // Filter frontend search results separately since backend might not support partial search on all fields via API yet
    // OR ideally update backend to support search. For now, let's filter the CURRENT PAGE data or rely on backend if possible.
    // Given the current setup, standard is to filter locally if data set is small, or pass search param.
    // The previous implementation filtered locally. Since we are doing pagination, local filtering only works on the current page.
    // To properly support search with pagination, we should add a search param to API.
    // For this specific request "make it as list table", I'll stick to local filtering of the *fetched* data for search, 
    // but really we should probably ask the backend to search.
    // However, to keep it simple and robust without changing backend search logic too much right now:
    const filteredUsers = users.filter(user => {
        return (user.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    });

    const columns = [
        {
            header: 'User',
            accessor: 'firstName', // Fallback
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${user.role === 'Admin'
                        ? 'bg-gradient-to-br from-accent-500 to-accent-600 text-white'
                        : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                        }`}>
                        {user.firstName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-white">{user.firstName} {user.lastName}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Email',
            accessor: 'email',
            render: (user) => <span className="text-zinc-400">{user.email}</span>
        },
        {
            header: 'Role',
            accessor: 'role',
            render: (user) => (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border flex w-fit items-center ${user.role === 'Admin'
                    ? 'bg-accent-500/10 text-accent-400 border-accent-500/20'
                    : 'bg-primary-500/10 text-primary-400 border-primary-500/20'
                    }`}>
                    <FontAwesomeIcon icon={user.role === 'Admin' ? faUserShield : faUserTie} className="mr-1.5" />
                    {user.role}
                </span>
            )
        }
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">User Management</h1>
                    <p className="text-zinc-400">Manage drivers and administrators</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 transition-all duration-200 flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Add User
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search users on this page..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#13131A] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'Admin', 'Driver'].map(role => (
                        <button
                            key={role}
                            onClick={() => {
                                setRoleFilter(role);
                                setCurrentPage(1); // Reset to page 1 on filter change
                            }}
                            className={`px-4 py-2 rounded-xl border transition-all duration-200 ${roleFilter === role
                                ? 'bg-primary-500 text-white border-primary-500'
                                : 'bg-transparent text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table View */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <>
                    <Table
                        columns={columns}
                        data={filteredUsers}
                        onEdit={openModal}
                        onDelete={handleDelete}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                    />
                </>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentUser ? 'Edit User' : 'Add New User'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-zinc-400 text-sm font-medium mb-1.5">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-zinc-400 text-sm font-medium mb-1.5">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-zinc-400 text-sm font-medium mb-1.5">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-400 text-sm font-medium mb-1.5">
                            {currentUser ? 'New Password (Optional)' : 'Password'}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required={!currentUser}
                            placeholder={currentUser ? 'Leave blank to keep current' : ''}
                            className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-400 text-sm font-medium mb-1.5">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                        >
                            <option value="Driver">Driver</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 transition-all duration-200"
                        >
                            {currentUser ? 'Update User' : 'Create User'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Users;
