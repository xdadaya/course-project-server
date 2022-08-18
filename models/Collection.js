import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
    username: {type: String},
    title: {type: String, required: true},
    description: {type: String, required: true},
    theme: {type: String, required: true},
    imgUrl: {type: String, default:''},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    items: [{type: mongoose.Schema.Types.ObjectId, ref: 'CollectionItem'}],
    },
    {timestamps: true}
)

export default mongoose.model('Collection', CollectionSchema)