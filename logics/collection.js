import Collection from "../models/Collection.js";
import User from "../models/User.js";
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { unlink } from 'node:fs'

export const createCollection = async(req, res) =>{
    try{
        if(req.isBanned) res.json({message: 'Пользователь заблокирован'})
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
        const fiveBiggestCollection = await Collection.find().sort({ "itemsLength": -1 }).limit(5)
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
        unlink(`./uploads/${collection.imgUrl}`, (err) => {
            if (err) throw err;
        })
        if(!collection) res.json({message: "There is no collection with that id"})
        await User.findByIdAndUpdate(collection.author, {
            $pull: { posts: req.params.id },
        })
        res.json({message: "Collection was deleted."})
    } catch (e) {
        res.json({message: "Server error"})
    }
}

export const updateCollectionById = async(req, res) => {
    try{
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