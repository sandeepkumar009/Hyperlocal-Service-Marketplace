import Category from '../models/categoryModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const category = new Category({
        name,
        description,
        image: req.file ? `/${req.file.path.replace(/\\/g, "/")}` : '/uploads/categoryPictures/default.png',
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
        category.name = name || category.name;
        category.description = description || category.description;
        if (req.file) {
            category.image = `/${req.file.path.replace(/\\/g, "/")}`;
        }

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        await category.deleteOne(); 
        res.json({ message: 'Category removed' });
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});


export { createCategory, getCategories, updateCategory, deleteCategory };
