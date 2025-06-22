import express from 'express';
import { authenticate, Authorize } from '../middleware/auth.middleware.js';
import { getAllProviderReviewsById, getAllReviews, getAllUserReviews, getReviewById } from '../controllers/review.controller.js';


const router = express.Router();

router.get('/', authenticate, Authorize("admin"), getAllReviews);
router.get('/byId/:id', authenticate, Authorize("user", "provider", "admin"), getReviewById);
router.get('/providerReviewsById/:providerId', getAllProviderReviewsById);
router.get('/userReviewsById/:userId', authenticate, Authorize("user", "admin"), getAllUserReviews);

export default router;
