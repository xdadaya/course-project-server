import {Router} from "express";
import {checkAuth} from "../middleware/checkAuth.js";
import {
    createItemInCollection,
    deleteItemInCollection, dislikeItem,
    getItemsByCollectionId,
    getLastItems,
    likeItem
} from "../logics/item.js";

const router = new Router()

router.get('/:id', getItemsByCollectionId)
router.post('/:id', checkAuth, createItemInCollection)
router.delete('/:id', deleteItemInCollection)
router.get('/', getLastItems)
router.put('/like', checkAuth, likeItem)
router.put('/dislike', checkAuth, dislikeItem)

export default router