import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';
import Category from './models/categoryModel.js';
import Service from './models/serviceModel.js';
import Review from './models/reviewModel.js';
import Booking from './models/bookingModel.js';
import Payment from './models/paymentModel.js';
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

// --- START: Greatly Expanded and Realistic Data ---

const categories = [
    { name: 'Cleaning & Pest Control', image: '/uploads/categoryPictures/cat-cleaning.png', description: 'Professional cleaning and pest management services.' },
    { name: 'Appliance Repair', image: '/uploads/categoryPictures/cat-appliances.png', description: 'Repair services for all your home appliances.' },
    { name: 'Plumbers & Carpenters', image: '/uploads/categoryPictures/cat-tools.png', description: 'Expert plumbers and carpenters for any repair or installation.' },
    { name: 'Salon & Spa', image: '/uploads/categoryPictures/cat-salon.png', description: 'Beauty and wellness services at your doorstep.' },
    { name: 'Painters & Decorators', image: '/uploads/categoryPictures/cat-painting.png', description: 'Transform your home with our painting and decorating services.' },
    { name: 'Home Renovation', image: '/uploads/categoryPictures/cat-renovation.png', description: 'Complete home renovation and remodeling solutions.' },
    { name: 'IT & Tech Support', image: '/uploads/categoryPictures/cat-tech.png', description: 'On-site and remote tech support for all your devices.' },
    { name: 'Movers & Packers', image: '/uploads/categoryPictures/cat-moving.png', description: 'Reliable and efficient moving services.' },
    { name: 'Health & Wellness', image: '/uploads/categoryPictures/cat-health.png', description: 'Healthcare services like physiotherapy and diet consultation at home.' },
    { name: 'Event Management', image: '/uploads/categoryPictures/cat-events.png', description: 'Professional planning for parties, weddings, and corporate events.' },
    { name: 'Tutoring & Education', image: '/uploads/categoryPictures/cat-education.png', description: 'Personalized tutoring for all subjects and skills.' },
    { name: 'Fitness & Yoga', image: '/uploads/categoryPictures/cat-fitness.png', description: 'Certified personal trainers and yoga instructors at home.' },
    { name: 'Automotive Services', image: '/uploads/categoryPictures/cat-auto.png', description: 'Car and bike servicing at your doorstep.' },
    { name: 'Pet Care', image: '/uploads/categoryPictures/cat-pets.png', description: 'Professional pet grooming and dog walking services.' },
    { name: 'Legal Services', image: '/uploads/categoryPictures/cat-legal.png', description: 'Access to verified legal professionals for consultation and documentation.' },
];

const usersData = [
    // Admins
    { name: 'Admin User', email: 'admin@example.com', password: '123456', role: 'admin', isApproved: true, profilePicture: '/uploads/profilePictures/male.png', phoneNumber: '9876543210', gender: 'Male', dateOfBirth: '1990-01-01', address: { street: '1 Admin Way', city: 'Adminville', state: 'State', zip: '10001' } },
    // Users and Providers
    ...Array.from({ length: 150 }, (_, i) => {
        const isProvider = i < 30;
        const gender = i % 2 === 0 ? 'Female' : 'Male';
        const profilePicture = `/uploads/profilePictures/${gender.toLowerCase()}.png`;
        return {
            name: `${isProvider ? 'Provider' : 'User'} ${i + 1}`,
            email: `${isProvider ? 'provider' : 'user'}${i + 1}@example.com`,
            password: '123456',
            role: isProvider ? 'provider' : 'user',
            companyName: isProvider ? `ProServe Solutions ${i + 1}` : undefined,
            availability: isProvider ? 'Mon-Sat, 10am-7pm' : undefined,
            isApproved: isProvider ? (i % 5 !== 0) : undefined,
            profilePicture: profilePicture,
            phoneNumber: `98700000${i.toString().padStart(3, '0')}`,
            gender: gender,
            dateOfBirth: `${1980 + (i % 20)}-${(i % 12) + 1}-${(i % 28) + 1}`,
            address: { street: `${i + 1} Main St`, city: 'Anytown', state: 'State', zip: `${10001 + i}` }
        };
    })
];

// THE FIX: Create a map of images for each category
const serviceImageMap = {
    'Cleaning & Pest Control': ['/uploads/servicePictures/service-cleaning-1.png', '/uploads/servicePictures/service-cleaning-2.png'],
    'Appliance Repair': ['/uploads/servicePictures/service-repair-1.png', '/uploads/servicePictures/service-repair-2.png'],
    'Plumbers & Carpenters': ['/uploads/servicePictures/service-plumbing-1.png', '/uploads/servicePictures/service-tools-1.png'],
    'Salon & Spa': ['/uploads/servicePictures/service-salon-1.png', '/uploads/servicePictures/service-salon-2.png'],
    'Painters & Decorators': ['/uploads/servicePictures/service-painting-1.png', '/uploads/servicePictures/service-painting-2.png'],
    'Home Renovation': ['/uploads/servicePictures/service-renovation-1.png', '/uploads/servicePictures/service-renovation-2.png'],
    'IT & Tech Support': ['/uploads/servicePictures/service-tech-1.png'],
    'Movers & Packers': ['/uploads/servicePictures/service-moving-1.png'],
    'Health & Wellness': ['/uploads/servicePictures/service-health-1.png'],
    'Event Management': ['/uploads/servicePictures/service-events-1.png'],
    'Tutoring & Education': ['/uploads/servicePictures/service-education-1.png'],
    'Fitness & Yoga': ['/uploads/servicePictures/service-fitness-1.png'],
    'Automotive Services': ['/uploads/servicePictures/service-auto-1.png'],
    'Pet Care': ['/uploads/servicePictures/service-pets-1.png'],
    'Legal Services': ['/uploads/servicePictures/service-legal-1.png'],
};

const sampleServices = [
    ...Array.from({ length: 100 }, (_, i) => {
        const baseServices = [
            { name: 'Deep House Cleaning', price: 1200, cat: 'Cleaning & Pest Control', desc: 'Comprehensive top-to-bottom cleaning.' },
            { name: 'AC Service & Repair', price: 800, cat: 'Appliance Repair', desc: 'Professional service for all AC brands.' },
            { name: 'Leaky Pipe Repair', price: 650, cat: 'Plumbers & Carpenters', desc: 'Quick and efficient repair of leaky pipes.' },
            { name: 'Manicure & Pedicure Combo', price: 550, cat: 'Salon & Spa', desc: 'Relaxing mani-pedi.' },
            { name: 'Full Home Painting (Interior)', price: 4500, cat: 'Painters & Decorators', desc: 'Quality painting for a fresh new look.' },
            { name: 'Kitchen Remodeling', price: 25000, cat: 'Home Renovation', desc: 'Complete kitchen renovation from scratch.' },
            { name: 'Laptop Repair', price: 900, cat: 'IT & Tech Support', desc: 'Hardware and software repair for all laptop brands.' },
            { name: 'Local House Shifting', price: 3000, cat: 'Movers & Packers', desc: 'Efficient and safe shifting within the city.' },
            { name: 'Physiotherapy Session', price: 700, cat: 'Health & Wellness', desc: 'In-home physiotherapy sessions.' },
            { name: 'Birthday Party Planning', price: 5000, cat: 'Event Management', desc: 'Complete planning for birthday parties.' },
            { name: 'Math Tutor for K-12', price: 350, cat: 'Tutoring & Education', desc: 'Personalized math tutoring for school students.' },
            { name: 'Personal Fitness Trainer', price: 500, cat: 'Fitness & Yoga', desc: 'One-on-one fitness training sessions at home.' },
            { name: 'Car Wash & Detailing', price: 400, cat: 'Automotive Services', desc: 'Interior and exterior car cleaning and detailing.' },
            { name: 'Pet Grooming', price: 550, cat: 'Pet Care', desc: 'Complete grooming services for your furry friends.' },
            { name: 'Notary & Document Service', price: 1000, cat: 'Legal Services', desc: 'Get documents notarized at your home.' },
        ];
        const service = baseServices[i % baseServices.length];
        // THE FIX: Select an image from the correct category's image pool
        const imagePool = serviceImageMap[service.cat] || ['/uploads/servicePictures/default-services.png'];
        return {
            ...service,
            name: `${service.name} #${Math.floor(i / baseServices.length) + 1}`,
            img: imagePool[i % imagePool.length] // Cycle through the correct category's image pool
        };
    })
];


const importData = async () => {
    try {
        console.log('--- Clearing Existing Data ---');
        await Review.deleteMany();
        await Payment.deleteMany();
        await Booking.deleteMany();
        await Service.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        console.log('--- Hashing Passwords ---');
        const salt = await bcrypt.genSalt(10);
        const users = await Promise.all(usersData.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, salt);
            return { ...user, password: hashedPassword };
        }));

        console.log('--- Importing Users & Categories ---');
        const createdUsers = await User.insertMany(users);
        const createdCategories = await Category.insertMany(categories);

        const providers = createdUsers.filter(u => u.role === 'provider' && u.isApproved);
        const regularUsers = createdUsers.filter(u => u.role === 'user');

        console.log('--- Importing Services ---');
        const servicesToCreate = sampleServices.map((service, index) => ({
            name: service.name,
            price: service.price,
            description: service.desc,
            image: service.img,
            provider: providers[index % providers.length]._id,
            category: createdCategories.find(c => c.name === service.cat)._id,
        }));
        const createdServices = await Service.insertMany(servicesToCreate);

        let allBookings = [];
        console.log('--- Generating a Large Number of Bookings, Payments, and Reviews ---');

        for (let i = 0; i < regularUsers.length; i++) {
            const user = regularUsers[i];
            const numBookings = Math.floor(Math.random() * 6) + 3;

            for (let j = 0; j < numBookings; j++) {
                const randomService = createdServices[Math.floor(Math.random() * createdServices.length)];
                const bookingStatus = ['Completed', 'Scheduled', 'Cancelled'][Math.floor(Math.random() * 3)];
                const isPaid = bookingStatus === 'Completed';

                const booking = {
                    user: user._id,
                    service: randomService._id,
                    provider: randomService.provider,
                    bookingDate: new Date(Date.now() - (Math.random() * 180 * 24 * 60 * 60 * 1000)),
                    timeSlot: ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'][j % 4],
                    address: user.address,
                    amount: randomService.price,
                    status: bookingStatus,
                    paymentMethod: 'PayOnService',
                    isPaid: isPaid,
                    paidAt: isPaid ? new Date() : null,
                    paymentId: isPaid ? `pi_pos_${Math.random().toString(36).substr(2, 9)}` : null,
                };
                allBookings.push(booking);
            }
        }

        const createdBookings = await Booking.insertMany(allBookings);

        const paidBookings = createdBookings.filter(b => b.isPaid);
        const paymentsToCreate = paidBookings.map(booking => ({
            razorpay_payment_id: booking.paymentId,
            razorpay_order_id: `order_pos_${Math.random().toString(36).substr(2, 9)}`,
            razorpay_signature: `sig_pos_${Math.random().toString(36).substr(2, 16)}`,
            user: booking.user,
            booking: booking._id,
            amount: booking.amount,
            status: 'Success'
        }));
        await Payment.insertMany(paymentsToCreate);

        const reviewComments = ['Excellent and professional service. Highly recommended!', 'Good work, but could have been a bit faster.', 'Absolutely fantastic! Will book again for sure.', 'The provider was very courteous and skilled.', 'A job well done. Very satisfied with the result.', 'Decent service, met my expectations.', 'Could be better, the cleanup was not perfect.'];
        const completedBookings = createdBookings.filter(b => b.status === 'Completed');
        const reviewsToCreate = completedBookings.map((booking, index) => ({
            user: booking.user,
            service: booking.service,
            booking: booking._id,
            rating: Math.floor(Math.random() * 3) + 3,
            comment: reviewComments[index % reviewComments.length],
        }));
        await Review.insertMany(reviewsToCreate);

        console.log('--- Updating Service Ratings ---');
        for (const service of createdServices) {
            const reviews = await Review.find({ service: service._id });
            if (reviews.length > 0) {
                const averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
                await Service.findByIdAndUpdate(service._id, {
                    averageRating: averageRating.toFixed(1),
                    numReviews: reviews.length,
                });
            }
        }

        console.log('------------------------------------');
        console.log(`Users Imported: ${createdUsers.length}`);
        console.log(`Categories Imported: ${createdCategories.length}`);
        console.log(`Services Imported: ${createdServices.length}`);
        console.log(`Bookings Imported: ${createdBookings.length}`);
        console.log(`Payments Imported: ${paymentsToCreate.length}`);
        console.log(`Reviews Imported: ${reviewsToCreate.length}`);
        console.log('--- Data Imported Successfully! ---');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Review.deleteMany();
        await Payment.deleteMany();
        await Booking.deleteMany();
        await Service.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
