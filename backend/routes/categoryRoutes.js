import express from 'express';
const router = express.Router();
import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

// Public route to get all categories
router.get('/', getCategories);

// Admin-only routes with image upload middleware
router.post('/', protect, admin, upload.single('categoryPicture'), createCategory);
router.put('/:id', protect, admin, upload.single('categoryPicture'), updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
