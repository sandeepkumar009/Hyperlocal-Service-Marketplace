import Booking from '../models/bookingModel.js';
import Service from '../models/serviceModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const addBookingItems = asyncHandler(async (req, res) => {
    const { serviceId, bookingDate, timeSlot, address, amount } = req.body;

    if (!serviceId) { res.status(400); throw new Error('No service ID provided'); }
    if (!address || !address.street || !address.city || !address.state || !address.zip) { res.status(400); throw new Error('Complete address is required'); }

    const service = await Service.findById(serviceId);
    if (!service) { res.status(404); throw new Error('Service not found'); }

    const booking = new Booking({
        user: req.user._id,
        service: serviceId,
        provider: service.provider,
        bookingDate,
        timeSlot,
        address,
        amount,
        paymentMethod: 'PayOnService',
        isPaid: false
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
});

// @desc    Get bookings for a logged in user
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
                                  .sort({ createdAt: -1 })
                                  .populate('service', 'name image price')
                                  .populate('provider', 'name companyName profilePicture')
                                  .populate('user', 'name email')
                                  .populate('review');

    res.json(bookings);
});

// @desc    Get bookings for a provider
// @route   GET /api/bookings/provider
// @access  Private/Provider
const getProviderBookings = asyncHandler(async (req, res) => {
     const bookings = await Booking.find({ provider: req.user._id })
                                   .sort({ createdAt: -1 })
                                   .populate('service', 'name image')
                                   .populate('user', 'name email');
    res.json(bookings);
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Provider
const updateBookingStatus = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    const { status } = req.body;

    if (booking) {
        if (booking.provider.toString() !== req.user._id.toString()) {
            res.status(403); throw new Error('Not authorized to update this booking');
        }
        booking.status = status;

        if (status === 'Completed' && booking.paymentMethod === 'PayOnService') {
            booking.isPaid = true;
            booking.paidAt = Date.now();
        }

        const updatedBooking = await booking.save();
        res.json(updatedBooking);
    } else {
        res.status(404); throw new Error('Booking not found');
    }
});

// @desc    Get provider earnings and stats
// @route   GET /api/bookings/provider/stats
// @access  Private/Provider
const getProviderStats = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ provider: req.user._id });

    const totalBookings = bookings.length;
    
    const totalEarnings = bookings.reduce((acc, booking) => {
        if (booking.status === 'Completed' && booking.isPaid) {
            return acc + booking.amount;
        }
        return acc;
    }, 0);

    res.json({
        totalBookings,
        totalEarnings,
    });
});

export { addBookingItems, getMyBookings, getProviderBookings, getProviderStats, updateBookingStatus };

