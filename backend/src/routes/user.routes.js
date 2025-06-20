import express from 'express'
import { getUserProfile } from '../controllers/user.controller.js'
import { authenticate, Authorize } from '../middleware/auth.middleware.js'

const router = express.Router();

router.get('/profile', authenticate, Authorize("user"), getUserProfile);

export default router;
