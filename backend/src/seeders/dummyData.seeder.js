import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

import { MONGODB_URL } from '../config/config.js';
import { User } from '../models/User.model.js';
import { Category } from '../models/Category.model.js';
import { Service } from '../models/Service.model.js';
import { Provider } from '../models/Provider.model.js';
import { Payment } from '../models/Payment.model.js';
import { Booking } from '../models/Booking.model.js';
import { Review } from '../models/Review.model.js';
import { Admin } from '../models/Admin.model.js';

// --- Configuration ---
const MONGO_URI = MONGODB_URL; // <-- IMPORTANT: REPLACE WITH YOUR DB CONNECTION STRING
const NUM_USERS = 50;
const NUM_PROVIDERS = 15;
const NUM_ADMINS = 5;
const NUM_BOOKINGS = 200;

// Central point for locations (Agra, India)
const AGRA_COORDS = { lat: 27.1767, lng: 78.0081 };

// Helper to generate random coordinates around a central point
const getRandomCoordinates = () => {
    return [
        AGRA_COORDS.lng + (Math.random() - 0.5) * 0.1, // longitude
        AGRA_COORDS.lat + (Math.random() - 0.5) * 0.1,  // latitude
    ];
};

const seedDatabase = async () => {
    try {
        // --- 1. CONNECT TO MONGODB ---
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully.');

        // --- 2. CLEAR EXISTING DATA ---
        console.log('Clearing existing data...');
        const collections = Object.values(mongoose.connection.collections);
        for (const collection of collections) {
            await collection.deleteMany({});
        }
        console.log('All collections cleared.');

        // --- 3. GENERATE DUMMY DATA ---
        console.log('Generating dummy data...');

        // Hashing a common password for all dummy users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // A. Create Users (customers, providers, admins)
        const users = [];
        for (let i = 0; i < NUM_USERS + NUM_PROVIDERS + NUM_ADMINS; i++) {
            let role = 'user';
            if (i >= NUM_USERS && i < NUM_USERS + NUM_PROVIDERS) {
                role = 'provider';
            } else if (i >= NUM_USERS + NUM_PROVIDERS) {
                role = 'admin';
            }

            const coordinates = getRandomCoordinates();
            users.push({
                name: faker.person.fullName(),
                email: faker.internet.email({ provider: 'localmail.com' }).toLowerCase(),
                password: hashedPassword,
                phoneNumber: faker.phone.number(),
                role: role,
                location: {
                    type: 'Point',
                    coordinates: coordinates,
                },
                address: {
                    street: faker.location.streetAddress(),
                    city: 'Agra',
                    state: 'Uttar Pradesh',
                    zip: faker.location.zipCode('2820##'),
                },
            });
        }
        const createdUsers = await User.insertMany(users);
        console.log(`${createdUsers.length} users created.`);
        
        const customerUsers = createdUsers.filter(u => u.role === 'user');
        const providerUsers = createdUsers.filter(u => u.role === 'provider');
        const adminUsers = createdUsers.filter(u => u.role === 'admin');

        // B. Create Categories
        const categoriesData = [
            { name: 'Home Cleaning', description: 'Professional cleaning services for your home.', imageUrl: 'https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
            { name: 'Appliance Repair', description: 'Expert repair for all major home appliances.', imageUrl: 'https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
            { name: 'Plumbing', description: 'Reliable plumbing solutions for leaks, clogs, and installations.', imageUrl: 'https://images.pexels.com/photos/1330753/pexels-photo-1330753.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
            { name: 'Electrician', description: 'Certified electricians for wiring, fixtures, and safety checks.', imageUrl: 'https://images.pexels.com/photos/577210/pexels-photo-577210.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
            { name: 'Beauty & Salon', description: 'Salon services at home, from haircuts to facials.', imageUrl: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
        ];
        const createdCategories = await Category.insertMany(categoriesData);
        console.log(`${createdCategories.length} categories created.`);

        // C. Create Services
        let servicesData = [];
        createdCategories.forEach(category => {
            const serviceExamples = {
                'Home Cleaning': ['Deep Home Cleaning', 'Kitchen Cleaning', 'Bathroom Cleaning', 'Sofa Cleaning'],
                'Appliance Repair': ['Refrigerator Repair', 'Washing Machine Repair', 'AC Service & Repair', 'Microwave Repair'],
                'Plumbing': ['Fix Leakage', 'Unclog Drain', 'Tap Installation', 'Toilet Repair'],
                'Electrician': ['Fan Installation', 'Switchboard Repair', 'Fuse Replacement', 'Wiring Check'],
                'Beauty & Salon': ['Haircut & Styling', 'Manicure & Pedicure', 'Facial & Cleanup', 'Waxing'],
            };
            serviceExamples[category.name].forEach(serviceName => {
                servicesData.push({
                    name: serviceName,
                    description: faker.lorem.sentence(),
                    category: category._id,
                    imageUrl: faker.image.urlLoremFlickr({ category: 'services' }),
                });
            });
        });
        const createdServices = await Service.insertMany(servicesData);
        console.log(`${createdServices.length} services created.`);

        // D. Create Providers
        let providersData = [];
        providerUsers.forEach(providerUser => {
            const servicesOffered = [];
            const numServices = faker.number.int({ min: 1, max: 4 });
            const shuffledServices = faker.helpers.shuffle(createdServices);
            for(let i = 0; i < numServices; i++) {
                servicesOffered.push({
                    service: shuffledServices[i]._id,
                    price: faker.number.int({ min: 300, max: 5000 })
                });
            }

            providersData.push({
                user: providerUser._id,
                servicesOffered,
                availability: {
                    isAvailable: true,
                    schedule: [
                        { day: 'Monday', startTime: '09:00', endTime: '18:00' },
                        { day: 'Tuesday', startTime: '09:00', endTime: '18:00' },
                        { day: 'Wednesday', startTime: '09:00', endTime: '18:00' },
                        { day: 'Thursday', startTime: '09:00', endTime: '18:00' },
                        { day: 'Friday', startTime: '09:00', endTime: '18:00' },
                        { day: 'Saturday', startTime: '10:00', endTime: '16:00' },
                    ]
                },
                location: providerUser.location,
                isVerified: faker.datatype.boolean(0.8), // 80% are verified
            });
        });
        const createdProviders = await Provider.insertMany(providersData);
        console.log(`${createdProviders.length} providers created.`);

        // E. Create Bookings & Payments
        let bookingsData = [];
        let paymentsData = [];
        let reviewsData = [];

        for(let i=0; i < NUM_BOOKINGS; i++) {
            const customer = faker.helpers.arrayElement(customerUsers);
            const provider = faker.helpers.arrayElement(createdProviders);
            const serviceOffered = faker.helpers.arrayElement(provider.servicesOffered);
            const service = createdServices.find(s => s._id.equals(serviceOffered.service));
            const status = faker.helpers.arrayElement(['Pending', 'Accepted', 'InProgress', 'Completed', 'Completed', 'Completed', 'Cancelled']);

            const booking = {
                user: customer._id,
                provider: provider._id,
                service: service._id,
                bookingTime: faker.date.past({ years: 1 }),
                address: customer.address,
                status: status
            };
            
            // This structure creates bookings first, then payments/reviews referencing them
            bookingsData.push(booking);
        }

        const createdBookings = await Booking.insertMany(bookingsData);

        // Now create payments and reviews based on created bookings
        for (const booking of createdBookings) {
            const customer = createdUsers.find(u => u._id.equals(booking.user));
            const provider = createdProviders.find(p => p._id.equals(booking.provider));
            const serviceOffered = provider.servicesOffered.find(so => so.service.equals(booking.service));

             // Create Payment
            const payment = {
                booking: booking._id,
                user: customer._id,
                amount: serviceOffered.price,
                paymentMethod: faker.helpers.arrayElement(['Card', 'NetBanking', 'COD']),
                paymentStatus: booking.status === 'Cancelled' ? 'Failed' : faker.helpers.arrayElement(['Success', 'Success', 'Pending']),
                transactionId: faker.string.alphanumeric(12)
            };
            const createdPayment = await Payment.create(payment);

            // Link payment back to booking
            await Booking.findByIdAndUpdate(booking._id, { payment: createdPayment._id });

            // Create Review for completed bookings
            if (booking.status === 'Completed') {
                reviewsData.push({
                    booking: booking._id,
                    user: customer._id,
                    provider: provider._id,
                    rating: faker.number.int({ min: 3, max: 5 }),
                    comment: faker.lorem.paragraph()
                });
            }
        }
        
        await Review.insertMany(reviewsData);
        console.log(`${createdBookings.length} bookings, payments, and ${reviewsData.length} reviews created.`);

        // F. Create Admins
        const adminsData = adminUsers.map(adminUser => ({
            user: adminUser._id,
            permissions: ['manage_users', 'manage_providers', 'manage_bookings', 'manage_services']
        }));
        const createdAdmins = await Admin.insertMany(adminsData);
        console.log(`${createdAdmins.length} admins created.`);

        console.log('--- Seeding complete! ---');

    } catch (error) {
        console.error('An error occurred during seeding:', error);
    } finally {
        // --- 4. CLOSE CONNECTION ---
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
};

seedDatabase();
