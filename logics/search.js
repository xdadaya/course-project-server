import Item from "../models/Item.js";
import Comment from "../models/Comment.js";
import Collection from "../models/Collection.js";
import Tag from "../models/Tag.js";

export const fullTextSearch = async(req, res) => {
    try{
        const itemsFound = await Item.aggregate([
            { $match: {
                    $or: [
                        { 'title': { '$regex': req.params.query, '$options': 'i' } }
                    ]
                }}])
        let itemsId = []
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

        const items = allItems.filter(function(item, pos) {
            return allItems.indexOf(item) === pos;
        })
        console.log(itemsFound.length)
        console.log(foundNotInItem.length)
        console.log(allItems.length)
        console.log(items.length)
        console.log('Finish')
        res.json(items)
    } catch (e){
        res.json({message: "Server error searching"})
    }
}