import Collection from "../models/Collection.js";
import User from "../models/User.js";
import path, {dirname} from 'path'
import {fileURLToPath} from 'url'
import {unlink} from 'node:fs'
import AdditionalField from "../models/AdditionalField.js";
import Item from "../models/Item.js";
import AdditionalValue from "../models/AdditionalValue.js";
import {DeletePicture, uploadPicture} from "./amazon-s3/amazon-s3.js";


export const createCollection = async (req, res) => {
    try {
        if (req.isBanned) return res.json({message: 'Пользователь заблокирован'})
        const {title, theme, description, additionalFields} = req.body
        const user = await User.findById(req.userId)
        let fileName = ''

        if (req.files) {
            fileName = await uploadPicture(req.files.image)
        }

        const newCollection = new Collection({
            username: user.username,
            title,
            description,
            theme,
            imgUrl: fileName,
            author: req.userId,
        })

        let addFieldsIds = []

        const addFields = JSON.parse(additionalFields)
        addFields["customFields"].map(async ({inputType, inputName}) => {
            const newCustomField = new AdditionalField({
                inputType,
                inputName,
                collectionId: newCollection._id
            })
            addFieldsIds.push(newCustomField._id)
            await newCustomField.save()
        })
        newCollection.additionalFields = addFieldsIds
        await newCollection.save()
        await User.update({"_id": req.userId}, {
            $push: {collections: newCollection}
        })
        res.json(newCollection)
    } catch (e) {
        res.json({message: "Server error"})
    }
}

export const getAllCollections = async (req, res) => {
    try {
        const collections = await Collection.find().sort('-createdAt')
        if (!collections) return res.json({message: "No collections"})
        const fiveBiggestCollection = await Collection.aggregate(
            [
                {
                    "$project": {
                        "_id": 1,
                        "username": 1,
                        "title": 1,
                        "description": 1,
                        "theme": 1,
                        "imgUrl": 1,
                        "author": 1,
                        "items": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "length": {"$size": "$items"}
                    }
                },
                {"$sort": {"length": -1}},
                {"$limit": 5}
            ]
        )
        res.json({collections, fiveBiggestCollection})

    } catch (e) {
        res.json({message: "Server error"})
    }
}

export const getMyCollections = async (req, res) => {
    try {
        const list = await Collection.find({'author': req.userId}).sort('-createdAt')
        res.json({list})

    } catch (e) {
        res.json({message: "Server error"})
    }
}

export const getCollectionById = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id)
        res.json(collection)
    } catch (e) {
        res.json({message: "Server error"})
    }
}

export const deleteCollectionById = async (req, res) => {
    try {
        const collection = await Collection.findByIdAndDelete(req.params.id)
        if (!collection) return res.json({message: "There is no collection with that id"})
        //if (collection.imgUrl) await DeletePicture(collection.imgUrl)
        await User.updateOne({"_id": collection.author}, {
            $pullAll: {
                collections: [{_id: req.params.id}],
            },
        })
        await Item.deleteMany({collectionId: req.params.id})
        const AddFields = await AdditionalField.find({collectionId: req.params.id})
        const AddFieldsIds = AddFields.map(({_id}) => _id)
        await AdditionalField.deleteMany({collectionId: req.params.id})
        await AdditionalValue.deleteMany({additionalFieldId: {"$in": AddFieldsIds}})
        res.json({message: "Collection was deleted.", _id: req.params.id})
    } catch (e) {
        res.json({message: "Server error"})
    }
}

export const updateCollectionById = async (req, res) => {
    try {
        const {title, description, theme, id, additionalFields} = req.body
        const collection = await Collection.findById(id)
        const addFields = JSON.parse(additionalFields)["customFields"]
        let addFieldsIds = []

        const CurrentAddFieldsID = collection.additionalFields
        const CurrentAddFields = await AdditionalField.find({collectionId: collection._id})
        const CurrentAddFieldsObjects = CurrentAddFields.map(({inputType, inputName}) => ({inputType: inputType, inputName: inputName}))

        addFields.map(async ({inputType, inputName}) => {
            let includes = false
            for (let i = 0; i < CurrentAddFieldsObjects.length; i++) {
                includes = CurrentAddFieldsObjects[i]["inputType"] ===  inputType && CurrentAddFieldsObjects[i]["inputName"] === inputName
                if(includes) break
            }

            if (!includes) {
                const newCustomField = new AdditionalField({
                    inputType,
                    inputName,
                    collectionId: collection._id
                })
                addFieldsIds.push(newCustomField._id)
                await newCustomField.save()
            }
        })

        for(let i = 0; i<CurrentAddFieldsObjects.length; i++){
            let includes = false
            for(let j = 0; j<addFields.length; j++) {
                includes = addFields[j]["inputType"] === CurrentAddFieldsObjects[i]["inputType"] && addFields[j]["inputName"] === CurrentAddFieldsObjects[i]["inputName"]
                if(includes) break
            }
            if(!includes){
                const deletedField = await AdditionalField.findOneAndDelete({collectionId: collection._id, inputType: CurrentAddFieldsObjects[i]["inputType"],inputName: CurrentAddFieldsObjects[i]["inputName"]})
                await AdditionalValue.deleteMany({additionalFieldId: deletedField._id})
                CurrentAddFieldsID.splice(CurrentAddFieldsID.indexOf(deletedField._id), 1)
            }
        }
        collection.additionalFields = [...CurrentAddFieldsID, ...addFieldsIds]

        if (req.files) {
            //if(collection.imgUrl) await DeletePicture(collection.imgUrl.slice(collection.imgUrl.lastIndexOf('/') + 1))
            let fileName = await uploadPicture(req.files.image)
            collection.imgUrl = fileName || ''
        }
        collection.title = title
        collection.description = description
        collection.theme = theme
        await collection.save()
        res.json(collection)
    } catch (e) {
        res.json({message: "Server error"})
    }
}