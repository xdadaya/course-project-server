import AdditionalValue from "../models/AdditionalValue.js";
import AdditionalField from "../models/AdditionalField.js";

export const getAdditionalValuesByItemId = async(req, res) => {
    try{
        const addValues = await AdditionalValue.find({itemId: req.params.id})
        let values = []
        for(let i = 0; i<addValues.length; i++) {
            const name = await AdditionalField.findById(addValues[i].additionalFieldId)
            values.push({inputName: name.inputName, inputValue: addValues[i].inputValue})
        }
        res.json(values)
    } catch (e) {
        res.json({message: "Server error getting additional value"})
    }
}