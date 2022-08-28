import Tag from "../models/Tag.js";

export const getTags = async(req, res) => {
    try{
        const tags = await Tag.find()
        const items = tags.map(({title, _id}) => ({value: _id, label: title}))
        res.json(items)
    } catch (e) {
        res.json({message: "Server error"})
    }
}

export const getTagsWithValue = async(req, res) => {
    try{
        const tags = await Tag.find()
        const items = tags.map(({title, items}) => ({value: title, count: items.length}))
        res.json(items)
    } catch (e) {
        res.json({message: "Server error"})
    }
}

export const postTags = async(req, res) => {
    try{
        const {title} = req.body
        const tag = new Tag({
            title
        })
        await tag.save()
        res.json({tag, message: "Tag created"})
    } catch (e) {
        res.json({message: "Server error"})
    }
}