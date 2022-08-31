import {Router} from "express";
import {fullTextSearch} from "../logics/search.js";

const router = new Router()

router.get('/:query', fullTextSearch)

export default router