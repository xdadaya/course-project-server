import {Router} from "express";
import {getTags, getTagsWithValue, postTags} from "../logics/tag.js";

const router = new Router()

router.get('/', getTags)
router.get('/main', getTagsWithValue)
router.post('/', postTags)

export default router