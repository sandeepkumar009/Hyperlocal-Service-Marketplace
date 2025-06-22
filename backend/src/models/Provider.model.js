import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        servicesOffered: [
            {
                service: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Service',
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        availability: {
            isAvailable: {
                type: Boolean,
                default: true,
            },
            schedule: [
                {
                    day: String, // e.g., "Monday"
                    startTime: String, // e.g., "09:00"
                    endTime: String, // e.g., "17:00"
                },
            ],
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                index: '2dsphere',
            },
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
    },
    { timestamps: true }
);

export const Provider = mongoose.model("Provider", providerSchema);
