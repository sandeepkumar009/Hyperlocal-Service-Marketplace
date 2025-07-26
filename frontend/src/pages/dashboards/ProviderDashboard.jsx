import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import ServiceFormModal from '../../components/common/ServiceFormModal';
import ReviewsModal from '../../components/common/ReviewsModal';
import BookingDetailsModal from '../../components/common/BookingDetailsModal';
import { formatCurrency } from '../../utils/currencyFormatter';

const ProviderProfileSection = () => {
    const { user, apiClient, updateUserContext } = useAppContext();
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({});
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
                companyName: data.companyName || '',
                availability: data.availability || '',
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
        updatedData.append('companyName', formData.companyName);
        updatedData.append('availability', formData.availability);
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
                            <label className="block text-sm font-semibold text-gray-700">Contact Person</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Company Name</label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 p-2" />
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
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700">Availability (e.g., Mon-Fri, 9am-5pm)</label>
                            <input type="text" name="availability" value={formData.availability} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 p-2" />
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

const ServiceManagementSection = () => {
    const { user, apiClient } = useAppContext();
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [serviceReviews, setServiceReviews] = useState([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [servicesRes, categoriesRes] = await Promise.all([
                apiClient.get(`/api/services?provider=${user._id}`),
                apiClient.get('/api/categories')
            ]);
            setServices(servicesRes.data.services);
            setCategories(categoriesRes.data);
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    }, [apiClient, user._id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenFormModal = (service = null) => { setCurrentService(service); setIsFormModalOpen(true); };
    const handleOpenReviewsModal = async (service) => {
        setCurrentService(service);
        try {
            const { data } = await apiClient.get(`/api/services/${service._id}`);
            setServiceReviews(data.reviews);
        } catch (err) {
            console.error("Failed to fetch service reviews", err);
            setServiceReviews([]);
        }
        setIsReviewsModalOpen(true);
    };
    const handleCloseModals = () => { setIsFormModalOpen(false); setIsReviewsModalOpen(false); setCurrentService(null); setServiceReviews([]); };

    const handleSubmitService = async (formData, serviceId) => {
        setLoading(true);
        try {
            if (serviceId) {
                await apiClient.put(`/api/services/${serviceId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await apiClient.post('/api/services', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            fetchData();
            handleCloseModals();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save service.');
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteService = async (serviceId) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            setLoading(true);
            try {
                await apiClient.delete(`/api/services/${serviceId}`);
                fetchData();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete service.');
            } finally {
                setLoading(false);
            }
        }
    };
    if (loading && services.length === 0) return <p>Loading services...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Services</h2>
                <button onClick={() => handleOpenFormModal()} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700">Add New Service</button>
            </div>
            <div className="space-y-4">
                {services.length > 0 ? services.map(service => (
                    <div key={service._id} className="p-4 bg-gray-200 rounded-lg flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <img src={`${import.meta.env.VITE_API_BASE_URL}${service.image}`} alt={service.name} className="w-16 h-16 object-cover rounded-md" />
                            <div>
                                <p className="font-semibold">{service.name}</p>
                                <p className="text-sm text-gray-600">{formatCurrency(service.price)} - {service.category.name}</p>
                                <p className="text-sm text-yellow-500 font-semibold">★ {service.averageRating?.toFixed(1) || 'No Ratings'} ({service.numReviews || 0} reviews)</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handleOpenReviewsModal(service)} className="text-sm px-3 py-1 bg-gray-500 text-white rounded-md">Reviews ({service.numReviews || 0})</button>
                            <button onClick={() => handleOpenFormModal(service)} className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md">View / Edit</button>
                            <button onClick={() => handleDeleteService(service._id)} className="text-sm px-3 py-1 bg-red-500 text-white rounded-md">Delete</button>
                        </div>
                    </div>
                )) : <p>You have not added any services yet.</p>}
            </div>
            <ServiceFormModal isOpen={isFormModalOpen} onClose={handleCloseModals} onSubmit={handleSubmitService} service={currentService} categories={categories} loading={loading} />
            <ReviewsModal isOpen={isReviewsModalOpen} onClose={handleCloseModals} reviews={serviceReviews} serviceName={currentService?.name} />
        </div>
    );
};

const BookingsSection = () => {
    const { apiClient } = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get('/api/bookings/provider');
            setBookings(data);
            setFilteredBookings(data);
        } catch (err) {
            setError('Failed to fetch bookings.');
        } finally {
            setLoading(false);
        }
    }, [apiClient]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (filter === 'All') {
            setFilteredBookings(bookings);
        } else {
            setFilteredBookings(bookings.filter(b => b.status === filter));
        }
    }, [filter, bookings]);

    const handleUpdateStatus = async (bookingId, status) => {
        try {
            await apiClient.put(`/api/bookings/${bookingId}/status`, { status });
            fetchData();
        } catch (err) {
            alert('Failed to update booking status.');
        }
    };
    if (loading) return <p>Loading bookings...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Bookings Management</h2>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded-md bg-white">
                    <option value="All">All Bookings</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            <div className="space-y-4">
                {filteredBookings.length > 0 ? filteredBookings.map(booking => (
                    <div key={booking._id} className="p-4 bg-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold">{booking.service?.name || 'Service Not Found'}</p>
                                <p className="text-sm text-gray-600">For: {booking.user?.name || 'User Not Found'}</p>
                                <p className="text-sm text-gray-600">On: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'Completed' ? 'bg-green-100 text-green-800' : booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{booking.status}</span>
                                <button onClick={() => setSelectedBooking(booking)} className="text-sm text-indigo-600 hover:underline">View Details</button>
                            </div>
                        </div>
                        {booking.status === 'Scheduled' && (
                            <div className="mt-4 pt-4 border-t flex space-x-2">
                                <button onClick={() => handleUpdateStatus(booking._id, 'Completed')} className="text-sm px-3 py-1 bg-green-500 text-white rounded-md">Mark as Completed</button>
                                <button onClick={() => handleUpdateStatus(booking._id, 'Cancelled')} className="text-sm px-3 py-1 bg-red-500 text-white rounded-md">Cancel Booking</button>
                            </div>
                        )}
                    </div>
                )) : <p>No bookings found for the selected filter.</p>}
            </div>
            {selectedBooking && <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
        </div>
    );
};

const EarningsSection = () => {
    const { apiClient } = useAppContext();
    const [stats, setStats] = useState({ totalEarnings: 0, totalBookings: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const { data } = await apiClient.get('/api/bookings/provider/stats');
                setStats(data);
            } catch (err) {
                setError('Failed to load earnings data.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [apiClient]);
    if (loading) return <p>Loading stats...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Earnings Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-100 rounded-lg text-center">
                    <p className="text-lg text-green-800">Total Earnings</p>
                    <p className="text-4xl font-bold text-green-700">{formatCurrency(stats.totalEarnings)}</p>
                </div>
                <div className="p-6 bg-blue-100 rounded-lg text-center">
                    <p className="text-lg text-blue-800">Total Bookings</p>
                    <p className="text-4xl font-bold text-blue-700">{stats.totalBookings}</p>
                </div>
            </div>
        </div>
    );
};
const ProviderDashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProviderProfileSection />;
            case 'services': return <ServiceManagementSection />;
            case 'bookings': return <BookingsSection />;
            case 'earnings': return <EarningsSection />;
            default: return <ProviderProfileSection />;
        }
    };
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="md:flex md:space-x-8">
                <aside className="md:w-1/4 flex-shrink-0">
                    <h1 className="text-2xl font-bold mb-6">Provider Dashboard</h1>
                    <nav className="space-y-1">
                        <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>My Profile</button>
                        <button onClick={() => setActiveTab('services')} className={`w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'services' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>My Services</button>
                        <button onClick={() => setActiveTab('bookings')} className={`w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'bookings' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>Bookings</button>
                        <button onClick={() => setActiveTab('earnings')} className={`w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'earnings' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>Earnings</button>
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

export default ProviderDashboard;
