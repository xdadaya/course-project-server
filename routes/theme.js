import {Router} from "express";
import {getThemes} from "../logics/theme.js";

const router = new Router()

router.get('/', getThemes)

export default router