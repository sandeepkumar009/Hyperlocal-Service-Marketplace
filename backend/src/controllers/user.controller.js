import { User } from "../models/User.model.js";
import { Booking } from "../models/Booking.model.js";

export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password from the response
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users.', error: error.message });
    }
};

export const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user.', error: error.message });
    }
};

export const getUserBookingHistory = async (req, res) => {
    const userId = req.user.id;
    try {
        const bookings = await Booking.find({user: userId});
        if (!bookings) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking history.', error: error.message });
    }
};
