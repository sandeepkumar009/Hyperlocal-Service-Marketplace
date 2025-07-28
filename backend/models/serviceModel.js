import mongoose from 'mongoose';

const serviceSchema = mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    priceType: {           // example: 'fixed', 'per_hour', 'starting_at'
        type: String,
        default: 'starting_at',
    },
    image: {
        type: String,
        required: true,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
