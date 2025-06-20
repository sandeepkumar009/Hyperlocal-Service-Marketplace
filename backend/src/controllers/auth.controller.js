import { User } from "../models/User.model.js";

export const register = async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({message: 'User registered successfully.'});
};

export const login = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(404).json({message: 'User not found.'})
    if(!user.isPasswordCorrect(password)) return res.status(400).json({message: 'Invalid credentials.'})
    res.json({
        token: user.generateToken(),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};
