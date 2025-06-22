import { Payment } from "../models/Payment.model.js";
import { Booking } from "../models/Booking.model.js";
import mongoose, { mongo } from "mongoose";
import { populate } from "dotenv";

export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate({
                path: "booking",
                select: "bookingTime status",
            })
            .populate({
                path: "user",
                select: "name email phoneNumber"
            });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPaymentByPaymentId = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await Payment.findById(id)
            .populate({
                path: "booking",
                select: "bookingTime status"
            })
            .populate({
                path: "user",
                select: "name email phoneNumber"
            });
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        console.log(req.user.role, payment.user._id.toString(), req.user.id);
        if (req.user.role == "user" && payment.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPaymentsByBookingId = async (req, res) => {
    const { bookingId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: "Invalid booking ID" });
        }
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        const paymentId = booking.payment._id.toString();
        const payment = await Payment.findById(paymentId)
            .populate({
                path: "booking",
                select: "bookingTime",
                populate: {
                    path: "service",
                    select: "name"
                }
            })
            .populate({
                path: "user",
                select: "name"
            });
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        if (req.user.role === "user" && payment.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        if (req.user.role === "provider" && payment.booking.provider._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllUserPaymentsById = async (req, res) => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    if (userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
    }
    try {
        const payments = await Payment.find({ user: userId })
            .populate({
                path: "booking",
                select: "bookingTime status",
                populate: {
                    path: "service",
                    select: "name"
                },
                populate: {
                    path: 'provider',
                    select: 'user -_id',
                    populate: {
                        path: 'user',
                        select: 'name'
                    }
                }
            })
            .populate({
                path: "user",
                select: "name"
            });
        if (!payments || payments.length === 0) {
            return res.status(404).json({ message: "No payments found for this user" });
        }
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllPaymentsByStatus = async (req, res) => {
    const { status } = req.params;
    try {
        const payments = await Payment.find({ paymentStatus: status })
            .populate({
                path: "booking",
                select: "bookingTime status",
            })
            .populate({
                path: "user",
                select: "name email phoneNumber"
            });
        if (!payments || payments.length === 0) {
            return res.status(404).json({ message: "No payments found with this status" });
        }
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
