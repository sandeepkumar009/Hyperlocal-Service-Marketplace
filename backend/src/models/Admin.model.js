import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        permissions: [
            {
                type: String,
                enum: ['manage_users', 'manage_providers', 'manage_bookings', 'manage_services'],
            },
        ],
    },
    { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
