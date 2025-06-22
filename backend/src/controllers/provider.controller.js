import { Provider } from "../models/Provider.model.js";
import { Service } from "../models/Service.model.js";
import { Review } from "../models/Review.model.js";
import { Booking } from "../models/Booking.model.js";

export const getAllProviders = async (req, res) => {
    try {
        const providers = await Provider.find()
            .populate({
                path: 'user',
                select: 'name location',
            })
            .populate({
                path: 'servicesOffered.service',
                select: 'name imageUrl'
            });

        if (!providers || providers.length === 0) {
            return res.status(404).json({ message: 'No providers found' });
        }
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching providers', error });
    }
};

export const getProviderById = async (req, res) => {
    const { id } = req.params;
    try {
        const provider = await Provider.findOne({ _id: id })
            .populate({
                path: 'user',
                select: 'name email phoneNumber location address',
            })
            .populate({
                path: 'servicesOffered.service',
                select: 'name imageUrl description',
                populate: {
                    path: 'category',
                    select: 'name',
                }
            });
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        res.status(200).json(provider);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching provider', error });
    }
};

export const getProviderByLocation = async (req, res) => {
    const { longitude, latitude, radius } = req.query;

    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const dist = parseFloat(radius) * 1000;

    if (isNaN(lon) || isNaN(lat) || isNaN(dist)) {
        return res.status(400).json({ message: 'Invalid coordinates or radius' });
    }

    try {
        const providers = await Provider.find({
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [lon, lat] },
                    $maxDistance: dist,
                },
            },
        });

        console.log("Found providers:", providers.length);

        if (!providers.length) {
            return res.status(404).json({ message: "No providers found near this location" });
        }

        // Populate only if providers found
        const fullProviders = await Provider.populate(providers, [
            { path: 'user', select: 'name location' },
            {
                path: 'servicesOffered.service',
                select: 'name imageUrl',
                populate: { path: 'category', select: 'name' },
            },
        ]);

        res.status(200).json(fullProviders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching providers by location', error: error.message });
    }
};



export const getProvidersByCategoryId = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const services = await Service.find({ category: categoryId }).select('_id');
        const serviceIds = services.map(s => s._id);

        const providers = await Provider.find({
            'servicesOffered.service': { $in: serviceIds }
        })
            .populate({
                path: 'user',
                select: 'name location',
            })
            .populate({
                path: 'servicesOffered.service',
                select: 'name imageUrl',
                populate: {
                    path: 'category',
                    select: 'name',
                }
            });
        if (!providers || providers.length === 0) {
            return res.status(404).json({ message: 'No providers found for this category' });
        }
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching providers by category', error });
    };
};

export const getProviderReviewsById = async (req, res) => {
    const { id } = req.params;

    try {
        const reviews = await Review.find({ provider: id })
            .populate({
                path: 'user',
                select: 'name',
            })
            .populate({
                path: 'booking',
                populate: {
                    path: 'service',
                    select: 'name',
                    populate: {
                        path: 'category',
                        select: 'name'
                    }
                }
            });
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this provider' });
        }
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching provider reviews', error });
    }
};

export const getProviderBookinkgHistory = async (req, res) => {
    const { id } = req.params;

    try {
        const bookings = await Booking.find({ provider: id })
            .populate({
                path: 'user',
                select: 'name',
            })
            .populate({
                path: 'service',
                select: 'name imageUrl',
                populate: {
                    path: 'category',
                    select: 'name',
                }
            });
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No booking history found for this provider' });
        }
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching provider booking history', error });
    };
};

