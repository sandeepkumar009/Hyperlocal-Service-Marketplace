import User from '../models/userModel.js';
import Review from '../models/reviewModel.js';
import Service from '../models/serviceModel.js';
import Booking from '../models/bookingModel.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, phoneNumber } = req.body;

    if (!name || !email || !password || !role || !phoneNumber) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User with this email already exists');
    }
    
    const phoneExists = await User.findOne({ phoneNumber });
    if (phoneExists) {
        res.status(400);
        throw new Error('User with this phone number already exists');
    }

    const userData = {
        name,
        email,
        password,
        role,
        phoneNumber
    };

    if (req.file) {
        userData.profilePicture = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    const user = await User.create(userData);

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (user.role === 'provider' && !user.isApproved) {
            res.status(403); throw new Error('Your provider account is pending approval.');
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(401); throw new Error('Invalid email or password');
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            address: user.address,
            companyName: user.companyName,
            availability: user.availability,
        });
    } else {
        res.status(404); throw new Error('User not found');
    }
});


// @desc    Get reviews by user
// @route   GET /api/users/profile/reviews
// @access  Private
const getUserReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ user: req.user._id }).select('booking');
    if (reviews) {
        res.json(reviews);
    } else {
        res.status(404);
        throw new Error('No reviews found for this user.');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.gender = req.body.gender || user.gender;
        user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
        if (user.role === 'provider') {
            user.companyName = req.body.companyName || user.companyName;
            user.availability = req.body.availability || user.availability;
        }
        if(req.body.address) {
            user.address.street = req.body.address.street || user.address.street;
            user.address.city = req.body.address.city || user.address.city;
            user.address.state = req.body.address.state || user.address.state;
            user.address.zip = req.body.address.zip || user.address.zip;
        }
        if (req.file) {
            user.profilePicture = `/${req.file.path.replace(/\\/g, "/")}`;
        }
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profilePicture: updatedUser.profilePicture,
            phoneNumber: updatedUser.phoneNumber,
            gender: updatedUser.gender,
            dateOfBirth: updatedUser.dateOfBirth,
            address: updatedUser.address,
            companyName: updatedUser.companyName,
            availability: updatedUser.availability,
            token: generateToken(updatedUser._id, updatedUser.role),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// @desc    Get all users by role with pagination
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    
    const filter = {};
    if (req.query.role) {
        filter.role = req.query.role;
    } else {
        filter.role = { $ne: 'admin' };
    }

    const count = await User.countDocuments(filter);
    const users = await User.find(filter)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ users, page, pages: Math.ceil(count / pageSize), total: count });
});

const approveProvider = asyncHandler(async (req, res) => {
    const provider = await User.findById(req.params.id);
    if (provider && provider.role === 'provider') {
        provider.isApproved = true;
        const updatedProvider = await provider.save();
        res.json({ message: 'Provider approved successfully', provider: updatedProvider });
    } else {
        res.status(404); throw new Error('Provider not found');
    }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete an admin user');
        }
        await user.deleteOne();
        res.json({ message: 'User removed successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// @desc    Get platform-wide statistics for admin
// @route   GET /api/users/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalServices = await Service.countDocuments({});
    const totalBookings = await Booking.countDocuments({});

    const completedBookings = await Booking.find({ status: 'Completed', isPaid: true });
    const totalRevenue = completedBookings.reduce((acc, booking) => acc + booking.amount, 0);

    res.json({
        totalUsers,
        totalProviders,
        totalServices,
        totalBookings,
        totalRevenue
    });
});

export { registerUser, authUser, getUserProfile, getUserReviews, updateUserProfile, getUsers, approveProvider, getAdminStats, deleteUser };
