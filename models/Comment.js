import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    username: {type: String},
    text: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    itemId: {type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true},
    },
    {timestamps: true}
)

export default mongoose.model('Comment', CommentSchema)