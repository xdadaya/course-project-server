import { Router } from 'express'
import { register, login, getUser } from '../logics/auth.js'
import {checkAuth} from "../middleware/checkAuth.js";

const router = new Router()

router.post('/register', register)
router.post('/login', login)
router.get('/getuser', checkAuth, getUser)

export default router