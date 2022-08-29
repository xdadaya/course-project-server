import {Router} from "express";
import {getTags, getTagsByItemId, getTagsWithValue, postTags} from "../logics/tag.js";

const router = new Router()

router.get('/', getTags)
router.get('/main', getTagsWithValue)
router.post('/', postTags)
router.get('/:id', getTagsByItemId)

export default router