import {Router} from "express";
import {
    getAdditionalFieldsByCollectionId,
    getAdditionalFieldsByItemId,
    getAdditionalFieldsForCreatingItem
} from "../logics/addFields.js";

const router = new Router()

router.get('/:id', getAdditionalFieldsByCollectionId)
router.get('/item/:id', getAdditionalFieldsByItemId)
router.get('/additem/:id', getAdditionalFieldsForCreatingItem)

export default router