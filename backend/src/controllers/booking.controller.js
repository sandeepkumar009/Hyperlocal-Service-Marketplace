import { Booking } from "../models/Booking.model.js";
import { Payment } from "../models/Payment.model.js";

export const getAllBookingsDetails = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate({
                path: "user",
                select: "name email phoneNumber"
            }).populate({
                path: "provider",
                select: "name averageRating",
                populate: {
                    path: "user",
                    select: "name"
                }
            }).populate({
                path: "service",
                select: "name price"
            }).populate({
                path: "payment",
                select: "amount paymentMethod paymentStatus transactionId"
            });
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

import mongoose from "mongoose";

export const getBookingDetailsById = async (req, res) => {
    const bookingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({ message: "Invalid booking ID format" });
    }

    try {
        const booking = await Booking.findById(bookingId)
            .populate({
                path: "user",
                select: "name email phoneNumber"
            })
            .populate({
                path: "provider",
                select: "name averageRating",
                populate: {
                    path: "user",
                    select: "name"
                }
            })
            .populate({
                path: "service",
                select: "name price"
            })
            .populate({
                path: "payment",
                select: "amount paymentMethod paymentStatus transactionId"
            });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (req.user.role === "user" && booking.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        else if (req.user.role === "provider" && booking.provider._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getALLUserBookings = async (req, res) => {
    const userId = req.user.id;

    try {
        const bookings = await Booking.find({ user: userId })
            .populate({
                path: "user",
                select: "name"
            })
            .populate({
                path: "provider",
                select: "name averageRating",
                populate: {
                    path: "user",
                    select: "name"
                }
            })
            .populate({
                path: "service",
                select: "name imageUrl"
            })
            .populate({
                path: "payment",
                select: "amount paymentStatus"
            });
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllProviderBookings = async (req, res) => {
    const providerId = req.params.id;

    try {
        const bookings = await Booking.find({ provider: providerId })
            .populate({
                path: "user",
                select: "name email phoneNumber"
            })
            .populate({
                path: "provider",
                select: "name"
            })
            .populate({
                path: "service",
                select: "name imageUrl"
            })
            .populate({
                path: "payment",
                select: "amount paymentStatus"
            });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getBookingByStatus = async (req, res) => {
    const { status } = req.params;
    
    try {
        const bookings = await Booking.find({ status })
            .populate({
                path: "user",
                select: "name email phoneNumber"
            }).populate({
                path: "provider",
                select: "name averageRating",
                populate: {
                    path: "user",
                    select: "name"
                }
            }).populate({
                path: "service",
                select: "name price"
            }).populate({
                path: "payment",
                select: "amount paymentMethod paymentStatus transactionId"
            });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
