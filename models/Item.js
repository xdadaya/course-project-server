import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
        collectionName: {type: String, required: true},
        title: {type: String, required: true},
        collectionId: {type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true},
        tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
        likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
    },
    {timestamps: true}
)

export default mongoose.model('Item', ItemSchema)