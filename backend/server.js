import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { PORT, MONGODB_URL } from './src/config/config.js';

import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import serviceRoutes from './src/routes/service.routes.js';
import categoryRoutes from './src/routes/category.routes.js';
import providerRoutes from './src/routes/provider.routes.js';
import bookingRoutes from './src/routes/booking.routes.js';
import reviewRoutes from './src/routes/review.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';

const app = express()

app.use(express.json())
app.use(cors())
app.use('/api', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/providers', providerRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/payments', paymentRoutes)

mongoose.connect(MONGODB_URL)
.then(() => console.log('MongoDB connected.'))
.catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}.`); 
});
