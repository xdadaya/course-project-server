import {Router} from 'express';
import {checkAuth} from "../middleware/checkAuth.js";
import {createCommentByItemId, getCommentsByItemId} from "../logics/comment.js";

const router = new Router()

router.get('/:id', getCommentsByItemId)
router.post('/:id', checkAuth, createCommentByItemId)

export default router