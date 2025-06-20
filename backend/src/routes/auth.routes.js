import express from 'express'
import { register, login } from '../controllers/auth.controller.js'
import { authenticate, Authorize } from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/register', register)
router.post('/login', login)

router.get('/user', authenticate, (req, res) => {
    res.json({message: `Welcome, authenticated ${req.user.role}: ${req.user.name}`})
});
router.get('/admin', authenticate, Authorize('admin') , (req, res) => {
    res.json({message: `Welcome, authenticated ${req.user.role}: ${req.user.name}`})
});
router.get('/provider', authenticate, Authorize('provider') , (req, res) => {
    res.json({message: `Welcome, authenticated ${req.user.role}: ${req.user.name}`})
});

export default router
