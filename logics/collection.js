import Collection from "../models/Collection.js";
import User from "../models/User.js";
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { unlink } from 'node:fs'

export const createCollection = async(req, res) =>{
    try{
        if(req.isBanned) return res.json({message: 'Пользователь заблокирован'})
        const {title, theme, description} = req.body
        const user = await User.findById(req.userId)
        let fileName = ''

        if(req.files) {
            fileName = Date.now().toString() + req.files.image.name
            const __dirname = dirname(fileURLToPath(import.meta.url))
            req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))
        }

        const newCollection = new Collection({
            username: user.username,
            title,
            description,
            theme,
            imgUrl: fileName,
            author: req.userId
        })
        await newCollection.save()
        await User.update({"_id": req.userId}, {
            $push: {collections: newCollection}
        })
        res.json(newCollection)
    } catch (e) {
        res.json({message: "Server error"})
    }
}

export const getAllCollections = async(req, res) => {
    try{
        const collections = await Collection.find().sort('-createdAt')
        if(!collections) return res.json({message: "No collections"})
        const fiveBiggestCollection = await Collection.aggregate(
            [
                { "$project": {
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
                        "length": { "$size": "$items" }
                    }},
                { "$sort": { "length": -1 } },
                { "$limit": 5 }
            ]
        )
        res.json({collections, fiveBiggestCollection})

    }catch (e) {
        res.json({message: "Server error"})
    }
}

export const getMyCollections = async(req, res) => {
    try{
        const list = await Collection.find({'author': req.userId}).sort('-createdAt')
        res.json({list})

    }catch (e) {
        res.json({message: "Server error"})
    }
}

export const getCollectionById = async(req, res) => {
    try{
        const collection = await Collection.findById(req.params.id)
        res.json(collection)
    } catch (e) {
        res.json({message: "Server error"})
    }
}

export const deleteCollectionById = async(req, res) => {
    try{
        const collection = await Collection.findByIdAndDelete(req.params.id)
        if(!collection) return res.json({message: "There is no collection with that id"})
        if(collection.imgUrl) {
            unlink(`./uploads/${collection.imgUrl}`, (err) => {
                if (err) console.log(err);
            })
        }
        await User.updateOne({"_id": collection.author}, {
            $pullAll: {
                collections: [{_id: req.params.id}],
            },
        })
        res.json({message: "Collection was deleted.", _id: req.params.id})
    } catch (e) {
        res.json({message: "Server error"})
    }
}

export const updateCollectionById = async(req, res) => {
    try{
        console.log(req.body)
        const {title, description, theme, id} = req.body
        const collection = await Collection.findById(id)

        if(req.files) {
            unlink(`./uploads/${collection.imgUrl}`, (err) => {
                if (err) throw err;
            })
            let fileName = Date.now().toString() + req.files.image.name
            const __dirname = dirname(fileURLToPath(import.meta.url))
            req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))
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