import express from 'express';
import { getAllProviders, getProviderBookinkgHistory, getProviderById, getProviderByLocation, getProviderReviewsById, getProvidersByCategoryId } from '../controllers/provider.controller.js';
import { authenticate, Authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllProviders);
router.get('/byId/:id', getProviderById);
router.get('/near-location', getProviderByLocation);
router.get('/by-category/:categoryId', getProvidersByCategoryId);
router.get('/reviews-by-id/:id', getProviderReviewsById);
router.get('/booking-history-by-id/:id', getProviderBookinkgHistory);

export default router;
