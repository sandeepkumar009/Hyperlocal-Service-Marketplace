import express from 'express';
const router = express.Router();
import {
    addBookingItems,
    getMyBookings,
    getProviderBookings,
    getProviderStats, 
    updateBookingStatus
} from '../controllers/bookingController.js';
import { protect, provider } from '../middleware/authMiddleware.js';

// User routes
router.post('/', protect, addBookingItems);
router.get('/mybookings', protect, getMyBookings);

// Provider routes
router.get('/provider', protect, provider, getProviderBookings);
router.get('/provider/stats', protect, provider, getProviderStats);
router.put('/:id/status', protect, provider, updateBookingStatus);

export default router;
