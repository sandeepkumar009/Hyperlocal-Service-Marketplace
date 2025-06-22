import { Service } from "../models/Service.model.js";
import { Provider } from "../models/Provider.model.js";
import { User } from "../models/User.model.js";
import { Category } from "../models/Category.model.js";

export const getAllServices = async (req, res) => {
    try {
        const servicies = await Service.find();
        res.status(200).json(servicies);
    } catch (error) {
        throw new Error(`Error fetching services: ${error.message}`);
    }
};

export const getServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: `Error fetching service: ${error.message}` });
    }
};

export const getServicesByLocation = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;
        if (!latitude || !longitude || !radius) {
            return res.status(400).json({
                message: 'Missing required query parameters: latitude, longitude, and radius.'
            });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        const rad = parseFloat(radius); // Radius is expected in meters

        if (isNaN(lat) || isNaN(lon) || isNaN(rad) || rad <= 0) {
            return res.status(400).json({
                message: 'Invalid latitude, longitude, or radius. Please ensure they are numbers and radius is positive.'
            });
        }

        const services = await User.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [lon, lat]
                    },
                    maxDistance: rad,
                    spherical: true,
                    distanceField: "dist.calculated",
                    query: { role: 'provider' }
                }
            },
            {
                $lookup: {
                    from: 'providers',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'providerDetails'
                }
            },
            {
                $unwind: '$providerDetails'
            },
            {
                $unwind: '$providerDetails.servicesOffered'
            },
            {
                $lookup: {
                    from: 'services',
                    localField: 'providerDetails.servicesOffered.service',
                    foreignField: '_id',
                    as: 'serviceDetails'
                }
            },
            {
                $unwind: '$serviceDetails'
            },
            {
                $group: {
                    _id: '$serviceDetails._id',
                    name: { $first: '$serviceDetails.name' },
                    description: { $first: '$serviceDetails.description' },
                    category: { $first: '$serviceDetails.category' },
                    imageUrl: { $first: '$serviceDetails.imageUrl' },
                    isActive: { $first: '$serviceDetails.isActive' },
                    createdAt: { $first: '$serviceDetails.createdAt' },
                    updatedAt: { $first: '$serviceDetails.updatedAt' },
                }
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    name: 1,
                    description: 1,
                    category: 1,
                    imageUrl: 1,
                    isActive: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            }
        ]);

        if (services.length > 0) {
            res.status(200).json({
                message: 'Services found in the specified location.',
                count: services.length,
                services: services
            });
        } else {
            res.status(404).json({
                message: 'No services found from providers in the specified location.',
                services: []
            });
        }

    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while fetching services by location.',
            error: error.message
        });
    }
};

export const getServiceByCategory = async (req, res) => {
    const { category } = req.params;
    console.log(`Fetching services for category: ${category}`);
    try {
        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            return res.status(404).json({ message: "Category not found" });
        }
        const services = await Service.find({ category: categoryDoc._id });

        if (services.length === 0) {
            return res.status(404).json({ message: "No services found in this category" });
        }
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: `Error fetching services by category: ${error.message}` });
    }
};
