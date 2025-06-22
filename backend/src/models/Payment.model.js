import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ['Card', 'NetBanking', 'COD'],
            required: true,
        },
        transactionId: String,
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Success', 'Failed'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
