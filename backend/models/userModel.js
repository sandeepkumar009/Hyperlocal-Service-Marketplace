import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'provider', 'admin'],
        default: 'user',
    },
    profilePicture: {
        type: String,
        default: '/uploads/profilePictures/default-avatar.png',
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    dateOfBirth: {
        type: Date,
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String },
    },

    // Provider-specific fields:
    companyName: {
        type: String,
    },
    servicesOffered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    availability: {
        type: String,
        default: 'Mon-Fri, 9am-5pm'
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
