import User from "../models/User.js";

export const getUsers = async(req, res) => {
    try{
        const users = await User.aggregate([
            {"$project" : {
                "username": 1,
                "isAdmin": 1,
                "isBanned": 1,
                "createdAt": 1,
                "_id": 0,
                "id": "$_id"
            }}
        ])
        return res.json({users})
    } catch (e) {
        console.log(e)
    }
}

export const blockUsers = async(req, res) => {
    try{
        const ids = req.body.ids
        await User.updateMany({"_id": {"$in": ids}}, {"isBanned": true})
        res.json({message: "User(-s) blocked"})
    } catch (e) {
        console.log(e)
    }
}

export const unblockUsers = async(req, res) => {
    try{
        const ids = req.body.ids
        await User.updateMany({"_id": {"$in": ids}}, {"isBanned": false})
        res.json({message: "User(-s) unblocked"})
    } catch (e) {
        console.log(e)
    }
}

export const setAdminRoleUsers = async(req, res) => {
    try{
        const ids = req.body.ids
        await User.updateMany({"_id": {"$in": ids}}, {"isAdmin": true})
        res.json({message: "User(-s) got Admin rights"})
    } catch (e) {
        console.log(e)
    }
}

export const removeAdminRoleUsers = async(req, res) => {
    try{
        const ids = req.body.ids
        await User.updateMany({"_id": {"$in": ids}}, {"isAdmin": false})
        res.json({message: "User(-s) lost Admin rights"})
    } catch (e) {
        console.log(e)
    }
}

export const deleteUsers = async(req, res) => {
    try{
        const ids = req.body.ids
        await User.deleteMany({"_id": {"$in": ids}})
        res.json({message: "User(-s) deleted"})
    } catch (e) {
        console.log(e)
    }
}