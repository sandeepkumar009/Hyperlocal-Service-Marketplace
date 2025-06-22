import express from 'express'
import { getAllUsers, getUserBookingHistory, getUserById, getUserProfile } from '../controllers/user.controller.js'
import { authenticate, Authorize } from '../middleware/auth.middleware.js'

const router = express.Router();

router.get('/profile', authenticate, Authorize("user"), getUserProfile);
router.get('/get-all-users', authenticate, Authorize("admin"), getAllUsers);
router.get('/get-user-by-id/:id', authenticate, Authorize("admin"), getUserById);
router.get('/booking-history', authenticate, Authorize("user"), getUserBookingHistory);

export default router;
