import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    collections: [{type: mongoose.Schema.Types.ObjectId, ref: 'Collection'}],
    isAdmin: {type: Boolean, default: false},
    isBanned: {type: Boolean, default: false}
    },
    {timestamps: true}
)

export default mongoose.model('User', UserSchema)