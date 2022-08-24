import jwt from 'jsonwebtoken'
import User from "../models/User.js";

export const checkAuth = async(req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.userId = decoded.id
            const user = await User.findById(decoded.id)
            req.isAdmin = user.isAdmin
            req.isBanned = user.isBanned
            next()
        } catch (e) {
            return res.status(403).json({message: 'Forbidden.'})
        }
    }
    else{
        return res.status(403).json({message: 'Forbidden.'})
    }
}