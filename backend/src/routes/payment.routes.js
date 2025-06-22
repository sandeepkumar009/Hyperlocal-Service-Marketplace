import express from 'express';
import { getAllPayments, getAllPaymentsByStatus, getAllUserPaymentsById, getPaymentByPaymentId, getPaymentsByBookingId } from '../controllers/payment.controller.js';
import { authenticate, Authorize } from '../middleware/auth.middleware.js';


const router = express.Router();

router.get('/', getAllPayments);
router.get('/byPaymentId/:id', authenticate, Authorize("user", "admin"), getPaymentByPaymentId);
router.get('/byBookingId/:bookingId', authenticate, Authorize("user", "provider", "admin"), getPaymentsByBookingId);
router.get('/byUserId/:id', authenticate, Authorize("user", "admin"), getAllUserPaymentsById);
router.get('/byStatus/:status', authenticate, Authorize("admin"), getAllPaymentsByStatus);

export default router;