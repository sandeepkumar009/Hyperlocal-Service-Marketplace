import { Review } from "../models/Review.model.js";

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate({
                path: "booking",
                select: "bookingTime"
            })
            .populate({
                path: "user",
                select: "name email"
            })
            .populate({
                path: "provider",
                select: "name"
            });
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getReviewById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const review = await Review.findById(id)
            .populate({
                path: "booking",
                select: "bookingTime"
            })
            .populate({
                path: "user",
                select: "name email"
            })
            .populate({
                path: "provider",
                select: "name"
            });
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        
        if (req.user.role === "user" && review.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to view this review" });
        }
        if (req.user.role === "provider" && review.provider._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to view this review" });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllProviderReviewsById = async (req, res) => {
    const { providerId } = req.params;

    try {
        const reviews = await Review.find({ provider: providerId })
            .populate({
                path: "booking",
                select: "bookingTime"
            })
            .populate({
                path: "user",
                select: "name"
            });
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this provider" });
        }
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllUserReviews = async (req, res) => {
    const { userId } = req.params;

    try {
        const reviews = await Review.find({ user: userId })
            .populate({
                path: "user",
                select: "name"
            })
            .populate({
                path: "provider",
                select: "name"
            })
            .populate({
                path: "booking",
                select: "bookingTime",
                populate: {
                    path: "service",
                    select: "name"
                }
            });
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this user" });
        }
        if( req.user.role === "user" && userId !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to view these reviews" });
        }
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
