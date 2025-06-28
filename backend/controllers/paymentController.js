import Razorpay from 'razorpay';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import Booking from '../models/bookingModel.js';
import Payment from '../models/paymentModel.js';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a razorpay order
// @route   POST /api/payment/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const { amount, bookingId } = req.body;

    const options = {
        amount: amount * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: `receipt_booking_${bookingId}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// @desc    Verify payment and update booking
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bookingId,
        amount
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Payment is authentic, now update DB
        const booking = await Booking.findById(bookingId);
        if (booking) {
            booking.isPaid = true;
            booking.paidAt = Date.now();
            booking.paymentId = razorpay_payment_id;
            await booking.save();
        }

        // Save payment details
        await Payment.create({
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            booking: bookingId,
            user: req.user._id,
            amount: amount,
        });
        
        res.json({ message: 'Payment successful and booking updated' });

    } else {
        res.status(400);
        throw new Error('Payment verification failed. Signature mismatch.');
    }
});


export { createOrder, verifyPayment };
