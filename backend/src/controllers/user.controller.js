import { User } from "../models/User.model.js";

export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
};
