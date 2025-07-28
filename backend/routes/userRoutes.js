import express from 'express';
const router = express.Router();
import {
    registerUser,
    authUser,
    getUserProfile,
    updateUserProfile,
    getUserReviews,
    getUsers,
    approveProvider,
    deleteUser, 
    getAdminStats
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

// Public routes
router.post('/register', upload.single('profilePicture'), registerUser);
router.post('/login', authUser);

// Private routes
router.route('/profile').get(protect, getUserProfile).put(protect, upload.single('profilePicture'), updateUserProfile);
router.get('/profile/reviews', protect, getUserReviews);

// Admin-only routes
router.get('/', protect, admin, getUsers);
router.put('/approve/:id', protect, admin, approveProvider);
router.delete('/:id', protect, admin, deleteUser); 
router.get('/admin/stats', protect, admin, getAdminStats);

export default router;
