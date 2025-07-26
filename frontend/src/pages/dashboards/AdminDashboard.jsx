import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/currencyFormatter';

const Pagination = ({ pages, page, onPageChange }) => {
    if (pages <= 1) return null;
    return (
        <nav className="flex justify-center mt-6">
            <ul className="inline-flex -space-x-px">
                {[...Array(pages).keys()].map(p => (
                    <li key={p + 1}>
                        <button
                            onClick={() => onPageChange(p + 1)}
                            className={`px-4 py-2 text-sm leading-tight ${page === p + 1 ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500'} border border-gray-300 hover:bg-gray-100`}
                        >
                            {p + 1}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

const StatCard = ({ title, value, icon, colorClass }) => (
    <div className={`p-6 rounded-lg shadow-md flex items-center space-x-4 ${colorClass}`}>
        <div className="text-3xl">{icon}</div>
        <div>
            <p className="text-lg font-medium">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    </div>
);

const AdminProfileSection = () => {
    const { user, apiClient, updateUserContext } = useAppContext();
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        password: '',
        confirmPassword: ''
    });
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get('/api/users/profile');
            setFormData({
                name: data.name || '',
                phoneNumber: data.phoneNumber || '',
                gender: data.gender || '',
                dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
                street: data.address?.street || '',
                city: data.address?.city || '',
                state: data.address?.state || '',
                zip: data.address?.zip || '',
                password: '', confirmPassword: ''
            });
        } catch (err) {
            setError('Failed to load profile data.');
        } finally {
            setLoading(false);
        }
    }, [apiClient]);

    useEffect(() => {
        if (!isEditMode) {
            fetchProfile();
        }
    }, [isEditMode, fetchProfile]);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setProfilePictureFile(e.target.files[0]);

    const handleCancel = () => {
        setIsEditMode(false);
        setError('');
        setSuccess('');
        fetchProfile();
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError(''); setSuccess('');
        if (formData.password && formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); setLoading(false); return; }
        const updatedData = new FormData();
        updatedData.append('name', formData.name);
        updatedData.append('phoneNumber', formData.phoneNumber);
        updatedData.append('gender', formData.gender);
        updatedData.append('dateOfBirth', formData.dateOfBirth);
        updatedData.append('address[street]', formData.street);
        updatedData.append('address[city]', formData.city);
        updatedData.append('address[state]', formData.state);
        updatedData.append('address[zip]', formData.zip);
        if (profilePictureFile) updatedData.append('profilePicture', profilePictureFile);
        if (formData.password) updatedData.append('password', formData.password);

        try {
            const { data } = await apiClient.put('/api/users/profile', updatedData, { headers: { 'Content-Type': 'multipart/form-data' }, });
            updateUserContext(data);
            setSuccess('Profile updated successfully!');
            setIsEditMode(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.name) return <p className="text-center py-10">Loading Profile...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Profile</h2>
                {!isEditMode && (
                    <button onClick={() => setIsEditMode(true)} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700">Edit Profile</button>
                )}
            </div>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            {success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                    <div className="flex items-center space-x-6">
                        <img src={`${import.meta.env.VITE_API_BASE_URL}${user.profilePicture}`} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                        {isEditMode &&
                            <input type="file" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" />
                        }
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Email</label>
                            <input type="email" value={user.email} disabled className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 p-2">
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Street</label>
                            <input type="text" name="street" value={formData.street} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">State</label>
                            <input type="text" name="state" value={formData.state} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">ZIP Code</label>
                            <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 p-2" />
                        </div>
                    </div>
                    {isEditMode && (
                        <div className="pt-6 border-t mt-6">
                            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">New Password</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" placeholder="Leave blank to keep current" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700">Confirm New Password</label>
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                                </div>
                            </div>
                        </div>
                    )}
                    {isEditMode && (
                        <div className="mt-8 flex justify-end space-x-4">
                            <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
                            <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};


// The main component for the Analytics tab
const AnalyticsSection = () => {
    const { apiClient } = useAppContext();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const { data } = await apiClient.get('/api/users/admin/stats');
                setStats(data);
            } catch (err) {
                setError('Failed to load platform statistics.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [apiClient]);

    if (loading) return <p>Loading Analytics...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Platform Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon="💰"
                    colorClass="bg-green-100 text-green-800"
                />
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon="👥"
                    colorClass="bg-blue-100 text-blue-800"
                />
                <StatCard
                    title="Total Providers"
                    value={stats.totalProviders}
                    icon="🛠️"
                    colorClass="bg-yellow-100 text-yellow-800"
                />
                <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    icon="📅"
                    colorClass="bg-purple-100 text-purple-800"
                />
                <StatCard
                    title="Total Services"
                    value={stats.totalServices}
                    icon="✨"
                    colorClass="bg-pink-100 text-pink-800"
                />
            </div>
            {/* Future charts and graphs will be added here */}
        </div>
    );
};

// Updated ManageUsersSection with total count
const ManageUsersSection = () => {
    const { apiClient } = useAppContext();
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = useCallback(async (pageNumber = 1) => {
        setLoading(true);
        try {
            const { data } = await apiClient.get(`/api/users?role=user&pageNumber=${pageNumber}`);
            setUsers(data.users);
            setPage(data.page);
            setPages(data.pages);
            setTotal(data.total);
        } catch (err) {
            setError('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    }, [apiClient]);

    useEffect(() => {
        fetchUsers(page);
    }, [page, fetchUsers]);

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This will also remove their related data.')) {
            try {
                await apiClient.delete(`/api/users/${userId}`);
                fetchUsers(page);
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete user.');
            }
        }
    };

    if (loading && users.length === 0) return <p>Loading Users...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Users</h2>
                <span className="text-sm text-gray-500 font-medium">Showing {users.length} of {total} Users</span>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <img src={`${import.meta.env.VITE_API_BASE_URL}${user.profilePicture}`} alt={user.name} className="w-10 h-10 object-cover rounded-md mr-4 inline-block" />
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination pages={pages} page={page} onPageChange={(newPage) => setPage(newPage)} />
        </div>
    );
};

// fully functional ManageProvidersSection component
const ManageProvidersSection = () => {
    const { apiClient } = useAppContext();
    const [providers, setProviders] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProviders = useCallback(async (pageNumber = 1) => {
        setLoading(true);
        try {
            const { data } = await apiClient.get(`/api/users?role=provider&pageNumber=${pageNumber}`);
            setProviders(data.users);
            setPage(data.page);
            setPages(data.pages);
            setTotal(data.total);
        } catch (err) {
            setError('Failed to fetch providers.');
        } finally {
            setLoading(false);
        }
    }, [apiClient]);

    useEffect(() => {
        fetchProviders(page);
    }, [page, fetchProviders]);

    const handleApproveProvider = async (providerId) => {
        try {
            await apiClient.put(`/api/users/approve/${providerId}`);
            fetchProviders(page);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to approve provider.');
        }
    };

    const handleDeleteProvider = async (providerId) => {
        if (window.confirm('Are you sure you want to delete this provider? This will also remove their services and other data.')) {
            try {
                await apiClient.delete(`/api/users/${providerId}`);
                fetchProviders(page);
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete provider.');
            }
        }
    };

    if (loading && providers.length === 0) return <p>Loading Providers...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Providers</h2>
                <span className="text-sm text-gray-500 font-medium">Showing {providers.length} of {total} Providers</span>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {providers.map((provider) => (
                                <tr key={provider._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <img src={`${import.meta.env.VITE_API_BASE_URL}${provider.profilePicture}`} alt={provider.name} className="w-10 h-10 object-cover rounded-md mr-4 inline-block" />
                                        {provider.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{provider.companyName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${provider.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {provider.isApproved ? 'Approved' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        {!provider.isApproved && (
                                            <button onClick={() => handleApproveProvider(provider._id)} className="text-green-600 hover:text-green-900">Approve</button>
                                        )}
                                        <button onClick={() => handleDeleteProvider(provider._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination pages={pages} page={page} onPageChange={(newPage) => setPage(newPage)} />
        </div>
    );
};


// fully functional ManageServicesSection component
const ManageServicesSection = () => {
    const { apiClient } = useAppContext();
    const [services, setServices] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchServices = useCallback(async (pageNumber = 1) => {
        setLoading(true);
        try {
            const { data } = await apiClient.get(`/api/services?page=${pageNumber}`);
            setServices(data.services);
            setPage(data.page);
            setPages(data.pages);
            setTotal(data.totalServices);
        } catch (err) {
            setError('Failed to fetch services.');
        } finally {
            setLoading(false);
        }
    }, [apiClient]);

    useEffect(() => {
        fetchServices(page);
    }, [page, fetchServices]);

    const handleDeleteService = async (serviceId) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await apiClient.delete(`/api/services/${serviceId}`);
                fetchServices(page);
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete service.');
            }
        }
    };

    if (loading && services.length === 0) return <p>Loading Services...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Services</h2>
                <span className="text-sm text-gray-500 font-medium">Showing {services.length} of {total} Services</span>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {services.map((service) => (
                                <tr key={service._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <img src={`${import.meta.env.VITE_API_BASE_URL}${service.image}`} alt={service.name} className="w-10 h-10 object-cover rounded-md mr-4 inline-block" />
                                        {service.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.category?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.provider?.companyName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(service.price)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDeleteService(service._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination pages={pages} page={page} onPageChange={(newPage) => setPage(newPage)} />
        </div>
    );
};

const CategoriesSection = () => {
    const { apiClient } = useAppContext();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [categoryPicture, setCategoryPicture] = useState(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get('/api/categories');
            setCategories(data);
        } catch (err) {
            setError('Failed to fetch categories.');
        } finally {
            setLoading(false);
        }
    }, [apiClient]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleOpenModal = (category = null) => {
        setCurrentCategory(category);
        setFormData({ name: category ? category.name : '', description: category ? category.description : '' });
        setCategoryPicture(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
        setFormData({ name: '', description: '' });
        setCategoryPicture(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        submissionData.append('name', formData.name);
        submissionData.append('description', formData.description);
        if (categoryPicture) {
            submissionData.append('categoryPicture', categoryPicture);
        }

        try {
            if (currentCategory) {
                await apiClient.put(`/api/categories/${currentCategory._id}`, submissionData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await apiClient.post('/api/categories', submissionData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            fetchCategories();
            handleCloseModal();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save category.');
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await apiClient.delete(`/api/categories/${categoryId}`);
                fetchCategories();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete category.');
            }
        }
    };

    if (loading) return <p>Loading Categories...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Categories</h2>
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700">Add Category</button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((cat) => (
                                <tr key={cat._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                                        <img src={`${import.meta.env.VITE_API_BASE_URL}${cat.image}`} alt={cat.name} className="w-10 h-10 object-cover rounded-md mr-4" />
                                        {cat.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <button onClick={() => handleOpenModal(cat)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                        <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 border-b">
                                <h2 className="text-2xl font-bold">{currentCategory ? 'Edit' : 'Add'} Category</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Name</label>
                                    <input type="text" placeholder="Category Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Description</label>
                                    <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded-md" rows="3"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Image</label>
                                    <input type="file" onChange={(e) => setCategoryPicture(e.target.files[0])} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" />
                                </div>
                            </div>
                            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-4">
                                <button type="button" onClick={handleCloseModal} className="px-6 py-2 bg-gray-200 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Main AdminDashboard Component
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <AdminProfileSection />;
            case 'analytics': return <AnalyticsSection />;
            case 'users': return <ManageUsersSection />;
            case 'providers': return <ManageProvidersSection />;
            case 'services': return <ManageServicesSection />;
            case 'categories': return <CategoriesSection />;
            default: return <AdminProfileSection />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="md:flex md:space-x-8">
                <aside className="md:w-1/4 flex-shrink-0">
                    <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
                    <nav className="space-y-1">
                        <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>My Profile</button>
                        <button onClick={() => setActiveTab('analytics')} className={`w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'analytics' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>Analytics</button>
                        <button onClick={() => setActiveTab('users')} className={`w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'users' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>Manage Users</button>
                        <button onClick={() => setActiveTab('providers')} className={`w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'providers' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>Manage Providers</button>
                        <button onClick={() => setActiveTab('services')} className={`w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'services' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>Manage Services</button>
                        <button onClick={() => setActiveTab('categories')} className={`w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'categories' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>Categories</button>
                    </nav>
                </aside>
                <main className="flex-grow mt-6 md:mt-0">
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md min-h-[400px]">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
