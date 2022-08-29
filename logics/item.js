import Item from '../models/Item.js'
import Collection from "../models/Collection.js";
import mongoose from "mongoose";
import Tag from "../models/Tag.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

export const getItemsByCollectionId = async (req, res) => {
    try {
        const items = await Item.aggregate([
            {$match: {collectionId: mongoose.Types.ObjectId(req.params.id)}},
            {$project: {
                    title: 1,
                    createdAt: 1,
                    tags: 1,
                    likes: 1,
                    _id: 0,
                    id: "$_id"
            }}
        ])
        res.json(items)
    } catch (e) {
        res.json({message: "Server error getting items in collection"})
    }
}

export const getItemById = async(req, res) => {
    try{
        const item = await Item.findById(req.params.id)
        res.json(item)
    } catch (e) {
        res.json({message: "Server error getting item"})
    }
}

export const likeItem = async(req, res) => {
    try{
        const user = await User.findById(req.userId)
        const itemUpdate = await Item.findByIdAndUpdate(req.body.id, {
            $push: {likes: user}
        })
        const item = await Item.aggregate([
            {$match: {_id: mongoose.Types.ObjectId(req.body.id)}},
            {$project: {
                    title: 1,
                    createdAt: 1,
                    tags: 1,
                    likes: 1,
                    _id: 0,
                    id: "$_id"
                }}
        ])
        res.json({item: item[0], _id: req.body.id})
    } catch (e) {
        res.json({message: "Server error liking item"})
    }
}

export const dislikeItem = async(req, res) => {
    try{
        const user = await User.findById(req.userId)
        await Item.findByIdAndUpdate(req.body.id, {
            $pullAll: {
                likes: [{_id: user._id}],
            },
        })
        const item = await Item.aggregate([
            {$match: {_id: mongoose.Types.ObjectId(req.body.id)}},
            {$project: {
                    title: 1,
                    createdAt: 1,
                    tags: 1,
                    likes: 1,
                    _id: 0,
                    id: "$_id"
                }}
        ])
        res.json({item: item[0], _id: req.body.id})
    } catch (e) {
        res.json({message: "Server error disliking item"})
    }
}

export const getLastItems = async(req,res) => {
    try{
        const items = await Item.find({},['title','collectionName'], {limit: 5, sort: {createdAt: -1}})
        res.json(items)
    } catch (e) {
        res.json({message: "Server error getting last items"})
    }
}

export const createItemInCollection = async (req, res) => {
    try {
        const {title, collectionId, tags} = req.body
        const allCreatedTagsTable = await Tag.find()
        const allCreatedTags = allCreatedTagsTable.map(({title}) => (title))
        const itemTags = tags.split(',')
        for(let i = 0; i<itemTags.length; i++){
            if(!allCreatedTags.includes(itemTags[i])) {
                const tag = new Tag({
                    title: itemTags[i]
                })
                await tag.save()
            }
        }
        const collection = await Collection.findById(collectionId)
        const newItem = new Item({
            title,
            collectionName: collection.title,
            collectionId: collectionId
        })

        await Collection.update({"_id": collectionId}, {
            $push: {items: newItem}
        })

        await Tag.update({title: {"$in": itemTags}}, {
            $push: {items: newItem}
        })

        const tagsIdTable = await Tag.find({title: {"$in": itemTags}})
        const tagsId = tagsIdTable.map(({_id}) => (_id))
        await newItem.save()

        await Item.update({_id: newItem._id}, {
            $push: {tags: tagsId}
        })

        const tofind = newItem._id
        const item = await Item.aggregate([
            {$match: {_id: mongoose.Types.ObjectId(tofind)}},
            {$project: {
                    title: 1,
                    createdAt: 1,
                    tags: 1,
                    likes: 1,
                    _id: 0,
                    id: "$_id"
                }}
        ])
        res.json(item[0])
    } catch (e) {
        res.json({message: "Server error creating items"})
    }
}

export const deleteItemInCollection = async(req, res) => {
    try{
        const item = await Item.findByIdAndDelete(req.params.id)
        await Collection.findByIdAndUpdate(item.collectionId, {
            $pullAll: {
                items: [{_id: req.params.id}],
            },
        })
        await Comment.deleteMany({"_id": {"$in": item.comments}})
        await Tag.update({_id: {"$in": item.tags}}, {
            $pullAll: {items: [{_id: req.params.id}]}
        })
        res.json({message: "Item was deleted.", _id: req.params.id})
    }catch (e) {
        res.json({message: "Server error deleting item"})
    }
}