import { Router } from 'express'
import {
    blockUsers,
    deleteUsers,
    getUsers,
    removeAdminRoleUsers,
    setAdminRoleUsers,
    unblockUsers
} from "../logics/user.js";

const router = new Router()

router.get('/', getUsers)
router.post('/block', blockUsers)
router.post('/unblock', unblockUsers)
router.post('/setadmin', setAdminRoleUsers)
router.post('/removeadmin', removeAdminRoleUsers)
router.post('/delete', deleteUsers)

export default router