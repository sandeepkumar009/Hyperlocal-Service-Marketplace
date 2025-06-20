import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { PORT, MONGODB_URL } from './src/config/config.js';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';

const app = express()

app.use(express.json())
app.use(cors())
app.use('/api', authRoutes)
app.use('/api/user', userRoutes)

mongoose.connect(MONGODB_URL)
.then(() => console.log('MongoDB connected.'))
.catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}.`); 
});
