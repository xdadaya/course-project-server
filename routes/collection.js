import {Router} from "express";
import {checkAuth} from "../middleware/checkAuth.js";
import {
    createCollection, deleteCollectionById,
    getAllCollections,
    getCollectionById,
    getMyCollections, updateCollectionById
} from "../logics/collection.js";

const router = new Router()

router.post('/', checkAuth, createCollection)
router.get('/', getAllCollections)
router.get('/user-posts', checkAuth, getMyCollections)
router.get('/:id', getCollectionById)
router.delete('/:id', checkAuth, deleteCollectionById)
router.put('/:id', checkAuth, updateCollectionById)

export default router