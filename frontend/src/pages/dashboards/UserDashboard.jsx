import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import BookingDetailsModal from '../../components/common/BookingDetailsModal';
import { formatCurrency } from '../../utils/currencyFormatter'; 

// Sub-component for displaying and editing the user's profile
const ProfileSection = () => {
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
        Object.keys(formData).forEach(key => {
            if (key.includes('password')) return;
            if (['street', 'city', 'state', 'zip'].includes(key)) {
                updatedData.append(`address[${key}]`, formData[key]);
            } else {
                updatedData.append(key, formData[key]);
            }
        });
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

// Sub-component to display an already submitted review
const SubmittedReview = ({ review }) => {
    return (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-800">Your Review</h4>
            <div className="flex items-center my-2">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-2xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                ))}
            </div>
            {review.comment && <p className="text-gray-600 italic">"{review.comment}"</p>}
        </div>
    );
};

// ReviewForm component
const ReviewForm = ({ serviceId, bookingId, onReviewSubmitted }) => {
    const { apiClient } = useAppContext();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('');
        if (rating === 0) { setError('Please select a star rating.'); return; }
        setIsSubmitting(true);
        try {
            await apiClient.post(`/api/services/${serviceId}/reviews`, { rating, comment, bookingId });
            if (onReviewSubmitted) {
                onReviewSubmitted({ booking: bookingId, rating, comment });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review.');
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-gray-800">Leave a Review</h4>
            {error && <p className="text-sm text-red-500 my-2">{error}</p>}
            <div className="flex items-center my-2">
                {[...Array(5)].map((_, i) => (
                    <button type="button" key={i} onClick={() => setRating(i + 1)} className="text-3xl text-gray-300 disabled:opacity-50" disabled={isSubmitting}>
                        <span className={i < rating ? 'text-yellow-400' : ''}>★</span>
                    </button>
                ))}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional: Share your experience..." className="w-full mt-2 p-2 border rounded-md" disabled={isSubmitting} />
            <button type="submit" className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 text-sm font-semibold disabled:bg-indigo-300" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
};

// BookingsSection with corrected review logic and currency formatting
const BookingsSection = () => {
    const { apiClient } = useAppContext();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get('/api/bookings/mybookings');
            setBookings(data);
        } catch (err) {
            setError('Could not fetch bookings.');
        } finally {
            setLoading(false);
        }
    }, [apiClient]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleReviewSubmitted = (newReview) => {
        setBookings(prevBookings => prevBookings.map(b =>
            b._id === newReview.booking ? { ...b, review: newReview } : b
        ));
    };

    const upcoming = bookings.filter(b => b.status === 'Scheduled');
    const past = bookings.filter(b => b.status !== 'Scheduled');

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
            {loading && <p>Loading bookings...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <>
                    <h3 className="text-lg font-semibold">Upcoming</h3>
                    {upcoming.length > 0 ? upcoming.map(b => (
                        <div key={b._id} className="p-4 bg-blue-50 border rounded-lg mb-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{b.service?.name}</p>
                                <p className="text-sm text-gray-600">On {new Date(b.bookingDate).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setSelectedBooking(b)} className="text-sm text-indigo-600 hover:underline">View Details</button>
                        </div>
                    )) : <p className="text-gray-500 mt-2">No upcoming bookings.</p>}

                    <h3 className="text-lg font-semibold mt-6">Past</h3>
                    {past.length > 0 ? past.map(b => (
                        <div key={b._id} className="p-4 bg-gray-100 border rounded-lg mb-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{b.service?.name} - {formatCurrency(b.amount)}</p>
                                    <p className="text-sm text-gray-600">{new Date(b.bookingDate).toLocaleDateString()} - <span className="font-semibold">{b.status}</span></p>
                                </div>
                                <button onClick={() => setSelectedBooking(b)} className="text-sm text-indigo-600 hover:underline">View Details</button>
                            </div>
                            {b.status === 'Completed' && (
                                b.review
                                    ? <SubmittedReview review={b.review} />
                                    : <ReviewForm serviceId={b.service._id} bookingId={b._id} onReviewSubmitted={handleReviewSubmitted} />
                            )}
                        </div>
                    )) : <p className="text-gray-500 mt-2">No past bookings.</p>}
                </>
            )}
            {selectedBooking && <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
        </div>
    );
};

// Main Dashboard Component
const UserDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['profile', 'bookings'].includes(tab)) {
            setActiveTab(tab);
        } else {
            setActiveTab('profile');
            navigate('/dashboard/user?tab=profile', { replace: true });
        }
    }, [location.search, navigate]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/dashboard/user?tab=${tab}`);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfileSection />;
            case 'bookings': return <BookingsSection />;
            default: return <ProfileSection />;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="md:flex md:space-x-8">
                <aside className="md:w-1/4 flex-shrink-0">
                    <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
                    <nav className="space-y-1">
                        <button onClick={() => handleTabChange('profile')} className={`w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>Profile</button>
                        <button onClick={() => handleTabChange('bookings')} className={`w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'bookings' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>My Bookings</button>
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

export default UserDashboard;
