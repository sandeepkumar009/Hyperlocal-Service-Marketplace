import Service from '../models/serviceModel.js';
import Review from '../models/reviewModel.js';
import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';

// @desc    Fetch all services (with filtering and pagination)
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
    const pageSize = parseInt(req.query.limit) || 8;
    const page = parseInt(req.query.page) || 1;

    const keywordFilter = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
    const categoryFilter = req.query.category ? { category: req.query.category } : {};
    
    const providerFilter = req.query.provider ? { provider: req.query.provider } : {};

    const filters = { ...keywordFilter, ...categoryFilter, ...providerFilter };
    
    const count = await Service.countDocuments(filters);

    const services = await Service.find(filters)
        .populate('category', 'name')
        .populate('provider', 'name companyName')
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    let categoryName = 'All Categories';
    if (req.query.category) {
        const category = await Category.findById(req.query.category);
        if (category) categoryName = category.name;
    }

    res.json({
        services,
        page,
        pages: Math.ceil(count / pageSize),
        totalServices: count,
        categoryName,
    });
});

// @desc    Get top rated/featured services
// @route   GET /api/services/featured
// @access  Public
const getFeaturedServices = asyncHandler(async (req, res) => {
    const services = await Service.find({})
        .sort({ averageRating: -1, numReviews: -1 })
        .limit(4)
        .populate('category', 'name');
        
    res.json(services);
});


// @desc    Fetch single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id).populate('provider', 'name profilePicture companyName rating').populate('category', 'name');
    const reviews = await Review.find({service: req.params.id}).populate('user', 'name profilePicture');

    if (service) {
        res.json({service, reviews});
    } else {
        res.status(404);
        throw new Error('Service not found');
    }
});


// @desc    Create new review
// @route   POST /api/services/:id/reviews
// @access  Private
const createServiceReview = asyncHandler(async (req, res) => {
    const { rating, comment, bookingId } = req.body;
    const service = await Service.findById(req.params.id);

    if (service) {
        const alreadyReviewed = await Review.findOne({ booking: bookingId });

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('This booking has already been reviewed');
        }

        const review = new Review({
            rating: Number(rating),
            comment,
            service: req.params.id,
            user: req.user._id,
            booking: bookingId,
        });
        
        await review.save();

        const reviews = await Review.find({ service: req.params.id });
        service.numReviews = reviews.length;
        service.averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await service.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Service not found');
    }
});

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Provider
const createService = asyncHandler(async (req, res) => {
    const { name, price, category, description } = req.body;

    if (!name || !price || !category || !description) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const service = new Service({
        name,
        price,
        category,
        description,
        provider: req.user._id,
        image: req.file ? `/${req.file.path.replace(/\\/g, "/")}` : '/uploads/servicePictures/default-services.png',
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Provider
const updateService = asyncHandler(async (req, res) => {
    const { name, price, category, description } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error('Service not found');
    }

    if (service.provider.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this service');
    }

    service.name = name || service.name;
    service.price = price || service.price;
    service.category = category || service.category;
    service.description = description || service.description;

    if (req.file) {
        service.image = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    const updatedService = await service.save();
    res.json(updatedService);
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Provider or Private/Admin
const deleteService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error('Service not found');
    }

    if (service.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to delete this service');
    }

    await service.deleteOne();
    res.json({ message: 'Service removed' });
});

export { getServices, getFeaturedServices, getServiceById, createService, updateService, deleteService, createServiceReview };
