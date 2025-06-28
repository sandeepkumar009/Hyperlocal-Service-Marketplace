import express from 'express';
const router = express.Router();
import {
    getServices,
    getFeaturedServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    createServiceReview,
} from '../controllers/serviceController.js';
import { protect, provider } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

// Public routes
router.get('/', getServices);
router.get('/featured', getFeaturedServices);

// Provider-only CRUD routes for services
router.route('/')
    .post(protect, provider, upload.single('servicePicture'), createService);

router.route('/:id')
    .get(getServiceById)
    .put(protect, provider, upload.single('servicePicture'), updateService)
    .delete(protect, provider, deleteService);

// Private route for reviews
router.post('/:id/reviews', protect, createServiceReview);

export default router;
