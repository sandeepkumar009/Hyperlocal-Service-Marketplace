import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Service',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Booking',
        unique: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
    },
}, {
    timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
