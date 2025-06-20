import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

export const  authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({message: 'Unauthorized'})

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(403).json({message: 'Invalid token'})
    }
}

export const Authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role))
            return res.status(403).json({message: 'Access denied: Insufficien role'})
        next()
    }
}
