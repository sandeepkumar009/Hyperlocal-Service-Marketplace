import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    service: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'Service' 
    },
    provider: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, ref: 'User' 
    },
    bookingDate: { 
        type: Date, 
        required: true 
    },
    timeSlot: { 
        type: String, 
        required: true 
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
    },
    amount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        required: true, 
        enum: ['Scheduled', 'Completed', 'Cancelled'], 
        default: 'Scheduled' 
    },
    
    paymentMethod: {           // example: 'PayOnService', 'OnlinePayment'
        type: String,
        required: true,
        default: 'PayOnService'
    },
    isPaid: { 
        type: Boolean, 
        required: true,
        default: false 
    },
    paidAt: { 
        type: Date 
    },
    paymentId: { 
        type: String 
    }, 

}, {
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
});

bookingSchema.virtual('review', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'booking',
    justOne: true
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
