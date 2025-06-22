import { Router } from 'express';
import { getAllServices, getServiceByCategory, getServiceById, getServicesByLocation } from '../controllers/service.controller.js';

const router = Router();

router.get('/', getAllServices);
router.get('/byId/:id', getServiceById);
router.get('/near-me', getServicesByLocation );
router.get('/byCategory/:category', getServiceByCategory);

export default router;
