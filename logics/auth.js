import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try{
        const {username, password} = req.body
        const isUsed = await User.findOne({username})
        if (isUsed) return res.json({message: `Username [${username}] is taken`})
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, salt)
        const user = new User({username, password: hashPassword})
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        await user.save()
        res.json({user, token, message: `User [${username}] was created.`})
    }catch (e) {
        res.json({message: 'Internal server error.'})
    }
}

export const login = async (req, res) => {
    try{
        const {username, password} = req.body
        const user = await User.findOne({username})
        if (!user) return res.json({message: `User [${username}] was not found.`})
        if (user.isBanned) return res.json({message: `User [${username}] is banned.`})
        const isCorrectPassword = await bcrypt.compare(password, user.password)
        if(!isCorrectPassword) return res.json({message: "Wrong password"})
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        res.json({token, user, message: "Successful log in"})
    }catch (e) {
        res.json({message: 'Internal server error.'})
    }
}

export const getUser = async (req, res) => {
    try{
        const user = await User.findById(req.userId)
        if (!user) return res.json({message: `User was not found`})
        if (user.isBanned) return res.json({message: `User is banned`})
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        res.json({user, token})
    }catch (e) {
        res.json({message: 'Internal server error.'})
    }
}