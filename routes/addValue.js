import {Router} from "express";
import {getAdditionalValuesByItemId} from "../logics/addValue.js";

const router = new Router()

router.get('/:id', getAdditionalValuesByItemId)

export default router