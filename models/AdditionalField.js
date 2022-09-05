import mongoose from "mongoose";
import AdditionalValue from "./AdditionalValue.js";

const AdditionalFieldSchema = new mongoose.Schema({
    inputType: {type: String, required: true},
    inputName: {type: String, required: true},
    collectionId: {type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true}
})

export default mongoose.model('AdditionalField', AdditionalFieldSchema)