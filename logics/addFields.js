import AdditionalField from "../models/AdditionalField.js";
import Item from "../models/Item.js";
import AdditionalValue from "../models/AdditionalValue.js";

export const getAdditionalFieldsByCollectionId = async(req, res) => {
    try{
        const fields = await AdditionalField.find({collectionId: req.params.id})
        const fieldsArray = fields.map(({inputType, inputName}) => (
            {inputType: inputType, inputName: inputName}
        ))
        res.json(fieldsArray)
    } catch (e) {
        res.json({message: "Server error getting additional fields"})
    }
}

export const getAdditionalFieldsByItemId = async(req, res) => {
    try{
        const item = await Item.findById(req.params.id)
        const fields = await AdditionalField.find({collectionId: item.collectionId})
        const values = await AdditionalValue.find({itemId: req.params.id})
        const data = fields.map((field) => {
            const value = values.find(value => value.additionalFieldId.toString() === field._id.toString())
            const inputValue = value ? value.inputValue : ''
            return {_id: field._id, inputName: field.inputName, inputType: field.inputType, collectionId: field.collectionId, inputValue}
        })
        res.json(data)
    } catch (e) {
        res.json({message: "Server error getting additional fields by item id"})
    }
}

export const getAdditionalFieldsForCreatingItem = async(req, res) => {
    try{
        const fields = await AdditionalField.find({collectionId: req.params.id})
        res.json(fields)
    } catch (e) {
        res.json({message: "Server error getting additional fields"})
    }
}