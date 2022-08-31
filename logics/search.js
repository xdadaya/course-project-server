import Item from "../models/Item.js";
import Comment from "../models/Comment.js";
import Collection from "../models/Collection.js";
import Tag from "../models/Tag.js";

export const fullTextSearch = async(req, res) => {
    try{
        let itemsId = []
        const itemsFound = await Item.aggregate([
            { $match: {
                    $or: [
                        { 'title': { '$regex': req.params.query, '$options': 'i' } }
                    ]
                }}])

        const commentsFound = await Comment.aggregate([
            { $match: {
                    $or: [
                        { 'username': { '$regex': req.params.query, '$options': 'i' } },
                        { 'text': { '$regex': req.params.query, '$options': 'i' } }
                    ]
            }}])

        const collectionsFound = await Collection.aggregate([
            { $match: {
                    $or: [
                        { 'title': { '$regex': req.params.query, '$options': 'i' } },
                        { 'description': { '$regex': req.params.query, '$options': 'i' } },
                        { 'theme': { '$regex': req.params.query, '$options': 'i' } },
                        { 'username': { '$regex': req.params.query, '$options': 'i' } }
                    ]
                }}])

        const tagsFound = await Tag.aggregate([
            { $match: {
                    $or: [
                        { 'title': { '$regex': req.params.query, '$options': 'i' } }
                    ]
                }}])

        commentsFound.map(({itemId}) => {
            itemsId.push(itemId)
        })

        tagsFound.map(({items}) => {
            items.map((item)=>{
                itemsId.push(item)
            })
        })

        collectionsFound.map(({items}) => {
            items.map((item)=>{
                itemsId.push(item)
            })
        })


        const foundNotInItem = await Item.find().where('_id').in(itemsId)
        const allItems = itemsFound.concat(foundNotInItem)

        const items = allItems.filter((value, index) => {
            const _value = JSON.stringify(value);
            return index === allItems.findIndex(obj => {
                return JSON.stringify(obj) === _value;
            });
        });
        res.json(items)
    } catch (e){
        res.json({message: "Server error searching"})
    }
}