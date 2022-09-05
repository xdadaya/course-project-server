import mongoose from "mongoose";

const AdditionalValueSchema = new mongoose.Schema({
    inputValue: {type: String, required: true},
    itemId: {type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true},
    additionalFieldId: {type: mongoose.Schema.Types.ObjectId, ref: 'AdditionalField', required: true}
})

export default mongoose.model('AdditionalValue', AdditionalValueSchema)