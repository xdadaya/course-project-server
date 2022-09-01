import Item from "../models/Item.js";
import Tag from "../models/Tag.js";
import Collection from "../models/Collection.js";
import Comment from "../models/Comment.js";

export const fullTextSearch = async (req, res) => {
    try {
        let itemsId = []
        const itemsFound = await Item.aggregate([{
            $search: {
                index: 'itemIndex',
                text: {query: req.params.query, path: {wildcard: '*'}}
            }
        }])
        const tags = await Tag.aggregate([{
            $search: {
                index: 'tagIndex',
                text: {query: req.params.query, path: {wildcard: '*'}}
            }
        }])
        const collections = await Collection.aggregate([{
            $search: {
                index: 'collectionIndex',
                text: {query: req.params.query, path: {wildcard: '*'}}
            }
        }])
        const comments = await Comment.aggregate([
            { $match: {
                    $or: [
                        { 'username': { '$regex': req.params.query, '$options': 'i' } },
                        { 'text': { '$regex': req.params.query, '$options': 'i' } }
                    ]
                }}])


        tags.map(({items})=>{
            itemsId.push(...items)
        })
        collections.map(({items})=>{
            itemsId.push(...items)
        })
        comments.map(({itemId}) => {
            itemsId.push(itemId)
        })

        const notInItem = await Item.find().where('_id').in(itemsId)
        const allItems = itemsFound.concat(notInItem)
        const items = allItems.filter((value, index) => {
            const _value = JSON.stringify(value);
            return index === allItems.findIndex(obj => {
                return JSON.stringify(obj) === _value;
            });
        });
        res.json(items)
    } catch (e) {
        res.json({message: "Server error searching"})
    }
}