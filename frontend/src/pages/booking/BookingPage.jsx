import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../utils/currencyFormatter';

const BookingPage = () => {
    const {
        serviceId
    } = useParams();
    const {
        user,
        apiClient
    } = useAppContext();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [bookingDetails, setBookingDetails] = useState({
        address: {
            street: '',
            city: '',
            state: '',
            zip: ''
        },
        date: '',
        timeSlot: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [serviceRes, profileRes] = await Promise.all([
                apiClient.get(`/api/services/${serviceId}`),
                apiClient.get('/api/users/profile')
            ]);
            setService(serviceRes.data.service);
            if (profileRes.data.address) {
                setBookingDetails(prev => ({ ...prev,
                    address: {
                        street: profileRes.data.address.street || '',
                        city: profileRes.data.address.city || '',
                        state: profileRes.data.address.state || '',
                        zip: profileRes.data.address.zip || '',
                    }
                }));
            }
        } catch (err) {
            setError('Failed to load necessary data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [serviceId, apiClient]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const handleAddressChange = (e) => setBookingDetails(prev => ({ ...prev,
        address: { ...prev.address,
            [e.target.name]: e.target.value
        }
    }));
    const handleDateTimeChange = (e) => setBookingDetails(prev => ({ ...prev,
        [e.target.name]: e.target.value
    }));

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!bookingDetails.date || !bookingDetails.timeSlot) {
            setError('Please select a date and time slot.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await apiClient.post('/api/bookings', {
                serviceId: service._id,
                bookingDate: bookingDetails.date,
                timeSlot: bookingDetails.timeSlot,
                address: bookingDetails.address,
                amount: service.price,
            });
            navigate('/booking-success');
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !service) return <p className="text-center py-10">Loading...</p>;
    if (error && !service) return <p className="text-center py-10 text-red-500">{error}</p>;
    if (!service) return <p className="text-center py-10">Service not found.</p>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden md:flex">
                <div className="md:w-1/2 p-8 bg-gray-50">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Booking Summary</h1>
                    <img src={`${import.meta.env.VITE_API_BASE_URL}${service.image}`} alt={service.name} className="w-full h-48 object-cover rounded-lg mb-4"/>
                    <h2 className="text-xl font-semibold">{service.name}</h2>
                    <p className="text-lg text-indigo-600 font-bold mt-2">{formatCurrency(service.price)}</p>
                </div>
                <div className="md:w-1/2 p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Schedule Your Service</h1>
                    <form onSubmit={handleBooking} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Date & Time</label>
                            <input type="date" name="date" value={bookingDetails.date} onChange={handleDateTimeChange} min={new Date().toISOString().split('T')[0]} className="w-full mt-1 p-2 border rounded-md"/>
                            <select name="timeSlot" value={bookingDetails.timeSlot} onChange={handleDateTimeChange} className="w-full mt-2 p-2 border rounded-md">
                                <option value="">Select a time slot</option>
                                <option>09:00 AM</option>
                                <option>11:00 AM</option>
                                <option>01:00 PM</option>
                                <option>03:00 PM</option>
                            </select>
                        </div>
                        <div className="space-y-2 pt-2 border-t">
                            <h3 className="text-lg font-medium">Service Address</h3>
                            <input type="text" name="street" placeholder="Street Address" value={bookingDetails.address.street} onChange={handleAddressChange} required className="w-full p-2 border rounded-md"/>
                            <input type="text" name="city" placeholder="City" value={bookingDetails.address.city} onChange={handleAddressChange} required className="w-full p-2 border rounded-md"/>
                            <input type="text" name="state" placeholder="State" value={bookingDetails.address.state} onChange={handleAddressChange} required className="w-full p-2 border rounded-md"/>
                            <input type="text" name="zip" placeholder="ZIP Code" value={bookingDetails.address.zip} onChange={handleAddressChange} required className="w-full p-2 border rounded-md"/>
                        </div>
                        {error && <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">{error}</p>}
                        <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400">{loading ? 'Processing...' : `Confirm Booking (Pay on Service)`}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
