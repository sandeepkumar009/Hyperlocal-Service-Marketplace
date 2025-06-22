import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Provider',
            required: true,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true,
        },
        bookingTime: {
            type: Date,
            required: true,
        },
        address: {
            street: String,
            city: String,
            state: String,
            zip: String,
        },
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'InProgress', 'Completed', 'Cancelled', 'Rescheduled'],
            default: 'Pending',
        },
        // paymentDetails object has been removed from here.
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment' // <-- Reference to the new Payment model
        }
    },
    { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
