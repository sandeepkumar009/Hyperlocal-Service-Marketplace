import express from 'express';
import { getAllBookingsDetails, getAllProviderBookings, getALLUserBookings, getBookingByStatus, getBookingDetailsById } from '../controllers/booking.controller.js';
import { authenticate, Authorize } from '../middleware/auth.middleware.js';
import { statusValidation } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/', authenticate, Authorize("admin"), getAllBookingsDetails);
router.get('/byId/:id', authenticate, Authorize("user", "provider", "admin"), getBookingDetailsById);
router.get('/byUserId/:id', authenticate, Authorize("user"), getALLUserBookings);
router.get('/byProviderId/:id', authenticate, Authorize("provider"), getAllProviderBookings);
router.get('/byStatus/:status', authenticate, Authorize("admin"), statusValidation, getBookingByStatus);

export default router;
