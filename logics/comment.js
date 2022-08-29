import Comment from "../models/Comment.js";
import Item from "../models/Item.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const getCommentsByItemId = async(req, res) => {
    try{
        const comments = await Comment.aggregate([
            {$match: {itemId: mongoose.Types.ObjectId(req.params.id)}},
        ])
        res.json(comments)
    } catch (e) {
        res.json({message: "Server error getting comments in item"})
    }
}

export const createCommentByItemId = async(req, res) => {
    try{
        const {text, id} = req.body
        const user = await User.findById(req.userId)
        const newComment = new Comment({
            username: user.username,
            text,
            author: req.userId,
            itemId: id
        })
        await Item.update({"_id": id}, {
            $push: {comments: newComment}
        })
        await newComment.save()
        res.json(newComment)
    } catch (e) {
        res.json({message: "Server error creating comment in item"})
    }
}